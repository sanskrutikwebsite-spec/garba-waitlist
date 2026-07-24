"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

export default function ConnectPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#fcfaf5] text-foreground relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 fixed pointer-events-none bg-[#EAD7B7]">
        <div className="block md:hidden absolute inset-0">
          <img src="/bg-vertical.jpg" alt="Background" className="w-full h-full object-cover opacity-100" />
        </div>
        <div className="hidden md:block absolute inset-0">
          <img src="/bg-horizontal.jpg" alt="Background" className="w-full h-full object-cover opacity-100" />
        </div>
      </div>

      {/* --- HEADER --- */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center pt-8 md:pt-12 px-4 md:px-8 lg:px-12">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-4 md:mb-6">
            Partner <span className="text-brand-primary italic">With Us</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-foreground/80 max-w-2xl mx-auto">
            Align your brand with Ahmedabad's most authentic and exclusive Navratri celebration.
          </p>
        </motion.div>
        
        {/* --- BRAND VISIBILITY (HORIZONTAL SCROLL / GRID) --- */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="w-full mb-32">
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-extrabold text-center mb-16">Brand Visibility & Marketing</motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-brand-primary/20 -translate-y-1/2 z-0"></div>

            <motion.div variants={fadeUp} className="relative z-10 bg-[#fcfaf5] border-2 border-brand-primary/20 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl hover:shadow-2xl hover:border-brand-primary/60 transition-all duration-300 group">
              <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center font-extrabold text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-brand-primary/30">1</div>
              <h3 className="text-2xl font-extrabold text-center mb-6">Before Event</h3>
              <ul className="flex flex-col gap-4 font-bold text-foreground/80">
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Ticketing Apps (District, BookMyShow & AllEvents)</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Poster Brandings</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Massive Instagram & WhatsApp Campaigns</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="relative z-10 bg-[#fcfaf5] border-2 border-brand-primary/20 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl hover:shadow-2xl hover:border-brand-primary/60 transition-all duration-300 group">
              <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center font-extrabold text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-brand-primary/30">2</div>
              <h3 className="text-2xl font-extrabold text-center mb-6">During Event</h3>
              <ul className="flex flex-col gap-4 font-bold text-foreground/80">
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Strategic Standees</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Venue Posters</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Branded Photo Booths</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Stage Announcements</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="relative z-10 bg-[#fcfaf5] border-2 border-brand-primary/20 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl hover:shadow-2xl hover:border-brand-primary/60 transition-all duration-300 group">
              <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center font-extrabold text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-brand-primary/30">3</div>
              <h3 className="text-2xl font-extrabold text-center mb-6">After Event</h3>
              <ul className="flex flex-col gap-4 font-bold text-foreground/80">
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Highlight Videos & Reels</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Instagram Stories</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Official Thank You Posts</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* --- SPONSORSHIP PACKAGES (GLOWING CARDS) --- */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="w-full mb-32">
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-extrabold text-center mb-16">Sponsorship Tiers</motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            
            {/* Title Sponsor - Premium Dark Card */}
            <motion.div variants={fadeUp} className="bg-foreground text-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden group col-span-1 lg:col-span-2 xl:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/20 blur-[50px] rounded-full group-hover:bg-brand-primary/40 transition-colors duration-500"></div>

              <div className="inline-block bg-gradient-to-r from-amber-200 to-yellow-500 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest self-start mb-6 shadow-[0_0_15px_rgba(252,211,77,0.5)]">Premium Level</div>
              
              <h3 className="text-3xl md:text-4xl font-extrabold mb-2 relative z-10">Title Sponsor</h3>
              <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-brand-primary mb-8 relative z-10">₹15,00,000</p>
              
              <ul className="flex flex-col gap-4 font-semibold text-white/90 mb-10 flex-grow relative z-10">
                <li className="flex items-start gap-3"><span className="text-amber-400">✦</span> Private Branding</li>
                <li className="flex items-start gap-3"><span className="text-amber-400">✦</span> Social Media Marketing (Stories, Reels)</li>
                <li className="flex items-start gap-3"><span className="text-amber-400">✦</span> Top Logo Placement on physical branding (Passes, Banners, Standees)</li>
                <li className="flex items-start gap-3"><span className="text-amber-400">✦</span> Primary Stage Branding</li>
                <li className="flex items-start gap-3"><span className="text-amber-400">✦</span> VIP Seating & Free Food/Beverages</li>
                <li className="flex items-start gap-3"><span className="text-amber-400">✦</span> 100 Free Passes</li>
                <li className="flex items-start gap-3"><span className="text-amber-400">✦</span> Content Collaboration</li>
                <li className="flex items-start gap-3"><span className="text-amber-400">✦</span> Dedicated Bouncer Services</li>
              </ul>
            </motion.div>

            {/* Powered By */}
            <motion.div variants={fadeUp} className="bg-white/60 backdrop-blur-xl border border-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl flex flex-col relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="inline-block bg-slate-200 text-slate-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest self-start mb-6">Tier 2</div>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-2 relative z-10">Powered By</h3>
              <p className="text-xl md:text-2xl font-black text-brand-primary mb-8 relative z-10">₹10,00,000</p>
              <ul className="flex flex-col gap-4 font-bold text-foreground/80 mb-8 flex-grow relative z-10">
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Social Media Marketing</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Logo on all branding elements</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Stage Branding</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> VIP Seating & F&B</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> 75 Free Passes</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Dedicated Bouncers</li>
              </ul>
            </motion.div>

            {/* Bronze Sponsor */}
            <motion.div variants={fadeUp} className="bg-white/60 backdrop-blur-xl border border-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl flex flex-col relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="inline-block bg-orange-100 text-orange-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest self-start mb-6">Tier 3</div>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-2 relative z-10">Bronze Sponsor</h3>
              <p className="text-xl md:text-2xl font-black text-brand-primary mb-8 relative z-10">₹7,00,000</p>
              <ul className="flex flex-col gap-4 font-bold text-foreground/80 mb-8 flex-grow relative z-10">
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Social Media Marketing</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Logo on all branding elements</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> Content Collaboration</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> VIP Seating</li>
                <li className="flex items-start gap-3"><span className="text-brand-primary">✦</span> 40 Free Passes</li>
              </ul>
            </motion.div>

            {/* Associate & Support - Spanning two columns visually if needed, or just regular grid */}
            <motion.div variants={fadeUp} className="bg-white/40 backdrop-blur-xl border border-white/50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-lg flex flex-col hover:bg-white/60 transition-colors duration-300">
              <h3 className="text-xl md:text-2xl font-extrabold mb-1 text-foreground/80">Associate Partner</h3>
              <p className="text-lg md:text-xl font-bold text-brand-primary mb-6">₹5,00,000</p>
              <ul className="flex flex-col gap-3 font-semibold text-foreground/70">
                <li>✦ Social Media Marketing</li>
                <li>✦ Logo in all branding</li>
                <li>✦ Content Collaboration</li>
                <li>✦ 10 Free Passes</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white/40 backdrop-blur-xl border border-white/50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-lg flex flex-col hover:bg-white/60 transition-colors duration-300">
              <h3 className="text-xl md:text-2xl font-extrabold mb-1 text-foreground/80">Support Partner</h3>
              <p className="text-lg md:text-xl font-bold text-brand-primary mb-6">₹2,00,000</p>
              <ul className="flex flex-col gap-3 font-semibold text-foreground/70">
                <li>✦ Social Media Marketing</li>
                <li>✦ Logo in all branding elements</li>
              </ul>
            </motion.div>

          </div>
        </motion.div>

        {/* --- FORM SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-4xl mx-auto bg-white/30 backdrop-blur-xl border border-white/40 p-6 md:p-8 lg:p-12 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl relative overflow-hidden mb-24"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

          <h2 className="text-3xl font-extrabold text-center mb-2">Book a Sponsorship</h2>
          <p className="text-center font-bold text-foreground/60 mb-10">Or inquire about stalls for the event.</p>

          <form action="https://formsubmit.co/Sanskrutikgarba@gmail.com" method="POST" className="relative z-10 flex flex-col gap-8">
            <input type="hidden" name="_subject" value="New Sponsorship/Stall Inquiry!" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_next" value="https://garba.sanskrutiksheri.com/connect" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col relative group">
                <input type="text" name="name" required placeholder=" "
                  className="peer w-full bg-transparent border-b border-foreground/20 px-0 py-3 text-lg font-bold text-foreground focus:outline-none focus:border-brand-primary transition-colors placeholder:text-transparent"
                />
                <label className="absolute left-0 top-0 text-foreground/60 text-xs font-bold uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary">
                  Full Name
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 peer-focus:w-full"></div>
              </div>

              <div className="flex flex-col relative group">
                <input type="email" name="email" required placeholder=" "
                  className="peer w-full bg-transparent border-b border-foreground/20 px-0 py-3 text-lg font-bold text-foreground focus:outline-none focus:border-brand-primary transition-colors placeholder:text-transparent"
                />
                <label className="absolute left-0 top-0 text-foreground/60 text-xs font-bold uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary">
                  Email Address
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 peer-focus:w-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col relative group">
                <input type="tel" name="phone" required placeholder=" "
                  className="peer w-full bg-transparent border-b border-foreground/20 px-0 py-3 text-lg font-bold text-foreground focus:outline-none focus:border-brand-primary transition-colors placeholder:text-transparent"
                />
                <label className="absolute left-0 top-0 text-foreground/60 text-xs font-bold uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary">
                  Phone Number
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 peer-focus:w-full"></div>
              </div>

              <div className="flex flex-col relative group pt-2">
                <select name="inquiry_type" required defaultValue="" className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 text-lg font-bold text-foreground focus:outline-none focus:border-brand-primary transition-colors appearance-none cursor-pointer">
                  <option value="" disabled>Select Inquiry Type</option>
                  <option value="Sponsorship">Sponsorship Opportunities</option>
                  <option value="Stall Booking">Stall Booking</option>
                </select>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 focus-within:w-full"></div>
              </div>
            </div>

            <div className="flex flex-col relative group mt-4">
              <textarea name="message" required placeholder=" " rows={3}
                className="peer w-full bg-transparent border-b border-foreground/20 px-0 py-3 text-lg font-bold text-foreground focus:outline-none focus:border-brand-primary transition-colors placeholder:text-transparent resize-none"
              ></textarea>
              <label className="absolute left-0 top-0 text-foreground/60 text-xs font-bold uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary">
                Your Message
              </label>
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 peer-focus:w-full"></div>
            </div>

            <button type="submit" className="mt-6 w-full bg-foreground text-white font-bold text-sm tracking-[0.2em] uppercase py-5 rounded-none hover:bg-brand-primary transition-colors duration-500 shadow-xl group relative overflow-hidden">
              <span className="relative z-10">Submit Inquiry</span>
              <div className="absolute inset-0 bg-brand-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
            </button>
          </form>
        </motion.div>

      </div>
    </main>
  );
}
