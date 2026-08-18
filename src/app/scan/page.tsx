"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";

type ScanResult = {
  valid: boolean;
  message: string;
  name?: string;
  passes?: string;
  errorType?: "INVALID" | "USED" | "PENDING";
};

export default function Scanner() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<(ScanResult & { time: Date })[]>([]);
  const [isScanning, setIsScanning] = useState(false);
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
      setHistory(prev => [{ ...data, time: new Date() }, ...prev].slice(0, 50));

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
          passes: payload.passes as string,
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
    if (scannerRef.current) {
      scannerRef.current.resume();
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
          <div className="p-4 text-center text-sm text-zinc-400">
            Point camera at the attendee's QR Code
          </div>
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
            
            {scanResult.valid ? (
              <div className="w-full bg-green-500/20 border-2 border-green-500 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                <CheckCircle2 className="w-24 h-24 text-green-500" />
                <h2 className="text-4xl font-black text-green-500">VALID PASS</h2>
                <div className="w-full h-px bg-green-500/30 my-2"></div>
                <p className="text-2xl font-bold">{scanResult.name}</p>
                <p className="text-xl">Admit: <span className="font-black text-3xl">{scanResult.passes}</span></p>
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
              </div>
            )}

            <button 
              onClick={resetScan}
              className="w-full py-5 bg-white text-black font-black text-xl rounded-xl hover:bg-gray-200 transition-colors shadow-xl"
            >
              SCAN NEXT PASS
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
