import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { findGuestPass, normalizePhone, cleanTicketInput } from "@/lib/guestPassRegistry";
import { getGuestScans, saveGuestScan } from "@/lib/guestPassStore";

export async function POST(request: Request) {
  try {
    const { ticketId, enteringCount } = await request.json();

    if (!ticketId || !enteringCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rawTicketId = cleanTicketInput(ticketId);

    // ─── PRIORITY 1: Hardcoded guest pass registry ───────────────────────────
    const guestPass = findGuestPass(rawTicketId);
    if (guestPass) {
      const key = guestPass.ticketId.toLowerCase();
      const guestScans = getGuestScans();
      const currentScanned = guestScans[key]?.scannedCount || 0;
      const newScanned = currentScanned + parseInt(enteringCount);

      if (newScanned > guestPass.passes) {
        return NextResponse.json({ valid: false, message: "Cannot exceed total passes" }, { status: 400 });
      }

      saveGuestScan(key, {
        scannedCount: newScanned,
        totalPasses: guestPass.passes,
        name: `${guestPass.name} (Pass #${guestPass.id})`,
        lastScanned: new Date().toISOString()
      });

      return NextResponse.json({
        valid: true,
        message: "ENTRY CONFIRMED",
        name: `${guestPass.name} (Pass #${guestPass.id})`,
        passes: guestPass.passes,
        scannedCount: newScanned
      });
    }

    // ─── PRIORITY 2: Legacy JWT passes ───────────────────────────────────────
    let cleanSearchId = rawTicketId;
    let payloadData: any = null;
    try {
      const { jwtVerify } = await import("jose");
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-demo-only');
      const { payload } = await jwtVerify(rawTicketId, secret);
      payloadData = payload;
      cleanSearchId = (payload.id as string) || rawTicketId;
    } catch (e) {
      // Raw UUID
    }

    if (payloadData) {
      const key = cleanSearchId.toLowerCase();
      const guestScans = getGuestScans();
      const currentScanned = guestScans[key]?.scannedCount || 0;
      const totalPasses = parseInt(payloadData.passes as string) || 1;
      const newScanned = currentScanned + parseInt(enteringCount);

      if (newScanned > totalPasses) {
        return NextResponse.json({ valid: false, message: "Cannot exceed total passes" }, { status: 400 });
      }

      saveGuestScan(key, {
        scannedCount: newScanned,
        totalPasses,
        name: (payloadData.name as string) || "Guest",
        lastScanned: new Date().toISOString()
      });

      return NextResponse.json({
        valid: true,
        message: "ENTRY CONFIRMED",
        name: (payloadData.name as string) || "Guest",
        passes: totalPasses,
        scannedCount: newScanned
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

    const cleanConfirmPhone = normalizePhone(cleanSearchId);
    const confirmTid = cleanSearchId.toLowerCase();

    const targetRow = rows.find(r => {
      const tid = (r.get('TICKET ID') || '').trim().toLowerCase();
      const rowPhone = normalizePhone(r.get('PHONE') || r.get('PHONE NUMBER') || '');
      
      return tid === confirmTid ||
        (confirmTid.length >= 6 && tid.startsWith(confirmTid)) ||
        (cleanConfirmPhone.length >= 10 && rowPhone === cleanConfirmPhone);
    });

    if (!targetRow) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const totalPasses = parseInt(targetRow.get('PASSES')) || 1;
    const currentScannedCount = parseInt(targetRow.get('SCANNED COUNT')) || 0;
    const newScannedCount = currentScannedCount + parseInt(enteringCount);

    if (newScannedCount > totalPasses) {
      return NextResponse.json({ valid: false, message: "Cannot exceed total passes" }, { status: 400 });
    }

    const newStatus = newScannedCount === totalPasses ? 'Scanned' : 'Approved';
    targetRow.set('SCANNED COUNT', newScannedCount.toString());
    targetRow.set('STATUS', newStatus);
    await targetRow.save();

    return NextResponse.json({
      valid: true,
      message: "ENTRY CONFIRMED",
      name: targetRow.get('NAME'),
      passes: totalPasses,
      scannedCount: newScannedCount
    });

  } catch (error) {
    console.error("Error confirming scan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
