"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import { useState } from "react";

// Confetti particle component
function ConfettiParticle({ index }: { index: number }) {
  const colors = ["#E3C57F", "#D4A017", "#8B1A1A", "#C94B4B", "#4CAF50", "#2196F3"];
  const color = colors[index % colors.length];
  const size = (index % 5) + 6;
  const left = (index * 7.3) % 100;
  const delay = (index * 0.15) % 2;
  const duration = (index % 3) + 2.5;

  return (
    <motion.div
      className="absolute top-0 pointer-events-none"
      style={{
        left: `${left}%`,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: index % 3 === 0 ? "50%" : "2px",
      }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{
        y: "110vh",
        opacity: [1, 1, 0],
        rotate: index % 2 === 0 ? 360 : -360,
      }}
      transition={{
        duration,
        delay,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: (index % 3) + 1,
      }}
    />
  );
}

export default function ThankYouPage() {
  const [particles] = useState(() => Array.from({ length: 40 }, (_, i) => i));

  return (
    <main className="min-h-screen font-sans text-foreground relative overflow-hidden flex items-center justify-center">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="block md:hidden absolute inset-0">
          <Image src="/bg-vertical.jpg" alt="Background" fill sizes="100vw" className="object-cover" priority />
        </div>
        <div className="hidden md:block absolute inset-0">
          <Image src="/bg-horizontal.jpg" alt="Background" fill sizes="100vw" className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Confetti */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {particles.map((i) => (
          <ConfettiParticle key={i} index={i} />
        ))}
      </div>

      {/* Card */}
      <motion.div
        className="relative z-20 w-full max-w-2xl mx-auto px-6 py-10"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-[#E3C57F]/60 px-8 py-12 md:px-14 md:py-16 flex flex-col items-center text-center gap-8">

          {/* Logo */}
          <motion.div
            className="relative w-48 h-48"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image src="/logo-sg.png" alt="Sanskrutik Sheri Garba" fill className="object-contain mix-blend-multiply" />
          </motion.div>

          {/* Check icon */}
          <motion.div
            className="w-20 h-20 rounded-full bg-brand-primary flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>

          {/* Headline */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              You&apos;re All Set! 🎉
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-brand-primary uppercase tracking-widest">
              Registration Successful
            </h2>
          </motion.div>

          {/* Divider */}
          <div className="w-16 h-[2px] bg-brand-primary rounded-full" />

          {/* Message */}
          <motion.div
            className="flex flex-col gap-4 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-lg text-foreground/80 font-medium leading-relaxed">
              Thank you for your incredible love and interest in{" "}
              <span className="font-bold text-brand-primary">Sanskrutik Sheri Garba</span>.
            </p>
            <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-2xl p-5">
              <p className="text-base font-semibold text-foreground/90 leading-relaxed">
                ✅ Your registration has been received.<br />
                📩 We will confirm your approval within{" "}
                <span className="font-bold text-brand-primary">24–48 hours</span> via{" "}
                <span className="font-bold">Email</span> or{" "}
                <span className="font-bold">WhatsApp</span>.
              </p>
            </div>
            <p className="text-sm text-foreground/60 font-medium">
              No further action needed — sit back and get ready to dance! 💃🕺
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            <Link
              href="/"
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 uppercase tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              Back to Homepage
            </Link>
            <Link
              href="/checkout"
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-transparent border-2 border-foreground/30 hover:border-brand-primary text-foreground hover:text-brand-primary font-bold text-sm py-4 px-8 rounded-full transition-all duration-300 uppercase tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
              Register Another Person
            </Link>
          </motion.div>

        </div>
      </motion.div>

      {/* Facebook Pixel */}
      <Script id="fb-pixel-thank-you" strategy="afterInteractive">
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
          fbq('track', 'CompleteRegistration');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1563231012272827&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </main>
  );
}
