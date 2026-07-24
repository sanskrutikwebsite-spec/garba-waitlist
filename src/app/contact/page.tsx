"use client";

import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#fcfaf5] text-foreground relative overflow-hidden pt-24 lg:pt-32 px-6">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 fixed pointer-events-none bg-[#EAD7B7]">
        <div className="block md:hidden absolute inset-0">
          <img src="/bg-vertical.jpg" alt="Background" className="w-full h-full object-cover opacity-100" />
        </div>
        <div className="hidden md:block absolute inset-0">
          <img src="/bg-horizontal.jpg" alt="Background" className="w-full h-full object-cover opacity-100" />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center">
        
        {/* --- HEADER --- */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-center mb-16"
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-4">
            Get in <span className="text-brand-primary italic">Touch.</span>
          </h1>
          <p className="text-xl lg:text-2xl font-bold text-foreground/80 max-w-2xl mx-auto mb-8">
            Have a question about the event? We would love to hear from you.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-12">
            <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 shadow-sm">
              <span className="text-brand-primary">✉️</span>
              <span className="font-bold">Sanskrutikgarba@gmail.com</span>
            </div>
            <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 shadow-sm">
              <span className="text-brand-primary">📞</span>
              <span className="font-bold">+91 7202-011111</span>
            </div>
          </div>
        </motion.div>

        {/* --- FORM SECTION --- */}
        <div className="w-full flex justify-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="w-full max-w-3xl bg-white/50 backdrop-blur-2xl border border-white p-8 lg:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

            <h2 className="text-3xl font-extrabold text-foreground mb-12 text-center">Send a Message</h2>

            {/* FormSubmit.co Form */}
            <form action="https://formsubmit.co/Sanskrutikgarba@gmail.com" method="POST" className="relative z-10 flex flex-col gap-10">
              <input type="hidden" name="_subject" value="New General Inquiry from Website!" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_next" value="https://garba.sanskrutiksheri.com/contact" />

              <div className="flex flex-col relative group">
                <input type="text" name="name" required placeholder=" "
                  className="peer w-full bg-transparent border-b-2 border-foreground/10 px-0 py-3 text-xl font-bold text-foreground focus:outline-none focus:border-brand-primary transition-colors placeholder:text-transparent"
                />
                <label className="absolute left-0 top-0 text-foreground/50 text-sm font-bold uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-sm peer-focus:text-brand-primary">
                  Full Name
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 peer-focus:w-full"></div>
              </div>

              <div className="flex flex-col relative group">
                <input type="email" name="email" required placeholder=" "
                  className="peer w-full bg-transparent border-b-2 border-foreground/10 px-0 py-3 text-xl font-bold text-foreground focus:outline-none focus:border-brand-primary transition-colors placeholder:text-transparent"
                />
                <label className="absolute left-0 top-0 text-foreground/50 text-sm font-bold uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-sm peer-focus:text-brand-primary">
                  Email Address
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 peer-focus:w-full"></div>
              </div>

              <div className="flex flex-col relative group">
                <input type="tel" name="phone" required placeholder=" "
                  className="peer w-full bg-transparent border-b-2 border-foreground/10 px-0 py-3 text-xl font-bold text-foreground focus:outline-none focus:border-brand-primary transition-colors placeholder:text-transparent"
                />
                <label className="absolute left-0 top-0 text-foreground/50 text-sm font-bold uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-sm peer-focus:text-brand-primary">
                  Phone Number
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 peer-focus:w-full"></div>
              </div>

              <div className="flex flex-col relative group mt-4">
                <textarea name="message" required placeholder=" " rows={3}
                  className="peer w-full bg-transparent border-b-2 border-foreground/10 px-0 py-3 text-xl font-bold text-foreground focus:outline-none focus:border-brand-primary transition-colors placeholder:text-transparent resize-none"
                ></textarea>
                <label className="absolute left-0 top-0 text-foreground/50 text-sm font-bold uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-sm peer-focus:text-brand-primary">
                  Your Message
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 peer-focus:w-full"></div>
              </div>

              <button type="submit" className="mt-8 w-full bg-foreground text-white font-bold text-lg tracking-[0.2em] uppercase py-6 rounded-2xl hover:bg-brand-primary transition-colors duration-500 shadow-xl group relative overflow-hidden">
                <span className="relative z-10">Send Message</span>
                <div className="absolute inset-0 bg-brand-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
