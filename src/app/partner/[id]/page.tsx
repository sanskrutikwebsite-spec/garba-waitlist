"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const PARTNERS: Record<string, { name: string; code: string }> = {
  "roastery-culture": { name: "Roastery Culture", code: "RC2026" },
  "monsoon": { name: "Monsoon", code: "MONSOON2026" },
  "tea-tappri": { name: "Tea Tappri", code: "TeaTappri26" }
};

export default function PartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [phase, setPhase] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const partnerId = resolvedParams.id.toLowerCase();
  const partner = PARTNERS[partnerId];

  useEffect(() => {
    const now = new Date();
    const earlyBirdEnd = new Date("2026-08-22T00:00:00+05:30");
    const phase2Start = new Date("2026-09-19T00:00:00+05:30");
    const phase3Start = new Date("2026-10-05T00:00:00+05:30");

    if (now >= phase3Start) {
      setPhase(3);
    } else if (now >= phase2Start) {
      setPhase(2);
    } else if (now >= earlyBirdEnd) {
      setPhase(1);
    } else {
      setPhase(0);
    }
  }, []);

  if (!partner) {
    return (
      <main className="min-h-screen bg-[#fcfaf5] text-foreground font-sans py-24 px-6 md:px-12 flex justify-center items-center">
        <h1 className="text-3xl font-bold">Partner not found.</h1>
      </main>
    );
  }

  const getBasePrice = () => {
    if (phase === 3) return 3500;
    if (phase === 2) return 3500;
    if (phase === 1) return 3000;
    return 2700;
  };

  const basePrice = getBasePrice();
  // Mathematical 10% discount
  const currentPrice = Math.round(basePrice * 0.9);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    const formData = new FormData(e.currentTarget);
    formData.append("paymentMethod", paymentMethod);
    formData.append("referralCode", partner.code); // inject code automatically
    
    if (paymentMethod === "cash") {
      const name = formData.get("name") as string;
      const passes = formData.get("passes") as string;
      const total = parseInt(passes) * currentPrice;
      const message = `Hello, I am booking Garba passes via ${partner.name}.\n\nName: ${name}\nPasses: ${passes}\nPromo Code: ${partner.code}\nPayment Method: Cash\nTotal Amount: ₹${total}\n\nPlease confirm my booking.`;
      
      window.location.href = `https://wa.me/917600044100?text=${encodeURIComponent(message)}`;
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfaf5] text-foreground font-sans py-24 px-6 md:px-12 flex justify-center items-center">
      <div className="max-w-4xl w-full">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold tracking-[0.2em] uppercase text-brand-primary mb-4">
            Special Partner Offer
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Welcome, <span className="text-brand-primary italic">{partner.name}</span> Customers!
          </h1>
          <p className="text-foreground/80 mt-6 text-lg">
            Secure your spot by filling out the details below. Your special 10% discount is already applied!
            <br />
            <span className="font-bold text-brand-primary inline-block mt-2">
              Discounted Price: ₹{currentPrice} per pass <span className="line-through text-foreground/40 text-sm ml-2">₹{basePrice}</span>
            </span>
          </p>
        </div>

        <motion.div
          className="w-full bg-white p-8 md:p-12 shadow-xl border border-[#E3C57F]"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
              <h3 className="text-xl font-bold text-brand-primary uppercase">Thank you for the incredible love and interest</h3>
              <h3 className="text-3xl font-bold text-brand-primary uppercase mt-2">Registration Successful!</h3>
              <p className="text-lg font-medium text-foreground/80 mt-4 uppercase">
                We will let you know the approval in 24 - 48 hrs through email or WhatsApp.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-8 py-4 bg-brand-primary text-white font-bold text-lg hover:bg-brand-primary/90 transition-colors uppercase tracking-widest text-sm"
              >
                Register another person
              </button>
              <Script id="fb-pixel-partner" strategy="afterInteractive">
                {`
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '1563231012272827');
                  fbq('track', 'PageView');
                `}
              </Script>
              <noscript>
                <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=1563231012272827&ev=PageView&noscript=1" alt="" />
              </noscript>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <motion.div variants={fadeUp} className="relative group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="peer w-full bg-transparent border-b border-foreground/30 py-4 text-foreground text-lg focus:outline-none focus:border-[#E3C57F] transition-colors placeholder-transparent"
                    placeholder="Full Name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 top-0 text-foreground/90 text-xs font-bold uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary"
                  >
                    Full Name
                  </label>
                </motion.div>

                <motion.div variants={fadeUp} className="relative group">
                  <input
                    type="number"
                    id="passes"
                    name="passes"
                    min="1"
                    max="10"
                    required
                    className="peer w-full bg-transparent border-b border-foreground/30 py-4 text-foreground text-lg focus:outline-none focus:border-[#E3C57F] transition-colors placeholder-transparent"
                    placeholder="Number of Passes"
                  />
                  <label
                    htmlFor="passes"
                    className="absolute left-0 top-0 text-foreground/90 text-xs font-bold uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary"
                  >
                    Number of Passes
                  </label>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <motion.div variants={fadeUp} className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="peer w-full bg-transparent border-b border-foreground/30 py-4 text-foreground text-lg focus:outline-none focus:border-[#E3C57F] transition-colors placeholder-transparent"
                    placeholder="Email Address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 top-0 text-foreground/90 text-xs font-bold uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary"
                  >
                    Email Address
                  </label>
                </motion.div>

                <motion.div variants={fadeUp} className="relative group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="peer w-full bg-transparent border-b border-foreground/30 py-4 text-foreground text-lg focus:outline-none focus:border-[#E3C57F] transition-colors placeholder-transparent"
                    placeholder="Phone Number"
                  />
                  <label
                    htmlFor="phone"
                    className="absolute left-0 top-0 text-foreground/90 text-xs font-bold uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary"
                  >
                    WhatsApp Phone Number
                  </label>
                </motion.div>
              </div>

              <div className="w-full">
                <motion.div variants={fadeUp} className="relative group p-4 border border-brand-primary/30 bg-brand-primary/5 rounded-md flex items-center justify-between">
                   <div>
                     <p className="text-xs font-bold uppercase tracking-widest text-foreground/60">Promo Code Applied</p>
                     <p className="text-xl font-extrabold text-brand-primary tracking-widest uppercase mt-1">{partner.code}</p>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   </div>
                </motion.div>
              </div>

              {/* Payment Section */}
              <motion.div variants={fadeUp} className="bg-zinc-50 border border-zinc-200 p-8 mt-6">
                <h3 className="text-xl font-bold text-brand-primary mb-4">Payment Information</h3>
                
                <div className="flex gap-6 mb-8 border-b border-foreground/10 pb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="paymentMethodSelect" 
                      value="upi" 
                      checked={paymentMethod === "upi"} 
                      onChange={() => setPaymentMethod("upi")} 
                      className="w-4 h-4 text-brand-primary focus:ring-brand-primary" 
                    />
                    <span className="font-bold tracking-wider uppercase text-sm text-foreground/90">Pay via UPI</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="paymentMethodSelect" 
                      value="cash" 
                      checked={paymentMethod === "cash"} 
                      onChange={() => setPaymentMethod("cash")} 
                      className="w-4 h-4 text-brand-primary focus:ring-brand-primary" 
                    />
                    <span className="font-bold tracking-wider uppercase text-sm text-foreground/90">Pay via Cash</span>
                  </label>
                </div>

                {paymentMethod === "upi" ? (
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-1/2 flex flex-col items-center text-center gap-4 border border-foreground/10 p-6 bg-white shadow-sm">
                      <p className="text-sm font-semibold text-foreground/80">Scan this QR Code to Pay</p>
                      <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                        <Image src="/upi-qr.jpeg" alt="UPI QR Code" fill sizes="192px" className="object-contain" />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="relative w-8 h-8">
                          <Image src="/dalisay events.jpeg" alt="Dalisay Events" fill sizes="32px" className="object-contain rounded" />
                        </div>
                        <p className="text-xs font-bold tracking-widest uppercase text-brand-primary">DALISAY EVENTS LLP</p>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 flex flex-col gap-6">
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        Please make the payment for your passes using the QR code (<span className="font-bold text-brand-primary">₹{currentPrice} per pass</span>). After successful payment, upload the screenshot here.
                      </p>
                      <div className="relative group mt-4">
                        <input
                          type="file"
                          id="screenshot"
                          name="screenshot"
                          accept="image/*"
                          required={paymentMethod === "upi"}
                          className="w-full text-sm text-foreground/80 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/90 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 p-6 border border-foreground/10 bg-white shadow-sm">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      You have selected to pay via <span className="font-bold">Cash</span>.
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      The total price per pass is <span className="font-bold text-brand-primary">₹{currentPrice}</span>.
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed mt-2 p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-md">
                      Please submit this registration and you can pay the cash amount directly to us to confirm your passes. We will contact you with further details.
                    </p>
                  </div>
                )}
              </motion.div>

              <motion.button
                variants={fadeUp}
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex items-center justify-center gap-4 bg-foreground hover:bg-foreground/80 text-white font-semibold py-5 px-10 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto md:self-start"
              >
                <span className="text-sm tracking-[0.2em] uppercase">{isSubmitting ? "Submitting..." : "Submit Registration"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </motion.button>
              {error && <p className="text-red-500 text-sm font-bold mt-2">Something went wrong. Please try again.</p>}
            </form>
          )}
        </motion.div>
        <div className="mt-8 text-center">
          <p className="text-sm font-bold text-foreground/60">
            Having trouble? <Link href="/help" className="text-brand-primary hover:underline">Visit our Help Center</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
