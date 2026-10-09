import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const passCounts = [50, 30, 30, 20, 20, 10];
const guestName = "Sanskrutik Guest";

async function main() {
  const secretKey = process.env.JWT_SECRET || 'fallback-secret-for-demo-only';
  const secret = new TextEncoder().encode(secretKey);

  const outputDir = path.join(process.cwd(), "public", "guest-passes");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Connect to Google Sheets if credentials are present
  let sheet = null;
  try {
    if (process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
      await doc.loadInfo();
      sheet = doc.sheetsByIndex[0];
      console.log("Connected to Google Sheets successfully.");
    }
  } catch (err) {
    console.warn("Google Sheets connection notice:", err.message);
  }

  const generatedPasses = [];

  for (let i = 0; i < passCounts.length; i++) {
    const count = passCounts[i];
    const ticketId = uuidv4();

    const jwtPayload = {
      id: ticketId,
      name: guestName,
      passes: count.toString()
    };

    const jwt = await new SignJWT(jwtPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    const passUrl = `https://www.sanskrutikgarba.in/pass/${encodeURIComponent(jwt)}`;
    const localPassUrl = `http://localhost:3000/pass/${encodeURIComponent(jwt)}`;

    // Generate QR Code PNG
    const qrFilename = `pass_${i + 1}_${count}_passes_${ticketId.substring(0, 8)}.png`;
    const qrFilePath = path.join(outputDir, qrFilename);
    
    // QR Code encodes the JWT payload (same as website scanner)
    await QRCode.toFile(qrFilePath, jwt, {
      errorCorrectionLevel: 'H',
      width: 500,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Add to Google Sheets if available
    if (sheet) {
      try {
        await sheet.addRow({
          'NAME': guestName,
          'EMAIL': 'Offline Guest',
          'PHONE': `GUEST-PASS-${i + 1}`,
          'PASSES': count.toString(),
          'SCREENTSHOT': 'VIP Guest Pass',
          'STATUS': 'Approved',
          'DATE': new Date().toISOString(),
          'TICKET ID': ticketId
        });
        console.log(`Added Pass #${i + 1} (${count} passes) to Google Sheets.`);
      } catch (err) {
        console.error(`Failed to add row to sheet for pass #${i + 1}:`, err.message);
      }
    }

    generatedPasses.push({
      index: i + 1,
      name: guestName,
      passes: count,
      ticketId: ticketId,
      jwt: jwt,
      passUrl: passUrl,
      localPassUrl: localPassUrl,
      qrFilename: qrFilename,
      qrRelativeUrl: `/guest-passes/${qrFilename}`
    });
  }

  // Create an HTML preview page for all guest passes
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanskrutik Guest Passes</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fff; padding: 40px 20px; margin: 0; }
    .header { text-align: center; margin-bottom: 40px; }
    h1 { color: #E3C57F; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0; font-size: 32px; }
    p.subtitle { color: #aaa; margin: 0; font-size: 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
    .card { background: linear-gradient(145deg, #5c0e18, #3a060d); border: 1px solid rgba(227, 197, 127, 0.4); border-radius: 24px; padding: 30px 20px; text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.6); position: relative; overflow: hidden; }
    .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #cda434, #f9e596, #cda434); }
    .card h2 { color: #E3C57F; margin: 0 0 5px 0; font-size: 26px; text-transform: uppercase; font-weight: 900; }
    .badge { background: #E3C57F; color: #000; font-weight: 900; padding: 6px 16px; border-radius: 20px; display: inline-block; margin: 10px 0 15px 0; font-size: 15px; text-transform: uppercase; tracking-spacing: 1px; }
    .holder { font-size: 18px; font-weight: bold; text-transform: uppercase; color: #fff; margin-bottom: 10px; }
    .qr-box { background: #fff; padding: 15px; border-radius: 18px; display: inline-block; margin: 15px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
    .qr-box img { width: 220px; height: 220px; display: block; }
    .details { font-size: 14px; color: #ccc; margin-top: 10px; line-height: 1.6; }
    .details strong { color: #fff; }
    .btn-group { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
    .btn { display: inline-block; background: #E3C57F; color: #000; text-decoration: none; font-weight: 800; padding: 12px 20px; border-radius: 12px; text-transform: uppercase; font-size: 13px; transition: all 0.2s ease; }
    .btn:hover { background: #cda434; transform: translateY(-2px); }
    .btn-secondary { background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
    .btn-secondary:hover { background: rgba(255,255,255,0.25); }
  </style>
</head>
<body>
  <div class="header">
    <h1>Sanskrutik Guest Passes</h1>
    <p class="subtitle">Generated 6 Passes for <strong>Sanskrutik Guest</strong> &bull; Total Admit Capacity: <strong>160 Persons</strong></p>
  </div>

  <div class="grid">
    ${generatedPasses.map(p => `
      <div class="card">
        <h2>Pass #${p.index}</h2>
        <div class="holder">${p.name}</div>
        <div class="badge">Admit: ${p.passes} Persons</div>
        <div class="qr-box">
          <img src="${p.qrRelativeUrl}" alt="QR Code Pass #${p.index}">
        </div>
        <div class="details">
          <div><strong>Ticket ID:</strong> ${p.ticketId.substring(0, 8).toUpperCase()}</div>
        </div>
        <div class="btn-group">
          <a href="${p.passUrl}" target="_blank" class="btn">Digital Pass Page</a>
          <a href="${p.qrRelativeUrl}" download="${p.qrFilename}" class="btn btn-secondary">Download QR</a>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, "index.html"), htmlContent);

  console.log("\n========================================================");
  console.log("    SUCCESS: 6 SANSKRUTIK GUEST PASSES GENERATED        ");
  console.log("========================================================\n");
  
  generatedPasses.forEach(p => {
    console.log(`Pass #${p.index} | Admit: ${p.passes} Persons | Holder: ${p.name}`);
    console.log(`Ticket ID: ${p.ticketId}`);
    console.log(`Live Pass URL:  ${p.passUrl}`);
    console.log(`QR Code File:   public${p.qrRelativeUrl}`);
    console.log("--------------------------------------------------------");
  });

  fs.writeFileSync(path.join(outputDir, "passes.json"), JSON.stringify(generatedPasses, null, 2));
}

main().catch(err => {
  console.error("Error generating passes:", err);
});
