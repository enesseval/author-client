"use client";

import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { authApi } from "@/services/api/authApi";
import { toast } from "sonner";
import Loading from "@/components/Loading";

type User = {
   id: string;
   username: string;
   role: string;
};

interface UserContextType {
   user: User | null;
   setUser: (user: User | null) => void;
   isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const router = useRouter();

   useEffect(() => {
      const checkUser = async () => {
         const startTime = Date.now();
         try {
            const response = await authApi.checkUser();
            if (response.success && response.data) {
               setUser(response.data);
            }
         } catch (error: any) {
            if (error.response?.status === 401) {
               // Token yok veya geçersiz
               router.push("/login");
            } else {
               toast.error("Kullanıcı bilgileri alınamadı");
            }
         } finally {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(1000 - elapsedTime, 0);

            setTimeout(() => {
               setIsLoading(false);
            }, remainingTime);
         }
      };

      checkUser();
   }, [router]);

   return <UserContext.Provider value={{ user, setUser, isLoading }}>{isLoading ? <Loading /> : children}</UserContext.Provider>;
};

export const useUser = () => {
   const context = useContext(UserContext);
   if (!context) throw new Error("useUser must be used within a UserProvider");
   return context;
};
