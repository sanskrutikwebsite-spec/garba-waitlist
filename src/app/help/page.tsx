"use client";

import { motion } from "framer-motion";
import { MessageCircle, CreditCard, Ticket, AlertCircle } from "lucide-react";

export default function HelpCenter() {
  const whatsappNumber = "917600044100"; // Replaced with real number
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%2C%20I%20need%20help%20with%20my%20Garba%20passes.`;

  return (
    <main className="flex flex-col min-h-screen bg-[#fcfaf5] text-foreground font-sans">
      
      {/* Header */}
      <section className="relative w-full py-24 px-6 flex flex-col items-center justify-center text-center bg-[#EAD7B7] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/bg-horizontal.jpg')] bg-cover bg-center mix-blend-multiply"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Help <span className="text-brand-primary italic">& Support</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-foreground/80">
            Having trouble with your passes? We're here to help you get ready for the Garba.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="w-full max-w-5xl mx-auto py-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Left Column: Contact Methods */}
        <div className="md:col-span-1 flex flex-col gap-8">
          <div className="bg-white border border-[#E3C57F] p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <MessageCircle className="text-brand-primary" /> Urgent Help
            </h3>
            <p className="text-foreground/80 mb-6">
              For immediate assistance with payment failures or missing QR codes, message our dedicated support team on WhatsApp.
            </p>
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#1DA851] transition-colors"
            >
              <MessageCircle size={20} />
              WhatsApp Us
            </a>
          </div>
          
          <div className="bg-white border border-foreground/10 p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-2">Support Hours</h3>
            <p className="text-foreground/70">Monday - Sunday</p>
            <p className="text-foreground/70 font-bold">10:00 AM - 8:00 PM</p>
          </div>
        </div>

        {/* Right Column: FAQs */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          
          <div className="flex flex-col gap-6">
            
            <div className="bg-white p-6 border border-foreground/10 flex gap-4">
              <CreditCard className="text-brand-primary shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold mb-2">My payment failed, but money was deducted. What do I do?</h4>
                <p className="text-foreground/80">
                  Don't panic! UPI transactions usually refund automatically within 24-48 hours if they fail. If the money was successfully credited to our account, please send a screenshot of the transaction ID to our WhatsApp support, and we will manually generate your passes.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 border border-foreground/10 flex gap-4">
              <Ticket className="text-brand-primary shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold mb-2">I bought 5 passes. Will I get 5 QR codes?</h4>
                <p className="text-foreground/80">
                  No, you will receive **one single Group Ticket QR code** that admits 5 people. You and your friends must arrive at the entry gate together. The volunteer will scan your code once and allow all 5 of you to enter. You cannot share the code for separate entry.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 border border-foreground/10 flex gap-4">
              <AlertCircle className="text-brand-primary shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold mb-2">I didn't receive my QR code after submitting the form.</h4>
                <p className="text-foreground/80">
                  Our admin team manually verifies every payment screenshot. This process can take anywhere from 1 to 4 hours. Once verified, you will receive your official Ticket ID and QR code via Email and WhatsApp. If it has been more than 12 hours, please contact our support.
                </p>
              </div>
            </div>

          </div>
        </div>

      </section>

    </main>
  );
}
