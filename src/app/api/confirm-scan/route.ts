import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(request: Request) {
  try {
    const { ticketId, enteringCount } = await request.json();

    if (!ticketId || !enteringCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
    
    const targetRow = rows.find(r => {
      const tid = r.get('TICKET ID') || '';
      const phone = r.get('PHONE') || r.get('PHONE NUMBER') || '';
      return tid === ticketId || (ticketId.length >= 6 && tid.startsWith(ticketId)) || phone === ticketId;
    });

    if (!targetRow) {
      return NextResponse.json({ valid: false, message: "INVALID TICKET" }, { status: 404 });
    }

    const totalPasses = parseInt(targetRow.get('PASSES')) || 1;
    const currentScannedCount = parseInt(targetRow.get('SCANNED COUNT')) || 0;
    
    const newScannedCount = currentScannedCount + parseInt(enteringCount);

    if (newScannedCount > totalPasses) {
      return NextResponse.json({ valid: false, message: "Cannot exceed total passes" }, { status: 400 });
    }

    // Determine status
    const newStatus = (newScannedCount === totalPasses) ? 'Scanned' : 'Approved';

    // Update the row
    // NOTE: For 'SCANNED COUNT' to be updated, the user must add it as a header in their Google Sheet!
    // If it's missing, this might throw an error depending on google-spreadsheet version.
    targetRow.set('SCANNED COUNT', newScannedCount.toString());
    targetRow.set('STATUS', newStatus);
    
    await targetRow.save();

    console.log(`Ticket ${ticketId}: ${enteringCount} people entered. Total Scanned: ${newScannedCount}/${totalPasses}`);

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
