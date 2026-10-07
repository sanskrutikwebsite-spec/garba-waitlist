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
  const [isArtistRevealed, setIsArtistRevealed] = useState(false);

  useEffect(() => {
    // Cutoff: 72 hrs from tomorrow (assuming tomorrow is Aug 19 -> Aug 22 00:00)
    const cutoff = new Date("2026-08-22T00:00:00+05:30");
    if (new Date() >= cutoff) {
      setIsEarlyBird(false);
    }

    const revealDate = new Date("2026-09-24T00:00:00+05:30");
    if (new Date() >= revealDate) {
      setIsArtistRevealed(true);
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

      {/* --- ARTIST REVEAL SECTION --- */}
      {isArtistRevealed && (
        <section className="relative z-10 w-full py-16 px-6 overflow-hidden bg-brand-primary/5">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <h3 className="text-3xl font-extrabold text-foreground uppercase tracking-widest border-b-2 border-brand-primary pb-2 mb-10">Featured Artist</h3>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-brand-primary/30">
                <Image src="/artist.JPG" alt="Mihir Jani" fill className="object-cover object-top" />
              </div>
              <div className="text-center">
                <h4 className="text-4xl md:text-5xl font-extrabold text-brand-primary tracking-tight">Mihir Jani</h4>
                <p className="text-xl text-foreground/80 font-bold tracking-widest uppercase mt-4">11th October</p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* --- 3. EVENT GALLERY MARQUEE --- */}
      <section className="relative z-10 w-full overflow-hidden py-12 pointer-events-none">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 600, ease: "linear" }}
          className="flex gap-6 w-max"
        >
          {[
            "image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg", "image6.jpg",
            "image7.jpg", "image8.jpg", "image9.jpg", "image10.jpg", "image11.jpg", "image12.jpg",
            "image13.jpg", "image14.jpg", "image15.jpg", "image16.jpg", "image17.jpg", "image18.jpg",
            "image19.jpg", "image20.jpg", "image21.jpg", "image22.jpg",
            "image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg", "image6.jpg",
            "image7.jpg", "image8.jpg", "image9.jpg", "image10.jpg", "image11.jpg", "image12.jpg",
            "image13.jpg", "image14.jpg", "image15.jpg", "image16.jpg", "image17.jpg", "image18.jpg",
            "image19.jpg", "image20.jpg", "image21.jpg", "image22.jpg"
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
              Secure your passes now. Experience the rhythm, the colors, and the unmatched energy of Sanskrutik Sheri Garba.
            </p>
            <Link
              href="/checkout"
              className="mt-8 flex items-center justify-center gap-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xl py-6 px-12 rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(227,197,127,0.4)] hover:shadow-[0_0_60px_rgba(227,197,127,0.6)] hover:-translate-y-1 group"
            >
              <span className="tracking-[0.1em] uppercase">Book Your Pass</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- NEW SECTION: LOCATION & PARTNERS --- */}
      <section className="relative z-10 w-full py-20 px-6 lg:px-24 bg-[#fcfaf5]/80 backdrop-blur-sm border-t border-foreground/5">
        <div className="max-w-6xl mx-auto flex flex-col gap-20">

          {/* Location Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center gap-4"
          >
            <h3 className="text-3xl font-extrabold text-brand-primary uppercase tracking-widest">Location</h3>
            <p className="text-xl text-foreground font-medium max-w-2xl">
              Hrishimani Party Plot, nr. Nirma University, Vaishnodevi, Ahmedabad – 382470
            </p>
            <a
              href="https://maps.app.goo.gl/Ksa9RJnFDBAoHG6j7?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-brand-primary border-b border-brand-primary pb-1 font-bold hover:text-brand-primary/80 transition-colors uppercase tracking-wider text-sm"
            >
              View on Google Maps
            </a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Sponsors */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-start gap-6 w-full"
            >
              <h3 className="text-2xl font-extrabold text-foreground uppercase tracking-widest border-b-2 border-brand-primary pb-2 inline-block">Our Sponsors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                <div className="bg-white shadow-sm border border-foreground/10 rounded-xl flex items-center justify-center h-28 relative overflow-hidden">
                  <Image src="/riva.png" alt="Riva Diamonds" fill sizes="200px" className="object-contain p-4" />
                </div>
                <div className="bg-white shadow-sm border border-foreground/10 rounded-xl flex items-center justify-center h-28 relative overflow-hidden">
                  <Image src="/Silver logo.png" alt="Silver Femmes" fill sizes="200px" className="object-contain p-3" />
                </div>
                <div className="bg-zinc-900 shadow-sm border border-foreground/10 rounded-xl flex items-center justify-center h-28 relative overflow-hidden">
                  <Image src="/ASSAR logo-white.png" alt="Assar Digisol" fill sizes="200px" className="object-contain p-4" />
                </div>
                <div className="bg-white shadow-sm border border-foreground/10 rounded-xl flex items-center justify-center h-28 relative overflow-hidden">
                  <Image src="/dholakia.png" alt="Dholakia Studio" fill sizes="200px" className="object-contain p-3" />
                </div>
                <div className="bg-white shadow-sm border border-foreground/10 rounded-xl flex items-center justify-center h-28 relative overflow-hidden">
                  <Image src="/nempanth (1).png" alt="Nempanthh" fill sizes="200px" className="object-contain p-2" />
                </div>
                <div className="bg-zinc-900 shadow-sm border border-foreground/10 rounded-xl flex items-center justify-center h-28 relative overflow-hidden">
                  <Image src="/zeel.png" alt="Zeel Tours & Immigration" fill sizes="200px" className="object-contain p-3" />
                </div>
              </div>
            </motion.div>

            {/* Ticket Partners */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-start gap-6 w-full"
            >
              <h3 className="text-2xl font-extrabold text-foreground uppercase tracking-widest border-b-2 border-brand-primary pb-2 inline-block">Ticket Partners</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                <div className="bg-white shadow-sm border border-foreground/10 rounded-xl flex items-center justify-center h-28 relative overflow-hidden">
                  <Image src="/MONSOON MANSION LOGO.png" alt="Monsoon" fill sizes="200px" className="object-contain p-3" />
                </div>
                <div className="bg-zinc-900 shadow-sm border border-foreground/10 rounded-xl flex items-center justify-center h-28 relative overflow-hidden">
                  <Image src="/roastery old white.png" alt="Roastery Culture" fill sizes="200px" className="object-contain p-3" />
                </div>
                <div className="bg-white shadow-sm border border-foreground/10 rounded-xl flex items-center justify-center h-28 relative overflow-hidden">
                  <Image src="/teataprri.png" alt="Tea Tappri" fill sizes="200px" className="object-contain p-3" />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

    </main>
  );
}
