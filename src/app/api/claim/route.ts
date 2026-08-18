import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(request: Request) {
  try {
    const { rowId, adminName } = await request.json();

    if (!rowId || !adminName) {
      return NextResponse.json({ error: "Missing rowId or adminName" }, { status: 400 });
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
    const targetRow = rows.find(r => r.rowNumber === rowId);

    if (!targetRow) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    // Update row
    targetRow.assign({ 'CLAIMED BY': adminName });
    await targetRow.save();

    console.log(`Row ${rowId} claimed by ${adminName}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error claiming registration:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
