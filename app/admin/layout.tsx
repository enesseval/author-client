"use client";

import AdminAside from "@/components/AdminAside";
import AdminHeader from "@/components/AdminHeader";
import { UserProvider, useUser } from "@/context/UserContext"; // useUser eklendi
import { ReactNode, useState, useEffect } from "react"; // useEffect eklendi
import { socket } from "@/lib/socket"; // Socket instance eklendi
import { toast } from "sonner"; // Toast bildirimleri için eklendi
import { useRouter } from "next/navigation"; // Linke tıklama için
import { NotificationPayload } from "@/types/types"; // Bildirim tipi import edildi

// UserContext'e erişmek ve Socket.IO mantığını yönetmek için iç component
function AdminLayoutContent({ children }: { children: ReactNode }) {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const { user, isLoading } = useUser(); // UserContext'ten kullanıcı ve yüklenme durumu
   const router = useRouter();

   console.log(user);

   useEffect(() => {
      // Yükleme tamamlanmadıysa veya kullanıcı yoksa işlem yapma
      if (isLoading || !user) {
         // Eğer bağlantı açıksa kapat (örneğin kullanıcı logout olduysa)
         if (socket.connected) {
            socket.disconnect();
         }
         return;
      }

      // Kullanıcı varsa ve bağlantı yoksa bağlan
      if (user && !socket.connected) {
         socket.connect();
      }

      // Yeni bildirim dinleyicisi
      const handleNewNotification = (notification: NotificationPayload) => {
         toast.info(notification.message, {
            description: `Tür: ${notification.type}`,
            duration: 10000, // 10 saniye göster
            action: notification.link
               ? {
                    label: "Git",
                    onClick: () => router.push(notification.link!),
                 }
               : undefined,
         });
         // Burada bildirimleri bir state'te tutup listeleyebiliriz de.
      };

      // Olay dinleyicisini ekle
      socket.on("new_notification", handleNewNotification);

      // Cleanup fonksiyonu: Component unmount olduğunda veya user/isLoading değiştiğinde çalışır
      return () => {
         socket.off("new_notification", handleNewNotification);
         // Bağlantıyı sadece gerçekten gerekliyse kesmek daha iyi olabilir,
         // örneğin kullanıcı tamamen uygulamadan çıktığında. Şimdilik her unmount'ta keselim.
         if (socket.connected) {
            socket.disconnect();
         }
      };
   }, [user, isLoading, router]); // Bağımlılıkları ekle

   return (
      <div className="flex flex-col min-h-screen bg-muted/30">
         <AdminHeader mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
         <div className="flex flex-1">
            <AdminAside mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            <main className="flex-1 mx-4">{children}</main>
         </div>
      </div>
   );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
   // UserProvider tüm admin layout'unu sarmalamalı
   return (
      <UserProvider>
         <AdminLayoutContent>{children}</AdminLayoutContent>
      </UserProvider>
   );
}
