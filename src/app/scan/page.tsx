"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";

type ScanResult = {
  valid: boolean;
  message: string;
  name?: string;
  passes?: number;
  scannedCount?: number;
  remaining?: number;
  ticketId?: string;
  errorType?: "INVALID" | "USED" | "PENDING";
  multiple?: boolean;
  tickets?: {
    ticketId: string;
    name: string;
    totalPasses: number;
    remaining: number;
    status: string;
  }[];
};

export default function Scanner() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<(ScanResult & { time: Date })[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [enteringCount, setEnteringCount] = useState<number>(1);
  const [isConfirming, setIsConfirming] = useState(false);
  const [manualTicketId, setManualTicketId] = useState("");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Quick password protection for the demo
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated && !scannerRef.current) {
      // Initialize scanner
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          rememberLastUsedCamera: true
        },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isAuthenticated]);

  const onScanSuccess = async (decodedText: string) => {
    if (isScanning) return; // Prevent multiple rapid fires
    
    setIsScanning(true);
    // Pause the scanner visually if possible, or just ignore inputs
    if (scannerRef.current) {
      scannerRef.current.pause(true);
    }

    try {
      let ticketId = decodedText;
      if (decodedText.includes('http')) {
        const url = new URL(decodedText);
        ticketId = url.searchParams.get('id') || decodedText;
      }

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId })
      });

      if (!res.ok && res.status >= 500) {
        throw new Error("Server Error - Treating as Offline");
      }

      const data = await res.json();
      setScanResult(data);
      if (data.remaining) {
        setEnteringCount(data.remaining); // Default to all remaining passes
      }
      
      if (!data.valid) {
        // If invalid, add to history immediately
        setHistory(prev => [{ ...data, time: new Date() }, ...prev].slice(0, 50));
      }

    } catch (err) {
      console.log("Network error or server down, attempting offline verification...");
      try {
        const { jwtVerify } = await import("jose");
        const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret-for-demo-only');
        const { payload } = await jwtVerify(decodedText, secret);
        
        const offlineResult: ScanResult = {
          valid: true,
          message: "⚠️ OFFLINE MODE: Valid Signature, but CANNOT check for duplicates.",
          name: payload.name as string,
          passes: parseInt(payload.passes as string) || 1,
          remaining: parseInt(payload.passes as string) || 1,
          scannedCount: 0,
        };
        setScanResult(offlineResult);
        setHistory(prev => [{ ...offlineResult, time: new Date() }, ...prev].slice(0, 50));
      } catch (verifyErr) {
        console.error(verifyErr);
        const errorResult: ScanResult = { valid: false, message: "OFFLINE MODE: INVALID TICKET SIGNATURE." };
        setScanResult(errorResult);
        setHistory(prev => [{ ...errorResult, time: new Date() }, ...prev].slice(0, 50));
      }
    } finally {
      setIsScanning(false);
    }
  };

  const onScanFailure = (error: any) => {
    // Ignore routine scan failures (when no QR code is in view)
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "volunteer", password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        alert("Incorrect Password");
      }
    } catch (error) {
      alert("Error logging in");
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setEnteringCount(1);
    setIsConfirming(false);
    setManualTicketId("");
    if (scannerRef.current) {
      scannerRef.current.resume();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTicketId.trim()) return;
    onScanSuccess(manualTicketId.trim());
  };

  const confirmEntry = async () => {
    if (!scanResult || !scanResult.ticketId) return;
    setIsConfirming(true);
    
    try {
      const res = await fetch("/api/confirm-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: scanResult.ticketId, enteringCount })
      });
      
      if (res.ok) {
        const data = await res.json();
        // Overwrite scan result with success screen state
        const confirmedResult: ScanResult = {
          valid: true,
          message: "ENTRY CONFIRMED",
          name: data.name,
          passes: data.passes,
          scannedCount: data.scannedCount,
        };
        setScanResult(confirmedResult);
        setHistory(prev => [{ ...confirmedResult, message: `Admitted ${enteringCount}`, time: new Date() }, ...prev].slice(0, 50));
      } else {
        alert("Failed to confirm entry!");
      }
    } catch (e) {
      alert("Network error confirming entry");
    } finally {
      setIsConfirming(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
        <form onSubmit={handleLogin} className="bg-zinc-800 p-8 flex flex-col gap-6 shadow-2xl w-full max-w-sm rounded-2xl">
          <h2 className="text-2xl font-bold text-white text-center">Volunteer Portal</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Scanner Password"
            className="w-full bg-zinc-700 text-white p-4 rounded focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <button type="submit" className="bg-brand-primary text-white py-4 font-bold rounded hover:bg-brand-primary/90">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white font-sans flex flex-col">
      <header className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
        <h1 className="font-bold tracking-widest text-brand-primary uppercase text-sm">Garba Gate Scanner</h1>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          LIVE
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center p-4">
        
        {/* Scanner Window */}
        <div className={`w-full max-w-md bg-zinc-800 rounded-xl overflow-hidden shadow-2xl ${scanResult ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <div id="qr-reader" className="w-full"></div>
          <div className="p-4 text-center text-sm text-zinc-400 border-b border-zinc-700">
            Point camera at the attendee's QR Code
          </div>
          <form onSubmit={handleManualSubmit} className="p-4 flex gap-2">
            <input 
              type="text" 
              placeholder="Enter Phone # or short Ticket ID" 
              value={manualTicketId}
              onChange={(e) => setManualTicketId(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-500 text-white font-bold px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors">
              Submit
            </button>
          </form>
        </div>

        {/* Processing State */}
        {isScanning && !scanResult && (
          <div className="flex flex-col items-center gap-4 mt-20">
            <Loader2 className="w-16 h-16 animate-spin text-brand-primary" />
            <h2 className="text-xl font-bold animate-pulse">Verifying Pass...</h2>
          </div>
        )}

        {/* History List */}
        {!scanResult && history.length > 0 && (
          <div className="w-full max-w-md mt-8 flex flex-col gap-3">
            <h3 className="text-zinc-500 text-sm font-bold tracking-widest uppercase mb-2">Recent Scans</h3>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {history.map((item, idx) => (
                <div key={idx} className={`p-3 rounded-lg border-l-4 flex justify-between items-center bg-zinc-800 ${item.valid ? 'border-green-500' : 'border-red-500'}`}>
                  <div className="flex flex-col">
                    <span className={`font-bold ${item.valid ? 'text-green-400' : 'text-red-400'}`}>
                      {item.name || 'Unknown'}
                    </span>
                    <span className="text-xs text-zinc-400 truncate max-w-[200px]">
                      {item.message}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    {item.valid && <span className="text-sm font-black bg-zinc-700 px-2 py-0.5 rounded text-white">{item.passes} Pass</span>}
                    <span className="text-[10px] text-zinc-500 mt-1">
                      {item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result Overlay */}
        {scanResult && (
          <div className="w-full max-w-md mt-8 flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in duration-300">
            
            {scanResult.multiple ? (
              <div className="w-full bg-zinc-800 border-2 border-zinc-600 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
                <h2 className="text-xl font-black text-white uppercase text-center border-b border-zinc-700 pb-4">Multiple Passes Found</h2>
                <p className="text-sm text-zinc-400 text-center mb-2">This phone number is linked to {scanResult.tickets?.length} purchases. Select which pass to scan:</p>
                <div className="flex flex-col gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                  {scanResult.tickets?.map((t, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        resetScan();
                        onScanSuccess(t.ticketId);
                      }}
                      className={`p-4 rounded-xl text-left transition-colors border ${t.remaining > 0 ? 'bg-zinc-700 hover:bg-zinc-600 border-zinc-500' : 'bg-red-900/20 border-red-900/50 opacity-50 cursor-not-allowed'}`}
                      disabled={t.remaining <= 0}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">{t.name}</span>
                        <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-zinc-300">{t.ticketId.substring(0,8)}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-xs text-zinc-400">Total: {t.totalPasses}</span>
                          <span className={`text-sm font-bold ${t.remaining > 0 ? 'text-green-400' : 'text-red-400'}`}>Remaining: {t.remaining}</span>
                        </div>
                        {t.remaining > 0 ? (
                          <div className="bg-blue-500 text-white text-[10px] tracking-wider font-black px-3 py-1.5 rounded uppercase">Select</div>
                        ) : (
                          <div className="bg-red-900 text-red-200 text-[10px] tracking-wider font-black px-3 py-1.5 rounded uppercase">Empty</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={resetScan} className="text-sm text-zinc-400 mt-2 hover:text-white">Cancel</button>
              </div>
            ) : scanResult.valid && scanResult.message === "TICKET VERIFIED" ? (
              <div className="w-full bg-blue-500/20 border-2 border-blue-500 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                <h2 className="text-3xl font-black text-blue-400 uppercase">Ticket Verified</h2>
                <p className="text-xl font-bold">{scanResult.name}</p>
                
                <div className="flex gap-4 w-full mt-2 bg-black/40 p-4 rounded-xl">
                  <div className="flex-1 flex flex-col">
                    <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Total</span>
                    <span className="text-2xl font-black text-white">{scanResult.passes}</span>
                  </div>
                  <div className="flex-1 flex flex-col border-l border-r border-zinc-700">
                    <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Entered</span>
                    <span className="text-2xl font-black text-yellow-500">{scanResult.scannedCount}</span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Remaining</span>
                    <span className="text-2xl font-black text-green-400">{scanResult.remaining}</span>
                  </div>
                </div>

                <div className="w-full mt-4 flex flex-col gap-2">
                  <label className="text-sm text-zinc-300 font-bold uppercase tracking-wider">How many entering now?</label>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <button 
                      onClick={() => setEnteringCount(Math.max(1, enteringCount - 1))}
                      className="w-12 h-12 rounded-full bg-zinc-700 font-black text-2xl hover:bg-zinc-600 transition-colors"
                    >-</button>
                    <span className="text-5xl font-black text-white w-20">{enteringCount}</span>
                    <button 
                      onClick={() => setEnteringCount(Math.min(scanResult.remaining || 1, enteringCount + 1))}
                      className="w-12 h-12 rounded-full bg-zinc-700 font-black text-2xl hover:bg-zinc-600 transition-colors"
                    >+</button>
                  </div>
                </div>

                <button 
                  onClick={confirmEntry}
                  disabled={isConfirming}
                  className="w-full mt-4 py-4 bg-blue-500 text-white font-black text-lg rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  {isConfirming ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                  CONFIRM ENTRY
                </button>
                <button onClick={resetScan} className="text-sm text-zinc-400 mt-2 hover:text-white">Cancel</button>
              </div>
            ) : scanResult.valid ? (
              <div className="w-full bg-green-500/20 border-2 border-green-500 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                <CheckCircle2 className="w-24 h-24 text-green-500" />
                <h2 className="text-4xl font-black text-green-500">ENTRY GRANTED</h2>
                <div className="w-full h-px bg-green-500/30 my-2"></div>
                <p className="text-2xl font-bold">{scanResult.name}</p>
                <p className="text-xl">Total Entered: <span className="font-black text-3xl">{scanResult.scannedCount}</span> / {scanResult.passes}</p>
                <button onClick={resetScan} className="w-full py-5 mt-4 bg-white text-black font-black text-xl rounded-xl hover:bg-gray-200 transition-colors shadow-xl">
                  SCAN NEXT PASS
                </button>
              </div>
            ) : (
              <div className="w-full bg-red-500/20 border-2 border-red-500 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                {scanResult.errorType === 'USED' ? (
                  <AlertTriangle className="w-24 h-24 text-red-500" />
                ) : (
                  <XCircle className="w-24 h-24 text-red-500" />
                )}
                
                <h2 className="text-3xl font-black text-red-500">STOP - REJECTED</h2>
                <p className="text-lg font-bold text-red-400">{scanResult.message}</p>
                
                {scanResult.name && (
                  <>
                    <div className="w-full h-px bg-red-500/30 my-2"></div>
                    <p className="text-xl font-medium">Registered to: {scanResult.name}</p>
                  </>
                )}
                <button onClick={resetScan} className="w-full py-5 mt-4 bg-white text-black font-black text-xl rounded-xl hover:bg-gray-200 transition-colors shadow-xl">
                  SCAN NEXT PASS
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
