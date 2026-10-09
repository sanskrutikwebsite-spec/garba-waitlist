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
        </div>

        <motion.div
          className="w-full bg-white p-8 md:p-12 shadow-xl border border-red-300 rounded-2xl text-center flex flex-col items-center gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="w-20 h-20 rounded-full bg-red-100 border border-red-300 flex items-center justify-center text-red-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-600 uppercase tracking-widest">
            All Passes Sold Out
          </h2>
          <p className="text-lg text-foreground/80 font-medium max-w-xl leading-relaxed">
            Thank you for your overwhelming love and support! Partner passes via {partner.name} are now officially sold out and registration is closed.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center justify-center gap-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-base py-4 px-8 rounded-full transition-all duration-300 uppercase tracking-wider shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
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
