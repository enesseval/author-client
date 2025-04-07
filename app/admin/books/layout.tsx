"use client";

import React from "react";
import { BooksProvider } from "@/context/BooksContext";

export default function BooksLayout({ children }: { children: React.ReactNode }) {
   return (
      <BooksProvider>
         <div>{children}</div>
      </BooksProvider>
   );
}
