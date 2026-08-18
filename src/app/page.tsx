"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

// Reusable animation variants
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

export default function Home() {
  const [isEarlyBird, setIsEarlyBird] = useState(true);

  useEffect(() => {
    // Cutoff: 72 hrs from tomorrow (assuming tomorrow is Aug 19 -> Aug 22 00:00)
    const cutoff = new Date("2026-08-22T00:00:00+05:30");
    if (new Date() >= cutoff) {
      setIsEarlyBird(false);
    }
  }, []);

  return (
    <main className="flex flex-col bg-[#fcfaf5] selection:bg-brand-primary selection:text-white font-sans text-foreground relative">

      {/* --- GLOBAL FIXED BACKGROUND --- */}
      <div className="absolute inset-0 z-0 fixed pointer-events-none bg-[#EAD7B7]">
        {/* Mobile Background (Vertical) */}
        <div className="block md:hidden absolute inset-0">
          <Image
            src="/bg-vertical.jpg"
            alt="Traditional Pattern Background"
            fill
            sizes="100vw"
            className="object-cover opacity-100"
            priority
          />
        </div>
        {/* Desktop Background (Horizontal) */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src="/bg-horizontal.jpg"
            alt="Traditional Pattern Background"
            fill
            sizes="100vw"
            className="object-cover opacity-100"
            priority
          />
        </div>
      </div>

      {/* --- 1. ULTRA MINIMAL HERO SECTION --- */}
      <section className="relative w-full min-h-[95vh] flex flex-col justify-center items-center pt-8 pb-16 overflow-hidden">

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center mt-12 md:mt-0">

          {/* Centered Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[650px] lg:h-[650px] mx-auto flex justify-center items-center mix-blend-multiply drop-shadow-sm"
          >
            <Image
              src="/logo-sg.png"
              alt="Sanskrutik Sheri Garba Logo"
              fill
              priority
              className="object-contain object-center"
            />
          </motion.div>

        </div>

      </section>

      {/* --- 2. TEXT SPREAD --- */}
      <section className="relative z-10 w-full py-16 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative">
          <motion.div
            className="w-full flex flex-col items-center justify-center z-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px" }}
          >
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight drop-shadow-sm">
              Where <span className="text-brand-primary">every beat</span> <br className="hidden sm:block" />
              tells a <span className="text-brand-primary">story.</span>
            </motion.h2>
          </motion.div>
        </div>
      </section>

      {/* --- 3. EVENT GALLERY MARQUEE --- */}
      <section className="relative z-10 w-full overflow-hidden py-12 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
          className="relative flex w-full max-w-[100vw] overflow-hidden"
        >
          <div className="flex w-max animate-[marquee_120s_linear_infinite] gap-4 sm:gap-6 px-2 sm:px-3">
            {[
              "1090 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0120 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0712 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1662 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0092 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0985 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1095 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0493 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1600 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0730 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0604 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1119 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0113 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0939 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1595 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1216 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0709 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0455 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1133 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1217 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0710 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1090 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0120 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0712 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1662 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0092 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0985 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1095 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0493 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1600 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0730 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0604 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1119 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0113 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0939 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1595 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1216 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0709 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0455 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1133 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "1217 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg",
              "0710 DS Sanskrutik Sheri Garba 4 0 on 22-09-2025.jpg"
            ].map((filename, i) => (
              <div key={i} className="relative w-[280px] h-[180px] sm:w-[400px] sm:h-[260px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/30 shrink-0">
                <Image
                  src={`/${filename}`}
                  alt={`Event Highlight ${i}`}
                  fill
                  sizes="(max-width: 640px) 280px, 400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply"></div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* --- 4. SLEEK CALL TO ACTION --- */}
      <section className="relative z-10 w-full py-32 px-6 lg:px-24 border-t border-foreground/10 overflow-hidden bg-white/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6 items-center"
          >
            <h2 className="text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-tight">
              Ready to <br />
              <span className="text-brand-primary italic">Join Us?</span>
            </h2>
            <p className="text-xl lg:text-2xl text-foreground/80 font-medium max-w-2xl">
              Secure your passes now. Experience the rhythm, the colors, and the unmatched energy of Sanskrutik Sheri Garba. <br />
              <span className="text-brand-primary font-bold">
                {isEarlyBird ? "Early Bird Price: ₹2700 per pass" : "Price: ₹3000 per pass"}
              </span>
            </p>
            <Link 
              href="/checkout"
              className="mt-8 flex items-center justify-center gap-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xl py-6 px-12 rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(227,197,127,0.4)] hover:shadow-[0_0_60px_rgba(227,197,127,0.6)] hover:-translate-y-1 group"
            >
              <span className="tracking-[0.1em] uppercase">Buy Passes Now</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
