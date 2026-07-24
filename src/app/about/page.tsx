"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const timelineHeight = useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]);

  return (
    <main className="flex flex-col min-h-screen bg-[#fcfaf5] text-foreground relative overflow-hidden pt-24 lg:pt-32 pb-24">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 fixed pointer-events-none bg-[#EAD7B7]">
        <div className="block md:hidden absolute inset-0">
          <img src="/bg-vertical.jpg" alt="Background" className="w-full h-full object-cover opacity-100" />
        </div>
        <div className="hidden md:block absolute inset-0">
          <img src="/bg-horizontal.jpg" alt="Background" className="w-full h-full object-cover opacity-100" />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 flex flex-col items-center">
        
        {/* --- HERO HEADER --- */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-center mb-32 lg:mb-48"
        >
          <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-tight mb-8">
            The <span className="text-brand-primary italic font-serif">Story</span>
          </h1>
          <p className="text-2xl lg:text-3xl font-semibold text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Reviving the true spirit of Ahmedabad's traditional Sheri Garba through devotion, music, and community.
          </p>
        </motion.div>


        {/* --- STORY SECTION (EDITORIAL MAGAZINE STYLE) --- */}
        <div className="w-full flex flex-col items-center text-center max-w-3xl mx-auto mb-40">
          
          {/* Subtle Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mb-20">
            <div className="w-24 h-[1px] bg-brand-primary/40"></div>
            <div className="w-2 h-2 rotate-45 bg-brand-primary"></div>
            <div className="w-24 h-[1px] bg-brand-primary/40"></div>
          </div>

          {/* Section 1: A Return to Roots */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }}
            className="w-full mb-32"
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-12 text-foreground tracking-tight">A Return to Roots</h2>
            
            <div className="text-xl lg:text-2xl leading-relaxed text-foreground/80 font-medium flex flex-col gap-10">
              <p>
                Founded in <span className="font-bold text-foreground">2022</span> by Dailisay Events LLP, Sanskrutik Sheri Garba was born out of a profound desire to preserve the authentic, deeply spiritual essence of Navratri.
              </p>
              <p>
                What began as a 17-year-old student's vision to bring together just <span className="font-bold text-foreground">150 people</span> quickly blossomed into a celebration of 600+ devotees in its very first year.
              </p>
              <p>
                Over four incredible years, the event expanded to welcome <span className="font-bold text-foreground">2,500+ participants</span>, featuring renowned artists while stubbornly remaining rooted in tradition and affordability.
              </p>
            </div>
          </motion.div>

          {/* Subtle Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mb-20">
            <div className="w-24 h-[1px] bg-brand-primary/40"></div>
            <div className="w-2 h-2 rotate-45 bg-brand-primary"></div>
            <div className="w-24 h-[1px] bg-brand-primary/40"></div>
          </div>

          {/* Section 2: Culture Over Commercialization */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, delay: 0.2 }}
            className="w-full"
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-12 text-foreground tracking-tight">Culture Over Commercialization</h2>
            
            <p className="text-xl lg:text-2xl leading-relaxed text-foreground/80 font-medium mb-16">
              Today, Navratri has become larger than ever. But somewhere along the way: the devotional atmosphere, the open dancing spaces, the authentic traditional music, and the profound feeling of community have slowly disappeared.
            </p>
            
            <div className="my-16 relative">
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-7xl text-brand-primary/20 font-serif leading-none">"</span>
              <p className="text-3xl lg:text-4xl font-semibold italic text-brand-primary leading-snug px-4 md:px-12 font-serif relative z-10">
                Sanskrutik Sheri Garba exists to preserve that heritage. Not by becoming larger. But by becoming more meaningful.
              </p>
              <span className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-7xl text-brand-primary/20 font-serif leading-none rotate-180">"</span>
            </div>
            
            <p className="text-xl lg:text-2xl leading-relaxed text-foreground/90 font-bold mt-16">
              In 2026, we return to our roots with an exclusive, intimate, one-night celebration on 11 October.
            </p>
          </motion.div>

          {/* Subtle Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mt-32 mb-10">
            <div className="w-24 h-[1px] bg-brand-primary/40"></div>
            <div className="w-2 h-2 rotate-45 bg-brand-primary"></div>
            <div className="w-24 h-[1px] bg-brand-primary/40"></div>
          </div>

        </div>


        {/* --- THE TIMELINE (DYNAMIC SCROLL) --- */}
        <div ref={containerRef} className="w-full max-w-4xl mx-auto relative pb-32">
          
          <div className="text-center mb-32 relative z-10">
            <h2 className="text-5xl lg:text-6xl font-black text-foreground">
              Our <span className="text-brand-primary italic font-serif">Journey</span>
            </h2>
          </div>

          {/* Vertical Line Background */}
          <div className="absolute left-[20px] md:left-1/2 top-32 bottom-0 w-[2px] bg-foreground/10 -translate-x-1/2 z-0"></div>
          
          {/* Glowing Animated Line */}
          <motion.div 
            style={{ height: timelineHeight }}
            className="absolute left-[20px] md:left-1/2 top-32 w-[2px] bg-brand-primary -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(202,152,109,0.8)]"
          ></motion.div>

          <div className="flex flex-col gap-32 relative z-20">
            
            {/* 2022 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center w-full group"
            >
              <div className="w-full md:w-1/2 pr-0 md:pr-12 text-left md:text-right pl-[60px] md:pl-0">
                <h3 className="text-5xl font-black text-brand-primary mb-2 font-serif">2022</h3>
                <p className="text-2xl font-bold text-foreground/70">The Beginning</p>
              </div>
              <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rotate-45 bg-[#fcfaf5] border-2 border-brand-primary -translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-full md:w-1/2 pl-[60px] md:pl-12 text-left mt-4 md:mt-0">
                <div>
                  <p className="text-xl font-bold text-foreground"><span className="opacity-40 line-through mr-3">150 Planned</span> 600 Attended</p>
                  <p className="mt-3 text-foreground/70 font-medium text-lg leading-relaxed max-w-sm">What started as a student's vision exploded into a massive gathering of devotees.</p>
                </div>
              </div>
            </motion.div>

            {/* 2023 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row-reverse items-center w-full group"
            >
              <div className="w-full md:w-1/2 pl-[60px] md:pl-12 text-left">
                <h3 className="text-5xl font-black text-brand-primary mb-2 font-serif">2023</h3>
                <p className="text-2xl font-bold text-foreground/70">The Expansion</p>
              </div>
              <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rotate-45 bg-[#fcfaf5] border-2 border-brand-primary -translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-full md:w-1/2 pr-0 md:pr-12 text-left md:text-right pl-[60px] md:pl-0 mt-4 md:mt-0">
                <div className="flex flex-col items-start md:items-end">
                  <p className="text-xl font-bold text-foreground">1,250 People • Bigger Ground</p>
                  <p className="mt-3 text-foreground/70 font-medium text-lg leading-relaxed max-w-sm text-left md:text-right">Scaling up the venue to accommodate the growing community while retaining our roots.</p>
                </div>
              </div>
            </motion.div>

            {/* 2024 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center w-full group"
            >
              <div className="w-full md:w-1/2 pr-0 md:pr-12 text-left md:text-right pl-[60px] md:pl-0">
                <h3 className="text-5xl font-black text-brand-primary mb-2 font-serif">2024</h3>
                <p className="text-2xl font-bold text-foreground/70">Growing Community</p>
              </div>
              <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rotate-45 bg-[#fcfaf5] border-2 border-brand-primary -translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-full md:w-1/2 pl-[60px] md:pl-12 text-left mt-4 md:mt-0">
                <div>
                  <p className="text-xl font-bold text-foreground">1,500 Participants</p>
                  <p className="mt-3 text-foreground/70 font-medium text-lg leading-relaxed max-w-sm">Introducing renowned artists and elevating the overall experience for our attendees.</p>
                </div>
              </div>
            </motion.div>

            {/* 2025 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row-reverse items-center w-full group"
            >
              <div className="w-full md:w-1/2 pl-[60px] md:pl-12 text-left">
                <h3 className="text-5xl font-black text-brand-primary mb-2 font-serif">2025</h3>
                <p className="text-2xl font-bold text-foreground/70">The Peak</p>
              </div>
              <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rotate-45 bg-[#fcfaf5] border-2 border-brand-primary -translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-full md:w-1/2 pr-0 md:pr-12 text-left md:text-right pl-[60px] md:pl-0 mt-4 md:mt-0">
                <div className="flex flex-col items-start md:items-end">
                  <p className="text-xl font-bold text-foreground">2,500 Attendees</p>
                  <p className="mt-3 text-foreground/70 font-medium text-lg leading-relaxed max-w-sm text-left md:text-right">A massive celebration of devotion and culture on a scale we never imagined.</p>
                </div>
              </div>
            </motion.div>

            {/* 2026 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center w-full group"
            >
              <div className="w-full md:w-1/2 pr-0 md:pr-12 text-left md:text-right pl-[60px] md:pl-0">
                <h3 className="text-6xl font-black text-foreground mb-2 font-serif">2026</h3>
                <p className="text-3xl font-black text-brand-primary">A New Chapter</p>
              </div>
              <div className="absolute left-[20px] md:left-1/2 w-8 h-8 rotate-45 bg-brand-primary border-4 border-[#fcfaf5] -translate-x-1/2 shadow-[0_0_30px_rgba(202,152,109,0.8)] group-hover:scale-125 transition-transform duration-500"></div>
              <div className="w-full md:w-1/2 pl-[60px] md:pl-12 text-left mt-4 md:mt-0">
                <div>
                  <p className="text-2xl font-extrabold text-brand-primary mb-3">Private. Curated. Heritage-First.</p>
                  <p className="text-foreground/90 font-medium text-lg leading-relaxed max-w-md">Returning to our roots with an exclusive one-night celebration designed to preserve the true meaning of Sheri Garba.</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </main>
  );
}
