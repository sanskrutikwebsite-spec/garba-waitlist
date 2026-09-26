"use client";

import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function PrivacyPage() {
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
            Privacy <span className="text-brand-primary italic">Policy</span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
          className="w-full bg-white/30 backdrop-blur-xl border border-white/40 p-8 lg:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          <div className="prose prose-lg text-foreground/90 max-w-none">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            <p className="mb-6 font-semibold">
              When you join our waitlist or use our Connect forms, we collect the personal information you give us such as your name, address, and email address.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">2. How Do You Get My Consent?</h2>
            <p className="mb-6 font-semibold">
              When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">3. Disclosure</h2>
            <p className="mb-6 font-semibold">
              We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">4. Third-Party Services</h2>
            <p className="mb-6 font-semibold">
              In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us.
            </p>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
