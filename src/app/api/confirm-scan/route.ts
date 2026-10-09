import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(request: Request) {
  try {
    const { ticketId, enteringCount } = await request.json();

    if (!ticketId || !enteringCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let rawTicketId = (ticketId || "").trim();
    try {
      rawTicketId = decodeURIComponent(rawTicketId);
    } catch (e) {
      // ignore
    }

    if (rawTicketId.includes('/pass/')) {
      rawTicketId = rawTicketId.split('/pass/').pop()?.split('?')[0] || rawTicketId;
    } else if (rawTicketId.includes('http')) {
      try {
        const url = new URL(rawTicketId);
        rawTicketId = url.searchParams.get('id') || url.pathname.split('/').pop() || rawTicketId;
      } catch (e) {
        // fallback
      }
    }

    let cleanSearchId = rawTicketId;
    try {
      const { jwtVerify } = await import("jose");
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-demo-only');
      const { payload } = await jwtVerify(rawTicketId, secret);
      cleanSearchId = (payload.id as string) || rawTicketId;
    } catch (e) {
      // Raw UUID
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
      return tid === cleanSearchId || tid === rawTicketId || (cleanSearchId.length >= 6 && tid.startsWith(cleanSearchId)) || phone === cleanSearchId;
    });

    if (!targetRow) {
      let name = "Pass Holder";
      let passesCount = parseInt(enteringCount) || 1;
      let cleanTicketId = ticketId;
      try {
        const { jwtVerify } = await import("jose");
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-demo-only');
        const { payload } = await jwtVerify(ticketId, secret);
        name = (payload.name as string) || "Pass Holder";
        passesCount = parseInt(payload.passes as string) || passesCount;
        cleanTicketId = (payload.id as string) || ticketId;
      } catch (e) {
        // Raw UUID or fallback
      }

      const newScannedCount = parseInt(enteringCount) || 1;
      const newStatus = (newScannedCount >= passesCount) ? 'Scanned' : 'Approved';

      try {
        await sheet.addRow({
          'NAME': name,
          'EMAIL': 'Offline Pass',
          'PHONE': 'OFFLINE',
          'PASSES': passesCount.toString(),
          'SCREENTSHOT': 'Offline Pass',
          'STATUS': newStatus,
          'DATE': new Date().toISOString(),
          'TICKET ID': cleanTicketId,
          'SCANNED COUNT': newScannedCount.toString()
        });
      } catch (e) {
        console.error("Error auto-adding missing row during scan confirmation:", e);
      }

      return NextResponse.json({ 
        valid: true, 
        message: "ENTRY CONFIRMED",
        name: name,
        passes: passesCount,
        scannedCount: newScannedCount
      });
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
