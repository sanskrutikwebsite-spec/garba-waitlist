import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const passes = formData.get("passes") as string;
    const screenshot = formData.get("screenshot") as File;

    if (!name || !email || !phone || !passes || !screenshot) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // --- CLOUDINARY FILE UPLOAD ---
    const { v2: cloudinary } = await import('cloudinary');
    
    cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    const buffer = Buffer.from(await screenshot.arrayBuffer());
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${screenshot.type};base64,${base64Data}`;

    let screenshotUrl = "";
    try {
      const uploadResponse = await cloudinary.uploader.upload(fileUri, {
        folder: 'garba_receipts',
      });
      screenshotUrl = uploadResponse.secure_url;
    } catch (e: any) {
      console.error("Cloudinary upload failed, falling back to local storage. Error:", e.message || e);
      // Fallback to local storage in public/uploads
      const fs = await import('fs');
      const path = await import('path');
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `fallback_${Date.now()}_${screenshot.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      const origin = request.headers.get("origin") || new URL(request.url).origin;
      screenshotUrl = `${origin}/uploads/${fileName}`;
    }

    // --- GOOGLE SHEETS LOGIC ---
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
    
    await sheet.addRow({
      'NAME': name,
      'EMAIL': email,
      'PHONE': phone,
      'PASSES': passes,
      'SCREENTSHOT': screenshotUrl,
      'STATUS': 'Pending',
      'DATE': new Date().toISOString(),
      'TICKET ID': 'TBD'
    });

    console.log("New Registration saved to Google Sheets:", { name, email, phone, passes });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
