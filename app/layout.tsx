import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NavigationWrapper from "@/components/NavigationWrapper";
import { AuthorProvider } from "@/context/AuthorContext";
import { getProfileData } from "@/services/api/authorApi";
import { BooksProvider } from "@/context/BooksContext";

const inter = Inter({ subsets: ["latin"] });

// Statik metadata yerine dinamik metadata kullanacağız
export async function generateMetadata(): Promise<Metadata> {
   try {
      // Yazar verilerini API'den al
      const authorData = await getProfileData();

      // API'den gelen verileri kullan
      return {
         title: authorData.pageTitle || "Author Website",
         description: "Author's personal website and blog",
         icons: authorData.faviconUrl ? [{ rel: "icon", url: authorData.faviconUrl }] : undefined,
      };
   } catch (error) {
      // Veri getirme hatası olursa varsayılan değerleri kullan
      console.error("Error loading metadata:", error);
      return {
         title: "Author Website",
         description: "Author's personal website and blog",
      };
   }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="tr">
         <body className={inter.className}>
            <AuthorProvider>
               <BooksProvider>
                  <NavigationWrapper>{children}</NavigationWrapper>
                  <Toaster richColors position="bottom-right" />
               </BooksProvider>
            </AuthorProvider>
         </body>
      </html>
   );
}
