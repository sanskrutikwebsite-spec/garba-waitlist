"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";
import { useRef } from "react";
import * as htmlToImage from "html-to-image";

type PassClientProps = {
  ticketId: string;
  name: string;
  passes: string;
  qrData: string;
};

export default function PassClient({ ticketId, name, passes, qrData }: PassClientProps) {
  const passRef = useRef<HTMLDivElement>(null);

  const downloadPass = async () => {
    if (!passRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(passRef.current, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Garba_Pass_${name.replace(/\\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download pass", err);
      alert("Failed to download pass. Please screenshot instead.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* The Pass Card */}
      <div 
        ref={passRef}
        className="relative bg-gradient-to-b from-[#5c0e18] to-[#3a060d] border border-[#E3C57F]/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center p-8 text-center text-white"
        style={{
          boxShadow: '0 25px 50px -12px rgba(227, 197, 127, 0.15)'
        }}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#cda434] via-[#f9e596] to-[#cda434]"></div>
        
        <h1 className="text-3xl font-black text-[#E3C57F] tracking-tight uppercase mb-1">Sanskrutik Garba</h1>
        <p className="text-sm tracking-[0.3em] text-white/70 font-bold uppercase mb-8">Official Entry Pass</p>

        <div className="bg-white p-4 rounded-2xl mb-8 shadow-inner shadow-black/20">
          <QRCodeCanvas
            value={qrData}
            size={200}
            level="H"
            includeMargin={false}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-white/50 font-bold">Pass Holder</span>
            <span className="text-xl font-bold uppercase">{name}</span>
          </div>

          <div className="flex justify-between w-full border-t border-white/10 pt-4 mt-2">
            <div className="flex flex-col text-left">
              <span className="text-xs uppercase tracking-widest text-white/50 font-bold">Admit</span>
              <span className="text-2xl font-black text-[#E3C57F]">{passes} <span className="text-sm font-bold text-white/80">Person(s)</span></span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs uppercase tracking-widest text-white/50 font-bold">Ticket ID</span>
              <span className="text-lg font-mono tracking-wider">{ticketId.substring(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button (Not part of the screenshot) */}
      <button 
        onClick={downloadPass}
        className="w-full bg-[#E3C57F] text-black font-bold uppercase tracking-widest py-4 rounded-2xl hover:bg-[#cda434] transition-colors flex justify-center items-center gap-2 shadow-lg"
      >
        <Download size={20} />
        Save Pass as Image
      </button>
    </div>
  );
}
