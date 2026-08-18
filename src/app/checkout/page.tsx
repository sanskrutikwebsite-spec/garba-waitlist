"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [isEarlyBird, setIsEarlyBird] = useState(true);

  useEffect(() => {
    // Cutoff: 72 hrs from tomorrow (assuming tomorrow is Aug 19 -> Aug 22 00:00)
    const cutoff = new Date("2026-08-22T00:00:00+05:30");
    if (new Date() >= cutoff) {
      setIsEarlyBird(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    const formData = new FormData(e.currentTarget);
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
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Complete Your <span className="text-brand-primary italic">Purchase</span>
          </h1>
          <p className="text-foreground/80 mt-4 text-lg">
            Secure your spot by filling out the details below and uploading your payment screenshot.
            <br />
            <span className="font-bold text-brand-primary">
              {isEarlyBird ? "Early Bird Price: ₹2700 per pass" : "Price: ₹3000 per pass"}
            </span>
          </p>
          <p className="text-sm mt-4 font-bold text-foreground/60">
            Having trouble? <Link href="/help" className="text-brand-primary hover:underline">Visit our Help Center</Link>
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
              <h3 className="text-3xl font-bold text-brand-primary">Registration Pending!</h3>
              <p className="text-xl font-medium text-foreground/80">Thank you for submitting your payment. We will verify it and send your passes to your WhatsApp and Email soon.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-8 py-4 bg-brand-primary text-white font-bold text-lg hover:bg-brand-primary/90 transition-colors uppercase tracking-widest text-sm"
              >
                Register another person
              </button>
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

              {/* Payment Section */}
              <motion.div variants={fadeUp} className="bg-zinc-50 border border-zinc-200 p-8 mt-6">
                <h3 className="text-xl font-bold text-brand-primary mb-4">Payment Information</h3>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-1/2 flex flex-col items-center text-center gap-4 border border-foreground/10 p-6 bg-white shadow-sm">
                    <p className="text-sm font-semibold text-foreground/80">Scan this QR Code to Pay</p>
                    <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                      <Image src="/upi-qr.jpeg" alt="UPI QR Code" fill className="object-contain" />
                    </div>
                    <p className="text-xs font-bold tracking-widest uppercase text-brand-primary mt-2">DALISAY EVENTS LLP</p>
                  </div>
                  
                  <div className="w-full md:w-1/2 flex flex-col gap-6">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      Please make the payment for your passes using the QR code (<span className="font-bold text-brand-primary">{isEarlyBird ? "₹2700 per pass" : "₹3000 per pass"}</span>). After successful payment, upload the screenshot here.
                    </p>
                    <div className="relative group mt-4">
                      <input
                        type="file"
                        id="screenshot"
                        name="screenshot"
                        accept="image/*"
                        required
                        className="w-full text-sm text-foreground/80 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/90 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
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
      </div>
    </main>
  );
}
