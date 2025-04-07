"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const isAdminRoute = pathname?.startsWith("/admin");
   const isLoginPage = pathname === "/login";
   const shouldHideNavigation = isAdminRoute || isLoginPage;

   return (
      <>
         {!shouldHideNavigation && <Navbar />}
         {children}
         {!shouldHideNavigation && <Footer />}
      </>
   );
}
