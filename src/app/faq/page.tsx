"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const faqs = [
  {
    question: "When and where is the event taking place?",
    answer: "The dates and exact venue are currently being finalized. By joining the waitlist, you'll be the first to know as soon as the official announcement is made."
  },
  {
    question: "Is there a dress code?",
    answer: "Yes, to honor the cultural significance of the event, traditional Navratri attire (Chaniya Choli for women, Kurta for men) is highly encouraged."
  },
  {
    question: "Are children allowed?",
    answer: "Absolutely! Sanskrutik Sheri Garba is a family-friendly event. Children of all ages are welcome to join in the celebrations."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

      <div className="relative z-10 max-w-3xl mx-auto w-full flex flex-col items-center">

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-center mb-16"
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-tight drop-shadow-sm mb-4">
            Frequently <br />
            <span className="text-brand-primary italic">Asked Questions</span>
          </h1>
        </motion.div>

        <div className="w-full flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              className="w-full bg-white/30 backdrop-blur-xl border border-white/40 p-6 lg:p-8 rounded-[1.5rem] shadow-xl overflow-hidden cursor-pointer transition-all duration-300"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl lg:text-2xl font-bold text-foreground">{faq.question}</h3>
                <span className="text-brand-primary text-2xl ml-4 font-extrabold">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>

              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-brand-primary/20"
                >
                  <p className="text-lg font-bold text-foreground/80 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}
