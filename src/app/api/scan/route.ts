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
    
    const rows = await sheet.getRows();
    
    // Find the row with this specific secure Ticket ID
    const targetRow = rows.find(r => r.get('TICKET ID') === ticketId);

    if (!targetRow) {
      // Fake/Invalid ticket
      return NextResponse.json({ 
        valid: false, 
        message: "INVALID TICKET - NO MATCH FOUND",
        errorType: "INVALID"
      }, { status: 404 });
    }

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

    // It is valid and approved! Mark as scanned.
    targetRow.assign({ 'STATUS': 'Scanned' });
    await targetRow.save();

    console.log(`Ticket ${ticketId} successfully scanned for ${targetRow.get('NAME')}`);

    return NextResponse.json({ 
      valid: true, 
      message: "ENTRY GRANTED",
      name: targetRow.get('NAME'),
      passes: targetRow.get('PASSES')
    });

  } catch (error) {
    console.error("Error scanning ticket:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
