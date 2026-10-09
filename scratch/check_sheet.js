import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkAllRows() {
  const auth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  console.log(`Total Rows in Sheet: ${rows.length}`);
  rows.forEach((r, idx) => {
    console.log(`Row #${idx + 1} | Name: ${r.get('NAME')} | Passes: ${r.get('PASSES')} | Status: ${r.get('STATUS')} | ID: ${r.get('TICKET ID')}`);
  });
}

checkAllRows().catch(console.error);
