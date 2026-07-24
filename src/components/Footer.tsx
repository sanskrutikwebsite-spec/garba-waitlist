"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#fcfaf5] border-t border-brand-primary/10 relative z-10 pt-16 pb-8 px-6 text-foreground/80 overflow-hidden mt-auto">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
         <Image 
           src="/bg-horizontal.jpg" 
           alt="texture" 
           fill 
           className="object-cover mix-blend-multiply"
         />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand Column */}
        <div className="flex flex-col items-center md:items-start col-span-1 md:col-span-2">
          <Link href="/">
            <div className="relative w-64 h-24 md:w-72 md:h-28 mb-6">
              <Image 
                src="/logo-sg.png" 
                alt="Logo" 
                fill
                className="object-contain object-center md:object-left mix-blend-multiply"
              />
            </div>
          </Link>
          <p className="text-sm font-bold text-center md:text-left max-w-sm mb-6">
            Where tradition comes through every step. Join us in celebrating the true essence of Navratri.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/sanskrutikgarba/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-primary/20 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300">
              <span className="sr-only">Instagram</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-brand-primary font-bold tracking-widest uppercase mb-6 text-sm">Explore</h4>
          <ul className="flex flex-col gap-4 font-bold text-sm text-center md:text-left">
            <li><Link href="/" className="hover:text-brand-primary transition-colors">Waitlist</Link></li>
            <li><Link href="/about" className="hover:text-brand-primary transition-colors">About Us</Link></li>
            <li><Link href="/faq" className="hover:text-brand-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-brand-primary font-bold tracking-widest uppercase mb-6 text-sm">Information</h4>
          <ul className="flex flex-col gap-4 font-bold text-sm text-center md:text-left">
            <li><Link href="/contact" className="hover:text-brand-primary transition-colors">Contact Us</Link></li>
            <li><Link href="/connect" className="hover:text-brand-primary transition-colors">Sponsors & Stalls</Link></li>
            <li><Link href="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 border-t border-brand-primary/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-bold text-foreground/60 gap-4">
        <p>© {new Date().getFullYear()} Sanskrutik Sheri Garba. All rights reserved.</p>
        <p>Events Managed By Dailisay Events LLP</p>
      </div>
    </footer>
  );
}
