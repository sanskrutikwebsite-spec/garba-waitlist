"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, Variants } from "framer-motion";

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

const imageReveal = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch("https://formsubmit.co/ajax/sanskrutikwebsite@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
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

      {/* --- EVENT GALLERY MARQUEE --- */}
      <section className="relative z-10 w-full overflow-hidden py-12 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
          className="relative flex w-full max-w-[100vw] overflow-hidden"
        >
          {/* The flex container is 2x the width of the images to allow infinite scroll. 
              We duplicate the array so when it translates -50%, it loops seamlessly. */}
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
                {/* Optional subtle gradient overlay to make it blend with the aesthetic */}
                <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply"></div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>


      {/* --- 4. BOUTIQUE FORM SECTION --- */}
      <section className="relative z-10 w-full py-32 px-6 lg:px-24 border-t border-foreground/10 overflow-hidden">

        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative">

          {/* Left: Sticky Call to Action */}
          <motion.div
            className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-32 h-fit"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-tight">
              Reserve <br />
              <span className="text-brand-primary italic">Your Spot</span>
            </h2>
            <p className="text-xl lg:text-2xl text-foreground/90 font-bold leading-relaxed">
              Join the waitlist for exclusive early access.
            </p>

            {/* Social Proof Counter */}

          </motion.div>

          {/* Right: The Minimalist Form */}
          <motion.div
            className="w-full lg:w-2/3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px" }}
          >
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center gap-6 py-12 text-center bg-white/40 backdrop-blur-sm p-8 border-l border-[#E3C57F]">
                <h3 className="text-3xl font-bold text-brand-primary">Submitted!</h3>
                <p className="text-xl font-medium text-foreground/80">Thank you for joining our waitlist.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-8 py-4 bg-brand-primary text-white rounded-none font-bold text-lg hover:bg-brand-primary/90 transition-colors uppercase tracking-widest text-sm"
                >
                  Submit again
                </button>
              </div>
            ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-10"
            >
              <input type="hidden" name="_subject" value="New Waitlist Entry - Navratri Garba!" />
              <input type="hidden" name="_cc" value="Sanskrutikgarba@gmail.com" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />

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
                  Phone Number
                </label>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col gap-4 mt-2">
                <p className="text-foreground/90 text-xs font-bold uppercase tracking-[0.2em]">Notify me via:</p>
                <div className="flex flex-wrap gap-8">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" name="notify_whatsapp" value="yes" className="w-4 h-4 accent-brand-primary cursor-pointer" />
                    <span className="text-foreground text-sm font-semibold group-hover:text-brand-primary transition-colors">WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" name="notify_sms" value="yes" className="w-4 h-4 accent-brand-primary cursor-pointer" />
                    <span className="text-foreground text-sm font-semibold group-hover:text-brand-primary transition-colors">SMS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" name="notify_email" value="yes" className="w-4 h-4 accent-brand-primary cursor-pointer" defaultChecked />
                    <span className="text-foreground text-sm font-semibold group-hover:text-brand-primary transition-colors">Email</span>
                  </label>
                </div>
              </motion.div>

              <motion.button
                variants={fadeUp}
                type="submit"
                disabled={isSubmitting}
                className="mt-6 self-start flex items-center gap-4 bg-foreground hover:bg-foreground/80 text-white font-semibold py-4 px-10 rounded-none transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-sm tracking-[0.2em] uppercase">{isSubmitting ? "Submitting..." : "Join The Waitlist"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </motion.button>
              {error && <p className="text-red-500 text-sm font-bold mt-2">Something went wrong. Please try again.</p>}
            </form>
            )}
          </motion.div>

        </div>
      </section>
    </main>
  );
}
