"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const faqs = [
  {
    question: "Can my QR pass be duplicated?",
    answer: "Every pass carries a unique QR code. Once it has been scanned at the venue, the same QR code cannot be used again."
  },
  {
    question: "Is there a dress code?",
    answer: "Yes, there is a strict traditional Navratri attire code which is to be followed."
  },
  {
    question: "Are the passes transferrable?",
    answer: "Digital passes can be shared to other people."
  },
  {
    question: "Is there an option for re-entry?",
    answer: "No, once you leave the premises, you cannot re-enter the venue."
  },
  {
    question: "Can I enter the venue after the event has started?",
    answer: "Yes, subject to the event's entry and security policies. However, we recommend arriving on time to enjoy the complete experience."
  },
  {
    question: "Can I bring outside food or beverages?",
    answer: "Outside food and beverages are not permitted inside the venue. Please follow the venue's security guidelines."
  },
  {
    question: "Is there parking available?",
    answer: "Yes, parking facilities will be provided at the day of the event."
  },
  {
    question: "Where do I find my digital pass?",
    answer: "Digital passes will be sent directly to the registered email."
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
