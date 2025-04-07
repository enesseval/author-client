"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
   return (
      <footer className="w-full border-t bg-background">
         <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 mx-auto">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
               <p className="text-center text-sm leading-loose md:text-left">&copy; {new Date().getFullYear()} Ahmet Yılmaz. Tüm hakları saklıdır.</p>
            </div>
            <div className="flex gap-4">
               <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                     <Instagram className="h-5 w-5" />
                     <span className="sr-only">Instagram</span>
                  </Link>
               </motion.div>
               <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                     <Twitter className="h-5 w-5" />
                     <span className="sr-only">Twitter</span>
                  </Link>
               </motion.div>
               <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                     <Facebook className="h-5 w-5" />
                     <span className="sr-only">Facebook</span>
                  </Link>
               </motion.div>
            </div>
            <nav className="flex gap-4 sm:gap-6">
               <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
                  Gizlilik Politikası
               </Link>
               <Link href="/terms" className="text-xs hover:underline underline-offset-4">
                  Kullanım Koşulları
               </Link>
               <Link href="/contact" className="text-xs hover:underline underline-offset-4">
                  İletişim
               </Link>
            </nav>
         </div>
      </footer>
   );
}

export default Footer;
