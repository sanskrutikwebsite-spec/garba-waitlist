import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import { SignJWT } from "jose";
import { sendPassEmail } from "@/lib/sendEmail";

export async function POST(request: Request) {
  try {
    const { rowId } = await request.json();

    if (!rowId) {
      return NextResponse.json({ error: "Missing rowId" }, { status: 400 });
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
    
    // Get all rows, find the exact one by physical row number
    const rows = await sheet.getRows();
    const targetRow = rows.find(r => r.rowNumber === rowId);

    if (!targetRow) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    // Generate unique secure ID
    const ticketId = uuidv4();
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-demo-only');
    const jwt = await new SignJWT({ 
      id: ticketId, 
      name: targetRow.get('NAME'), 
      passes: targetRow.get('PASSES') 
    })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);

    // Update row
    targetRow.assign({ 'STATUS': 'Approved', 'TICKET ID': ticketId });
    await targetRow.save(); // Save changes back to Google Sheets

    // Send automated email if email exists and is valid
    const email = targetRow.get('EMAIL');
    if (email && email !== 'Offline' && email.includes('@')) {
      const origin = request.headers.get("origin") || new URL(request.url).origin;
      await sendPassEmail(email, targetRow.get('NAME'), targetRow.get('PASSES'), ticketId, origin);
    }

    console.log(`Successfully approved row ${rowId}. Ticket ID: ${ticketId}`);

    return NextResponse.json({ success: true, ticketId, qrData: jwt });
  } catch (error) {
    console.error("Error approving registration:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
