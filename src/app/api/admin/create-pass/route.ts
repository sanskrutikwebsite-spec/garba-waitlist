import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import { SignJWT } from "jose";
import { sendPassEmail } from "@/lib/sendEmail";

export async function POST(request: Request) {
  try {
    const { name, email, phone, passes, adminName } = await request.json();

    if (!name || !phone || !passes) {
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

    const ticketId = uuidv4();
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-demo-only');
    const jwt = await new SignJWT({ 
      id: ticketId, 
      name: name, 
      passes: passes 
    })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);

    await sheet.addRow({
      'NAME': name,
      'EMAIL': email || 'Offline',
      'PHONE': phone,
      'PASSES': passes,
      'SCREENTSHOT': 'Offline Payment',
      'STATUS': 'Approved',
      'DATE': new Date().toISOString(),
      'TICKET ID': ticketId
    });

    if (email && email.includes('@')) {
      const origin = request.headers.get("origin") || new URL(request.url).origin;
      await sendPassEmail(email, name, passes, ticketId, origin);
    }

    console.log(`Successfully created offline pass for ${name}. Ticket ID: ${ticketId}`);

    return NextResponse.json({ success: true, ticketId, qrData: jwt });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
