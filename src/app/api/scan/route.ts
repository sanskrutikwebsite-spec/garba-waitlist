import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { jwtVerify } from "jose";

export async function POST(request: Request) {
  try {
    const { ticketId: jwtString } = await request.json();

    if (!jwtString) {
      return NextResponse.json({ error: "Missing Ticket ID" }, { status: 400 });
    }

    let ticketId = jwtString;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-demo-only');
      const { payload } = await jwtVerify(jwtString, secret);
      ticketId = payload.id as string;
    } catch (e) {
      // If it fails to verify, maybe it was an old raw UUID, or it's totally invalid.
      // We will let the normal UUID lookup fail below if it's junk.
    }

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);
    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow();
    
    // Auto-create SCANNED COUNT column if missing
    if (!sheet.headerValues.includes('SCANNED COUNT')) {
      await sheet.setHeaderRow([...sheet.headerValues, 'SCANNED COUNT']);
    }
    
    
    const rows = await sheet.getRows();
    
    // Find ALL rows with this specific secure Ticket ID, or by phone number, or by short ID
    const targetRows = rows.filter(r => {
      const tid = r.get('TICKET ID') || '';
      const phone = r.get('PHONE') || r.get('PHONE NUMBER') || '';
      return tid === ticketId || (ticketId.length >= 6 && tid.startsWith(ticketId)) || phone === ticketId;
    });

    if (targetRows.length === 0) {
      // Fake/Invalid ticket
      return NextResponse.json({ 
        valid: false, 
        message: "INVALID TICKET - NO MATCH FOUND",
        errorType: "INVALID"
      }, { status: 404 });
    }

    if (targetRows.length > 1) {
      // Return list of passes to let the volunteer choose
      const tickets = targetRows.map(r => {
        const totalPasses = parseInt(r.get('PASSES')) || 1;
        const scannedCount = parseInt(r.get('SCANNED COUNT')) || 0;
        return {
          ticketId: r.get('TICKET ID'),
          name: r.get('NAME'),
          totalPasses,
          remaining: totalPasses - scannedCount,
          status: r.get('STATUS')
        };
      });
      
      return NextResponse.json({
        multiple: true,
        tickets
      });
    }

    const targetRow = targetRows[0];

    const currentStatus = targetRow.get('STATUS');

    if (currentStatus === 'Scanned') {
      // Already used
      return NextResponse.json({ 
        valid: false, 
        message: "ALREADY USED - THIS TICKET WAS ALREADY SCANNED",
        errorType: "USED",
        name: targetRow.get('NAME')
      }, { status: 409 });
    }

    if (currentStatus !== 'Approved') {
      // Found but not approved
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

    console.log(`Ticket ${ticketId} verified for ${targetRow.get('NAME')}. Remaining: ${remaining}`);

    return NextResponse.json({ 
      valid: true, 
      message: "TICKET VERIFIED",
      name: targetRow.get('NAME'),
      passes: totalPasses,
      scannedCount: scannedCount,
      remaining: remaining,
      ticketId: targetRow.get('TICKET ID')
    });

  } catch (error) {
    console.error("Error scanning ticket:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
