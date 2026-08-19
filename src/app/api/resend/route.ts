import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { sendPassEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { rowId } = await request.json();

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const targetRow = rows.find(r => r.rowNumber === rowId);

    if (!targetRow) {
      return NextResponse.json({ success: false, error: "Row not found" }, { status: 404 });
    }

    const email = targetRow.get('EMAIL');
    const name = targetRow.get('NAME');
    const passes = targetRow.get('PASSES');
    const ticketId = targetRow.get('TICKET ID');
    const status = targetRow.get('STATUS');

    if (status !== 'Approved') {
       return NextResponse.json({ success: false, error: "Pass is not approved yet" }, { status: 400 });
    }

    if (!email || email === 'Offline' || !email.includes('@')) {
      return NextResponse.json({ success: false, error: "No valid email address found for this user" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || new URL(request.url).origin;
    const sent = await sendPassEmail(email, name, passes, ticketId, origin);

    if (sent) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Failed to send email. Check Nodemailer config." }, { status: 500 });
    }
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
