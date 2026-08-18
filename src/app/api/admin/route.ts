import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { SignJWT } from "jose";

export async function GET() {
  try {
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

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-demo-only');

    // Map rows to a cleaner JSON structure for the frontend
    const registrations = await Promise.all(rows.map(async (row, index) => {
      // Row numbers in google sheets start at 1 (header), so actual data starts at 2
      // `row.rowNumber` is the physical row number in the sheet
      const status = row.get('STATUS');
      const ticketId = row.get('TICKET ID');
      const name = row.get('NAME');
      const passes = row.get('PASSES');

      let qrData = undefined;
      if (status === 'Approved' && ticketId) {
        qrData = await new SignJWT({ 
          id: ticketId, 
          name: name, 
          passes: passes 
        })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secret);
      }

      return {
        id: row.rowNumber,
        name: name,
        email: row.get('EMAIL'),
        phone: row.get('PHONE'),
        passes: passes,
        screenshot: row.get('SCREENTSHOT'),
        status: status,
        ticketId: ticketId,
        date: row.get('DATE'),
        claimedBy: row.get('CLAIMED BY') || '',
        qrData: qrData
      };
    }));

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Error fetching registrations from Google Sheets:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
