import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

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

    if (targetRow.get('STATUS') !== 'Approved') {
        return NextResponse.json({ error: "Can only revoke passes that are Approved" }, { status: 400 });
    }

    // Revoke row approval
    targetRow.assign({ 'STATUS': 'Pending', 'TICKET ID': 'TBD' });
    await targetRow.save(); // Save changes back to Google Sheets

    console.log(`Successfully revoked approval for row ${rowId}.`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revoking approval:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
