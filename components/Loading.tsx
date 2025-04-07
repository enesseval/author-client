"use client";

import { motion } from "framer-motion";

export default function Loading() {
   return (
      <div className="fixed inset-0 flex items-center justify-center bg-pattern-paper z-50">
         <div className="w-full max-w-md aspect-square flex items-center justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
               {/* Sabit boyutlu kağıt arka planı */}
               <motion.div
                  className="absolute inset-0 bg-white/90 rounded-lg shadow-md border border-primary/20"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                     duration: 20,
                     repeat: Number.POSITIVE_INFINITY,
                     ease: "linear",
                  }}
               />

               {/* İç kağıt katmanı */}
               <motion.div
                  className="absolute inset-4 bg-white rounded-lg shadow-sm border border-primary/10"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: -360 }}
                  transition={{
                     duration: 15,
                     repeat: Number.POSITIVE_INFINITY,
                     ease: "linear",
                  }}
               />

               {/* Merkez içerik */}
               <div className="relative z-10 text-center">
                  <motion.div className="w-20 h-20 mx-auto mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-primary/80">
                        <motion.path
                           d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           initial={{ pathLength: 0, opacity: 0 }}
                           animate={{ pathLength: 1, opacity: 1 }}
                           transition={{ duration: 1, delay: 0.2 }}
                        />
                        <motion.path
                           d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           initial={{ pathLength: 0, opacity: 0 }}
                           animate={{ pathLength: 1, opacity: 1 }}
                           transition={{ duration: 1.5 }}
                        />
                     </svg>
                  </motion.div>

                  <h3 className="text-xl font-medium text-primary/80 mb-3">Yükleniyor...</h3>

                  <div className="flex justify-center space-x-2">
                     {[0, 1, 2].map((index) => (
                        <motion.div
                           key={index}
                           className="w-2 h-2 rounded-full bg-primary/60"
                           animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.3, 1, 0.3],
                           }}
                           transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: index * 0.3,
                              ease: "easeInOut",
                           }}
                        />
                     ))}
                  </div>
               </div>

               {/* Dekoratif noktalar */}
               {[...Array(8)].map((_, index) => {
                  const angle = (index * Math.PI) / 4;
                  const radius = 100;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                     <motion.div
                        key={index}
                        className="absolute w-2 h-2 rounded-full bg-primary/40"
                        style={{
                           left: "50%",
                           top: "50%",
                           marginLeft: "-1px",
                           marginTop: "-1px",
                        }}
                        animate={{
                           x: [0, x * 0.5, x, x * 0.5, 0],
                           y: [0, y * 0.5, y, y * 0.5, 0],
                           opacity: [0, 1, 0.5, 1, 0],
                        }}
                        transition={{
                           duration: 8,
                           repeat: Number.POSITIVE_INFINITY,
                           delay: index * 0.5,
                           ease: "easeInOut",
                        }}
                     />
                  );
               })}
            </div>
         </div>
      </div>
   );
}
