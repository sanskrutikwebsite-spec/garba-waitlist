import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function generateDirectPass() {
  const secretKey = process.env.JWT_SECRET || 'fallback-secret-for-demo-only';
  const secret = new TextEncoder().encode(secretKey);

  const ticketId = uuidv4();
  const guestName = "Sanskrutik Guest";
  const passCount = "10";

  const jwtPayload = {
    id: ticketId,
    name: guestName,
    passes: passCount
  };

  const jwt = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);

  const passUrl = `https://www.sanskrutikgarba.in/pass/${encodeURIComponent(jwt)}`;
  const localPassUrl = `http://localhost:3000/pass/${encodeURIComponent(jwt)}`;

  const outputDir = path.join(process.cwd(), "public", "guest-passes");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const qrFilename = `direct_pass_10_passes_${ticketId.substring(0, 8)}.png`;
  const qrFilePath = path.join(outputDir, qrFilename);

  // Generate high-resolution QR PNG encoding the signed JWT payload
  await QRCode.toFile(qrFilePath, jwt, {
    errorCorrectionLevel: 'H',
    width: 600,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  console.log("========================================================");
  console.log("    SUCCESS: DIRECT ENTRY 10-PASS TICKET GENERATED     ");
  console.log("    (No Google Sheets / DB Record Created)             ");
  console.log("========================================================\n");
  console.log("Holder Name  :", guestName);
  console.log("Pass Capacity:", passCount, "Persons");
  console.log("Ticket ID    :", ticketId);
  console.log("Live URL     :", passUrl);
  console.log("Local URL    :", localPassUrl);
  console.log("QR File Path :", qrFilePath);
  console.log("--------------------------------------------------------");

  // Output formatted text file
  const textOutput = `=====================================================
          SANSKRUTIK SHERI GARBA 2026
      DIRECT ENTRY GUEST PASS (10 PASSES)
=====================================================

Pass Holder Name : ${guestName}
Pass Capacity    : ${passCount} Persons
Ticket ID        : ${ticketId.toUpperCase()}

Digital Pass Link:
${passUrl}

Venue:
Hrishimani Party Plot, nr. Nirma University, Vaishnodevi, Ahmedabad – 382470

Instructions:
1. Open the Digital Pass Link above on your mobile device.
2. Show the QR code at the entry gate for instant scanning.
3. Traditional Navratri attire is required for entry.
=====================================================`;

  fs.writeFileSync(path.join(process.cwd(), "Sanskrutik_Direct_Guest_10_Pass.txt"), textOutput);
  fs.writeFileSync(path.join(outputDir, "direct_pass_info.json"), JSON.stringify({
    ticketId,
    name: guestName,
    passes: passCount,
    jwt,
    passUrl,
    qrFilename
  }, null, 2));
}

generateDirectPass().catch(console.error);
