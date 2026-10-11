import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { notFound } from "next/navigation";
import PassClient from "./PassClient";
import { SignJWT } from "jose";
import { findGuestPass } from "@/lib/guestPassRegistry";

async function getTicketData(ticketId: string) {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);
    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[0];
    
    const rows = await sheet.getRows();
    const targetRow = rows.find(r => r.get('TICKET ID') === ticketId);

    if (!targetRow) return null;

    return {
      name: targetRow.get('NAME'),
      passes: targetRow.get('PASSES'),
      status: targetRow.get('STATUS'),
    };
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return null;
  }
}

export default async function PassPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId: rawTicketId } = await params;
  let ticketId = rawTicketId;
  let ticketName = "";
  let ticketPasses = "1";
  // QR data is just the full pass URL (short, real-looking)
  const qrData = `https://www.sanskrutikgarba.in/pass/${rawTicketId}`;

  // 1. Check hardcoded guest pass registry first (no Google Sheets, no env vars)
  const guestPass = findGuestPass(rawTicketId);
  if (guestPass) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] bg-[url('/bg-vertical.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
        <div className="z-10 w-full max-w-md">
          <PassClient
            ticketId={guestPass.ticketId}
            name={guestPass.name}
            passes={String(guestPass.passes)}
            qrData={qrData}
          />
        </div>
      </div>
    );
  }

  // 2. Try to decode as JWT (legacy passes)
  try {
    const { jwtVerify } = await import("jose");
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-demo-only');
    const decoded = await jwtVerify(rawTicketId, secret);
    ticketName = (decoded.payload.name as string) || "";
    ticketPasses = (decoded.payload.passes as string) || "1";
    ticketId = (decoded.payload.id as string) || rawTicketId;
  } catch (e) {
    // 3. Fallback: look up in Google Sheets
    const ticketData = await getTicketData(rawTicketId);

    if (!ticketData || ticketData.status !== 'Approved') {
      notFound();
    }

    ticketName = ticketData.name;
    ticketPasses = ticketData.passes;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-demo-only');
    await new SignJWT({ 
      id: rawTicketId, 
      name: ticketData.name, 
      passes: ticketData.passes 
    })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[url('/bg-vertical.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
      
      <div className="z-10 w-full max-w-md">
        <PassClient 
          ticketId={ticketId}
          name={ticketName}
          passes={ticketPasses}
          qrData={qrData}
        />
      </div>
    </div>
  );
}
