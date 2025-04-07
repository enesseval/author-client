"use client";

import Link from "next/link";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

function Navbar() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
      if (!isMenuOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "unset";
      }
   };

   const menuItems = [
      { href: "/", label: "Ana Sayfa" },
      { href: "books", label: "Kitaplar" },
      // { href: "/coming-soon", label: "Yakında" }, // Kaldırıldı
      { href: "/testimonials", label: "Okuyucu Yorumları" },
      { href: "/contact", label: "İletişim" },
   ];

   return (
      <>
         <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" aria-hidden="true" data-aria-hidden="true">
            <div className="container flex h-16 items-center justify-between mx-auto">
               <Link href="/" className="flex items-center space-x-2">
                  <span className="text-xl font-bold">Ahmet Yılmaz</span>
               </Link>
               <nav className="hidden md:flex gap-6">
                  {menuItems.map((item) => (
                     <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        {item.label}
                     </Link>
                  ))}
               </nav>
               <div className="flex items-center gap-2">
                  <motion.button className="md:hidden" onClick={toggleMenu} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                     {isMenuOpen ? (
                        <X className="h-6 w-6" />
                     ) : (
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="24"
                           height="24"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           className="h-6 w-6"
                        >
                           <line x1="4" x2="20" y1="12" y2="12" />
                           <line x1="4" x2="20" y1="6" y2="6" />
                           <line x1="4" x2="20" y1="18" y2="18" />
                        </svg>
                     )}
                  </motion.button>
               </div>
            </div>
         </header>

         <AnimatePresence>
            {isMenuOpen && (
               <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-40 md:hidden pt-16 bg-pattern-paper"
               >
                  {/* Menü içeriği */}
                  <div className="container relative flex flex-col h-full">
                     <nav className="flex flex-col items-center justify-center flex-1 gap-12 backdrop-blur-[2px]">
                        {menuItems.map((item) => (
                           <motion.div key={item.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.2, delay: 0.1 }}>
                              <Link href={item.href} className="text-4xl font-medium transition-colors hover:text-primary" onClick={toggleMenu}>
                                 {item.label}
                              </Link>
                           </motion.div>
                        ))}
                     </nav>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   );
}

export default Navbar;
