"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, Mail, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
   return (
      <div className="min-h-screen flex items-center justify-center bg-pattern-paper p-4 absolute inset-0 z-50">
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-primary/10 shadow-lg p-8">
               <div className="text-center">
                  {/* İkon Animasyonu */}
                  <motion.div
                     className="mx-auto mb-6 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
                     initial={{ scale: 0.8 }}
                     animate={{ scale: 1 }}
                     transition={{
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200,
                     }}
                  >
                     <ShieldAlert className="h-10 w-10 text-primary/70" />
                  </motion.div>

                  {/* Başlık */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                     <h2 className="text-2xl font-bold text-primary mb-2">Erişim Engellendi</h2>
                     <h1 className="text-7xl font-bold text-primary/30 mb-4">403</h1>
                  </motion.div>

                  {/* Ana Mesaj */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
                     <p className="mb-6 text-muted-foreground">Bu sayfayı görmeye yetkiniz yok. Lütfen sistem yöneticinize danışınız veya ana sayfaya dönünüz.</p>

                     {/* Butonlar */}
                     <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                           <Button asChild variant="default" className="w-full sm:w-auto">
                              <Link href="/" className="flex items-center gap-2">
                                 <Home className="h-4 w-4" />
                                 Ana Sayfaya Dön
                              </Link>
                           </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                           <Button asChild variant="outline" className="w-full sm:w-auto">
                              <Link href="/iletisim" className="flex items-center gap-2">
                                 <Mail className="h-4 w-4" />
                                 Yönetici ile İletişime Geç
                              </Link>
                           </Button>
                        </motion.div>
                     </div>

                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-8 text-sm text-muted-foreground">
                        <Link href="javascript:history.back()" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                           <ArrowLeft className="h-3 w-3" />
                           Önceki sayfaya dön
                        </Link>
                     </motion.div>
                  </motion.div>
               </div>
            </div>

            {/* Dekoratif Kağıt Efekti */}
            <motion.div className="absolute -z-10 inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.6, duration: 0.8 }}>
               {[...Array(5)].map((_, index) => (
                  <motion.div
                     key={index}
                     className="absolute rounded-lg bg-primary/5 border border-primary/10"
                     style={{
                        top: `${50 + (Math.random() * 10 - 5)}%`,
                        left: `${50 + (Math.random() * 10 - 5)}%`,
                        width: `${Math.max(300, Math.random() * 100 + 300)}px`,
                        height: `${Math.max(200, Math.random() * 100 + 200)}px`,
                        transform: "translate(-50%, -50%) rotate(" + (Math.random() * 20 - 10) + "deg)",
                        zIndex: -10 - index,
                        opacity: 0.7 - index * 0.1,
                     }}
                  />
               ))}
            </motion.div>
         </motion.div>
      </div>
   );
}
