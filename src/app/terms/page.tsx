"use client";

import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function TermsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#fcfaf5] text-foreground relative py-24 lg:py-32 px-6">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 fixed pointer-events-none bg-[#EAD7B7]">
        <div className="block md:hidden absolute inset-0">
          <img src="/bg-vertical.jpg" alt="Background" className="w-full h-full object-cover opacity-100" />
        </div>
        <div className="hidden md:block absolute inset-0">
          <img src="/bg-horizontal.jpg" alt="Background" className="w-full h-full object-cover opacity-100" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-center mb-12"
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-tight drop-shadow-sm mb-4">
            Terms & <span className="text-brand-primary italic">Conditions</span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
          className="w-full bg-white/30 backdrop-blur-xl border border-white/40 p-8 lg:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          <div className="prose prose-lg text-foreground/90 max-w-none">
            <ul className="list-disc pl-6 space-y-4 font-semibold text-foreground/80">
              <li>Entry is allowed with only a valid pass. Any lost or scanned pass will not be replaced.</li>
              <li>No refunds or cancellations unless announced by the organisers.</li>
              <li>Admission rights are reserved by the organisers alone. Event is subjected to Ahmedabad jurisdiction.</li>
              <li>The organisers hold power to close the entry at any given point of time without any prior notice.</li>
              <li>Strictly no alcohol, smoking, vaping, drugs or other prohibited items allowed at the event venue.</li>
              <li>Outside food and beverages, weapons or inflammables are not allowed.</li>
              <li>Attendees are subjected to security checks.</li>
              <li>Any misbehaviour during the event may lead to removal.</li>
              <li>Organisers are not responsible for any loss, theft, injury or medical emergencies.</li>
              <li>Attendees must follow all safety guidelines and instructions from event staff at all time.</li>
              <li>Respect fellow attendees, performers and event staff. No misconduct will be tolerated.</li>
            </ul>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
