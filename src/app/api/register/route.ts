import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST() {
  return NextResponse.json(
    { error: "All passes are sold out. Registration is closed." },
    { status: 400 }
  );
}
