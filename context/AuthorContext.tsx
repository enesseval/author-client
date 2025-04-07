"use client";

import { getProfileData } from "@/services/api/authorApi";
import { ProfileData } from "@/types/types";
import { createContext, useContext, useEffect, useState } from "react";

// Context tipi
interface AuthorContextData {
   author: ProfileData | null;
   isLoading: boolean;
}

// Varsayılan değerleri belirleme
const defaultContextValue: AuthorContextData = {
   author: null,
   isLoading: true,
};

const AuthorContext = createContext<AuthorContextData>(defaultContextValue);

export const AuthorProvider = ({ children }: { children: React.ReactNode }) => {
   const [author, setAuthor] = useState<ProfileData | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchAuthor = async () => {
         try {
            setIsLoading(true);
            const authorData = await getProfileData();
            setAuthor(authorData);
         } catch (error) {
            console.error("Profil verileri yüklenirken hata:", error);
            setAuthor(null);
         } finally {
            setIsLoading(false);
         }
      };
      fetchAuthor();
   }, []);

   return <AuthorContext.Provider value={{ author, isLoading }}>{children}</AuthorContext.Provider>;
};

export const useAuthor = () => {
   const context = useContext(AuthorContext);
   if (!context) {
      throw new Error("useAuthor must be used within an AuthorProvider");
   }
   return context;
};
