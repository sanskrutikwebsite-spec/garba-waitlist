import fs from 'fs';
import path from 'path';

async function runTest() {
  console.log("=== STARTING E2E TEST ===");
  
  // 1. Simulate Registration (Group Ticket of 8)
  console.log("1. Simulating Registration (8 passes)...");
  
  const formData = new FormData();
  formData.append("name", "Test Group User");
  formData.append("email", "testgroup@example.com");
  formData.append("phone", "9999999999");
  formData.append("passes", "8");
  
  // Create a dummy file for the screenshot
  const blob = new Blob(["dummy content"], { type: "text/plain" });
  formData.append("screenshot", blob, "dummy_screenshot.txt");

  const registerRes = await fetch("http://localhost:3000/api/register", {
    method: "POST",
    body: formData
  });
  
  const registerData = await registerRes.json();
  console.log("Registration Response:", registerData);

  if (!registerData.success) {
    console.error("Failed to register. Exiting test.");
    return;
  }

  // 2. Fetch Admin Data to get the row ID
  console.log("\n2. Fetching Admin Data...");
  const adminRes = await fetch("http://localhost:3000/api/admin");
  const adminData = await adminRes.json();
  console.log("Registrations count:", adminData.registrations.length);
  console.log("First registration:", adminData.registrations[0]);
  
  const myRow = adminData.registrations.find((r) => r.email === "testgroup@example.com");
  
  if (!myRow) {
    console.error("Could not find the newly inserted row in Google Sheets!");
    return;
  }
  
  console.log("Found Pending Row:", myRow.id);

  // 3. Approve the Row
  console.log("\n3. Approving Row (Generating Ticket ID)...");
  const approveRes = await fetch("http://localhost:3000/api/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rowId: myRow.id })
  });
  
  const approveData = await approveRes.json();
  console.log("Approve Response:", approveData);

  if (!approveData.success || !approveData.ticketId) {
    console.error("Failed to approve!");
    return;
  }

  const generatedTicketId = approveData.ticketId;

  // 4. Scan the Ticket
  console.log(`\n4. Scanning Ticket (ID: ${generatedTicketId})...`);
  const scanRes1 = await fetch("http://localhost:3000/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticketId: generatedTicketId })
  });
  
  const scanData1 = await scanRes1.json();
  console.log("First Scan Response:", scanData1);

  // 5. Scan it again (should fail)
  console.log("\n5. Scanning same ticket again (Should Fail)...");
  const scanRes2 = await fetch("http://localhost:3000/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticketId: generatedTicketId })
  });
  
  const scanData2 = await scanRes2.json();
  console.log("Second Scan Response:", scanData2);

  console.log("\n=== TEST COMPLETE ===");
}

runTest().catch(console.error);
