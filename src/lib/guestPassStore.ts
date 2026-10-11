import fs from "fs";
import path from "path";

const GUEST_SCANS_FILE = path.join(process.cwd(), "src", "data", "guest_scans.json");

export interface GuestScanRecord {
  scannedCount: number;
  totalPasses: number;
  name: string;
  lastScanned?: string;
}

export function getGuestScans(): Record<string, GuestScanRecord> {
  try {
    if (fs.existsSync(GUEST_SCANS_FILE)) {
      const data = fs.readFileSync(GUEST_SCANS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading guest scans file:", e);
  }
  return {};
}

export function saveGuestScan(ticketId: string, record: GuestScanRecord) {
  try {
    const dir = path.dirname(GUEST_SCANS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const scans = getGuestScans();
    scans[ticketId] = record;
    fs.writeFileSync(GUEST_SCANS_FILE, JSON.stringify(scans, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving guest scan:", e);
  }
}
