"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import React from "react";
import Footer from "@/components/Footer";

function ClientLayout({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();

   const isAdminPage = pathname?.startsWith("/admin");
   const isLoginPage = pathname === "/login";
   const shouldHideNavAndFooter = isAdminPage || isLoginPage;

   return (
      <html lang="tr">
         <body className="bg-pattern min-h-screen flex flex-col">
            {!shouldHideNavAndFooter && <Navbar />}
            <motion.div initial={{ opacity: 1 }} transition={{ duration: 0.5 }} className="page-transition-in flex-1">
               {children}
            </motion.div>
            {!shouldHideNavAndFooter && <Footer />}
         </body>
      </html>
   );
}

export default ClientLayout;
