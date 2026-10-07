import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";

async function generatePass() {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-demo-only');
  const ticketId = uuidv4();
  
  const jwt = await new SignJWT({ 
    id: ticketId, 
    name: "Sanskrutik Guest", 
    passes: "6" 
  })
  .setProtectedHeader({ alg: 'HS256' })
  .sign(secret);

  console.log("=== YOUR 6-PASS DIGITAL TICKET ===");
  console.log("Ticket ID:", ticketId);
  console.log("Pass URL: http://localhost:3000/pass/" + encodeURIComponent(jwt));
  console.log("QR Code Data Payload:\n" + jwt);
}

generatePass();
