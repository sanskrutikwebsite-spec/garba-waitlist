import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { jwtVerify } from "jose";
import { findGuestPass, findGuestPassesByPhone, normalizePhone, cleanTicketInput } from "@/lib/guestPassRegistry";
import { getGuestScans } from "@/lib/guestPassStore";

export async function POST(request: Request) {
  try {
    const { ticketId: jwtString } = await request.json();

    if (!jwtString) {
      return NextResponse.json({ error: "Missing Ticket ID" }, { status: 400 });
    }

    const rawInput = cleanTicketInput(jwtString);

    // ─── PRIORITY 1: Hardcoded guest pass registry ───────────────────────────
    // Check if input is a phone number with multiple guest passes
    const phoneMatches = findGuestPassesByPhone(rawInput);
    if (phoneMatches.length > 1) {
      const guestScans = getGuestScans();
      const tickets = phoneMatches.map(p => {
        const record = guestScans[p.ticketId.toLowerCase()];
        const scannedCount = record ? record.scannedCount : 0;
        const remaining = Math.max(0, p.passes - scannedCount);
        return {
          ticketId: p.ticketId,
          name: `${p.name} (Pass #${p.id})`,
          totalPasses: p.passes,
          remaining,
          status: remaining > 0 ? "Approved" : "Scanned"
        };
      });
      return NextResponse.json({ multiple: true, tickets });
    }

    // Check single match (by full UUID, short ticket ID prefix, or single phone match)
    const guestPass = findGuestPass(rawInput);
    if (guestPass) {
      const guestScans = getGuestScans();
      const record = guestScans[guestPass.ticketId.toLowerCase()];
      const scannedCount = record ? record.scannedCount : 0;
      const remaining = guestPass.passes - scannedCount;

      if (remaining <= 0) {
        return NextResponse.json({
          valid: false,
          message: "ALREADY USED - NO PASSES REMAINING",
          errorType: "USED",
          name: `${guestPass.name} (Pass #${guestPass.id})`
        }, { status: 409 });
      }

      return NextResponse.json({
        valid: true,
        message: "TICKET VERIFIED",
        name: `${guestPass.name} (Pass #${guestPass.id})`,
        passes: guestPass.passes,
        scannedCount,
        remaining,
        ticketId: guestPass.ticketId
      });
    }

    let ticketId = rawInput;
    let payloadData: any = null;

    // ─── PRIORITY 2: Legacy JWT passes ───────────────────────────────────────
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-demo-only');
      const { payload } = await jwtVerify(rawInput, secret);
      payloadData = payload;
      ticketId = (payload.id as string) || rawInput;
    } catch (e) {
      // Raw UUID or phone number
    }

    if (payloadData) {
      const guestScans = getGuestScans();
      const record = guestScans[ticketId.toLowerCase()];
      const totalPasses = parseInt(payloadData.passes as string) || 1;
      const scannedCount = record ? record.scannedCount : 0;
      const remaining = totalPasses - scannedCount;

      if (remaining <= 0) {
        return NextResponse.json({
          valid: false,
          message: "ALREADY USED - NO PASSES REMAINING",
          errorType: "USED",
          name: (payloadData.name as string) || "Guest"
        }, { status: 409 });
      }

      return NextResponse.json({
        valid: true,
        message: "TICKET VERIFIED",
        name: (payloadData.name as string) || "Guest",
        passes: totalPasses,
        scannedCount,
        remaining,
        ticketId: ticketId
      });
    }

    // ─── PRIORITY 3: Google Sheets (regular registered attendees) ─────────────
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow();

    if (!sheet.headerValues.includes('SCANNED COUNT')) {
      await sheet.setHeaderRow([...sheet.headerValues, 'SCANNED COUNT']);
    }

    const rows = await sheet.getRows();

    const cleanSearchPhone = normalizePhone(ticketId);
    const searchTid = ticketId.toLowerCase();

    const targetRows = rows.filter(r => {
      const tid = (r.get('TICKET ID') || '').trim().toLowerCase();
      const rowPhone = normalizePhone(r.get('PHONE') || r.get('PHONE NUMBER') || '');
      
      const tidMatch = tid === searchTid || (searchTid.length >= 6 && tid.startsWith(searchTid));
      const phoneMatch = cleanSearchPhone.length >= 10 && rowPhone === cleanSearchPhone;

      return tidMatch || phoneMatch;
    });

    if (targetRows.length === 0) {
      return NextResponse.json({
        valid: false,
        message: "INVALID TICKET - NO MATCH FOUND",
        errorType: "INVALID"
      }, { status: 404 });
    }

    if (targetRows.length > 1) {
      const tickets = targetRows.map(r => {
        const totalPasses = parseInt(r.get('PASSES')) || 1;
        const scannedCount = parseInt(r.get('SCANNED COUNT')) || 0;
        return {
          ticketId: r.get('TICKET ID'),
          name: r.get('NAME'),
          totalPasses,
          remaining: Math.max(0, totalPasses - scannedCount),
          status: r.get('STATUS')
        };
      });
      return NextResponse.json({ multiple: true, tickets });
    }

    const targetRow = targetRows[0];
    const currentStatus = targetRow.get('STATUS');

    if (currentStatus === 'Scanned') {
      return NextResponse.json({
        valid: false,
        message: "ALREADY USED - THIS TICKET WAS ALREADY SCANNED",
        errorType: "USED",
        name: targetRow.get('NAME')
      }, { status: 409 });
    }

    if (currentStatus !== 'Approved') {
      return NextResponse.json({
        valid: false,
        message: "NOT APPROVED - TICKET IS PENDING OR REJECTED",
        errorType: "PENDING",
        name: targetRow.get('NAME')
      }, { status: 403 });
    }

    const totalPasses = parseInt(targetRow.get('PASSES')) || 1;
    const scannedCount = parseInt(targetRow.get('SCANNED COUNT')) || 0;
    const remaining = totalPasses - scannedCount;

    if (remaining <= 0) {
      return NextResponse.json({
        valid: false,
        message: "ALREADY USED - NO PASSES REMAINING",
        errorType: "USED",
        name: targetRow.get('NAME')
      }, { status: 409 });
    }

    return NextResponse.json({
      valid: true,
      message: "TICKET VERIFIED",
      name: targetRow.get('NAME'),
      passes: totalPasses,
      scannedCount,
      remaining,
      ticketId: targetRow.get('TICKET ID')
    });

  } catch (error) {
    console.error("Error scanning ticket:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
