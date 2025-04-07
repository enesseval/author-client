"use client";

import { BarChart, BookOpen, Calendar, ChevronRight, LayoutDashboard, MessageSquare, Settings, UserCircle, Users } from "lucide-react";
import React, { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";

type NavigationItem = {
   name: string;
   href: string;
   icon: React.ElementType;
   subItems?: NavigationItem[];
};

interface AdminAsideProps {
   mobileMenuOpen: boolean;
   setMobileMenuOpen: (open: boolean) => void;
}

const navigation: NavigationItem[] = [
   { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }, // href güncellendi
   { name: "Profil", href: "/admin/profile", icon: UserCircle },
   {
      name: "Kitaplar",
      href: "/admin/books",
      icon: BookOpen,
      subItems: [
         { name: "Kitaplar", href: "/admin/books/list", icon: BookOpen },
         { name: "Kategoriler", href: "/admin/books/categories", icon: BookOpen },
      ],
   },
   { name: "Yorumlar", href: "/admin/comments", icon: MessageSquare },
   // { name: "Etkinlikler", href: "/admin/etkinlikler", icon: Calendar }, // Kaldırıldı
   { name: "Kullanıcılar", href: "/admin/users", icon: Users },
   // { name: "İstatistikler", href: "/admin/istatistikler", icon: BarChart }, // Kaldırıldı
   // { name: "Ayarlar", href: "/admin/ayarlar", icon: Settings }, // Kaldırıldı
];

function AdminAside({ mobileMenuOpen, setMobileMenuOpen }: AdminAsideProps) {
   const router = useRouter();
   const { user } = useUser();

   const NavItem = ({ item, isMobile = false, onClose }: { item: NavigationItem; isMobile?: boolean; onClose?: () => void }) => {
      const pathname = usePathname();
      const [isOpen, setIsOpen] = useState(() => pathname.startsWith(item.href));
      const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/admin") || (item.href === "/admin" && pathname === "/admin");
      const hasSubItems = item.subItems && item.subItems.length > 0;

      const handleClick = async () => {
         if (hasSubItems) {
            setIsOpen(!isOpen);
         } else {
            await router.push(item.href);
            setMobileMenuOpen(false);
         }
      };

      return (
         <div className="flex flex-col">
            <div
               onClick={handleClick}
               className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all cursor-pointer
               ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
               <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
               <span className="flex-1">{item.name}</span>
               {hasSubItems && (
                  <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                     <ChevronRight className="h-4 w-4" />
                  </motion.div>
               )}
               {isActive && !hasSubItems && (
                  <motion.div layoutId={`sidebar-active-indicator${isMobile ? "-mobile" : ""}`} className="ml-auto h-1 w-1 rounded-full bg-primary" transition={{ duration: 0.2 }} />
               )}
            </div>

            {hasSubItems && isOpen && (
               <div className="ml-4 mt-1 space-y-1 border-l pl-3">
                  {item.subItems!.map((subItem) => (
                     <div
                        key={subItem.href}
                        onClick={async () => {
                           await router.push(subItem.href);
                           setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all cursor-pointer
                        ${pathname === subItem.href ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                     >
                        <subItem.icon className={`h-4 w-4 ${pathname === subItem.href ? "text-primary" : ""}`} />
                        {subItem.name}
                        {pathname === subItem.href && (
                           <motion.div layoutId={`sidebar-active-indicator${isMobile ? "-mobile" : ""}-sub`} className="ml-auto h-1 w-1 rounded-full bg-primary" transition={{ duration: 0.2 }} />
                        )}
                     </div>
                  ))}
               </div>
            )}
         </div>
      );
   };

   const MobileMenu = () => {
      return (
         <AnimatePresence>
            {mobileMenuOpen && (
               <>
                  {/* Backdrop */}
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.2 }}
                     className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[49] lg:hidden"
                     onClick={() => setMobileMenuOpen(false)}
                  />

                  {/* Menu */}
                  <motion.div
                     initial={{ x: "-100%" }}
                     animate={{ x: 0 }}
                     exit={{ x: "-100%" }}
                     transition={{ type: "spring", damping: 20, stiffness: 300 }}
                     className="fixed top-16 bottom-0 left-0 w-64 bg-background/80 backdrop-blur-md border-r shadow-lg z-[49] lg:hidden"
                  >
                     <ScrollArea className="h-full py-2">
                        <nav className="grid gap-1 px-2">
                           {navigation.map((item) => (
                              <NavItem key={item.href} item={item} isMobile onClose={() => setMobileMenuOpen(false)} />
                           ))}
                        </nav>
                     </ScrollArea>
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      );
   };

   return (
      <>
         <aside className="hidden lg:flex flex-col w-64 border-r bg-card">
            <ScrollArea className="flex-1 py-2">
               <nav className="grid gap-1 px-2">
                  {navigation.map((item) => {
                     if (user?.role !== "SUPER_ADMIN" && item.name === "Kullanıcılar") return null;
                     return <NavItem key={item.href} item={item} />;
                  })}
               </nav>
            </ScrollArea>
         </aside>
         <MobileMenu />
      </>
   );
}

export default AdminAside;
