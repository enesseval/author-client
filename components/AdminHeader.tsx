"use client";

import { useState, useEffect, useRef } from "react"; // useRef eklendi
import { Bell, BookOpen, Menu, User, LogOut, X, MessageSquareWarning } from "lucide-react"; // MessageSquareWarning eklendi
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/authApi";
import { commentApi } from "@/services/api/commentApi"; // commentApi import edildi
import { Comment } from "@/types/types"; // Comment tipi import edildi
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns"; // date-fns importları geri eklendi
import { tr } from "date-fns/locale"; // Türkçe lokasyon

interface AdminHeaderProps {
   mobileMenuOpen: boolean;
   setMobileMenuOpen: (open: boolean) => void;
}

export default function AdminHeader({ mobileMenuOpen, setMobileMenuOpen }: AdminHeaderProps) {
   const { user, setUser } = useUser();
   const router = useRouter();
   const [pendingCount, setPendingCount] = useState<number>(0);
   const [latestPendingComments, setLatestPendingComments] = useState<Comment[]>([]); // Son bekleyen yorumlar için state
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const previousPendingCount = useRef<number>(0); // Önceki sayıyı tutmak için ref

   // Bekleyen yorumları ve sayısını çekme fonksiyonu
   const fetchNotifications = async (showToast = false) => {
      if (!user) return; // Kullanıcı yoksa işlem yapma

      try {
         // Sayıyı çek
         const countResponse = await commentApi.getPendingCommentCount();
         let currentCount = 0;
         if (countResponse.success && countResponse.data) {
            currentCount = countResponse.data.count;
            setPendingCount(currentCount);

            // Sayı arttıysa ve toast gösterilmesi isteniyorsa bildirim göster
            if (showToast && currentCount > previousPendingCount.current) {
               toast.info(`Yeni ${currentCount - previousPendingCount.current} yorum onay bekliyor!`);
            }
            previousPendingCount.current = currentCount; // Mevcut sayıyı ref'e kaydet
         } else {
            console.error("Bekleyen yorum sayısı alınamadı:", countResponse.message);
         }

         // Dropdown açıksa veya yeni yorum varsa son yorumları çek (limitli)
         if (isDropdownOpen || (showToast && currentCount > 0)) {
            const commentsResponse = await commentApi.getPendingComments(); // Şimdilik hepsini çekiyoruz, limit eklenebilir
            if (commentsResponse.success && commentsResponse.data) {
               // Son 5 yorumu alalım (veya API'den limitli isteyelim)
               setLatestPendingComments(commentsResponse.data.slice(0, 5));
            } else {
               console.error("Bekleyen yorumlar alınamadı:", commentsResponse.message);
            }
         }
      } catch (error) {
         console.error("Bildirim API hatası:", error);
      }
   };

   // Periyodik olarak bildirimleri kontrol et
   useEffect(() => {
      if (!user) return; // Kullanıcı yoksa interval başlatma

      // İlk yüklemede hemen çek (toast gösterme)
      fetchNotifications(false);

      // Polling interval'ı
      const intervalId = setInterval(() => {
         fetchNotifications(true); // Sonraki çekmelerde toast göster
      }, 30000); // 30 saniyede bir kontrol et

      return () => clearInterval(intervalId); // Component unmount olduğunda interval'ı temizle
   }, [user]); // user değiştiğinde interval'ı yeniden başlat/durdur

   // Dropdown açıldığında son yorumları çek
   useEffect(() => {
      if (isDropdownOpen) {
         fetchNotifications(false); // Dropdown açıldığında toast gösterme
      }
   }, [isDropdownOpen]);

   const handleLogout = async () => {
      try {
         await authApi.logout();
         setUser(null);
         router.push("/login");
         toast.success("Başarıyla çıkış yapıldı");
      } catch (error) {
         toast.error("Çıkış yapılırken bir hata oluştu");
      }
   };

   return (
      <header className="sticky top-0 z-[51] w-full flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-2 sm:px-3">
         <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="lg:hidden relative w-10 h-10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
               <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                     <motion.div
                        key="close"
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 180 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                     >
                        <X className="h-5 w-5" />
                     </motion.div>
                  ) : (
                     <motion.div
                        key="menu"
                        initial={{ scale: 0, opacity: 0, rotate: 180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: -180 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                     >
                        <Menu className="h-5 w-5" />
                     </motion.div>
                  )}
               </AnimatePresence>
               <span className="sr-only">Menüyü {mobileMenuOpen ? "Kapat" : "Aç"}</span>
            </Button>

            <Link href="/admin" className="flex items-center gap-2">
               <BookOpen className="h-6 w-6 text-primary" />
               <span className="font-semibold text-lg">Yazar Admin</span>
            </Link>
         </div>

         <div className="flex-1 flex items-center justify-end">
            <div className="flex items-center gap-1">
               {/* Bildirim Dropdown */}
               <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {pendingCount > 0 && (
                           <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                              {pendingCount}
                           </span>
                        )}
                        <span className="sr-only">Bildirimler ({pendingCount})</span>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 z-[52]">
                     {" "}
                     {/* Genişlik artırıldı */}
                     <DropdownMenuLabel className="flex justify-between items-center">
                        <span>Bekleyen Yorumlar</span>
                        {pendingCount > 0 && <span className="text-xs text-muted-foreground">({pendingCount})</span>}
                     </DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     {latestPendingComments.length === 0 ? (
                        <DropdownMenuItem disabled className="text-center text-muted-foreground py-4">
                           Yeni bildirim yok
                        </DropdownMenuItem>
                     ) : (
                        <>
                           {latestPendingComments.map((comment) => (
                              <DropdownMenuItem key={comment._id} className="flex flex-col items-start gap-1 cursor-pointer" onClick={() => router.push("/admin/comments")}>
                                 <div className="flex items-center gap-2 w-full">
                                    <MessageSquareWarning className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                    <div className="flex-grow">
                                       <p className="text-xs font-medium truncate">
                                          <span className="font-semibold">{comment.name || "Anonim"}</span> yorum yaptı:
                                       </p>
                                       <p className="text-xs text-muted-foreground truncate">"{comment.comment}"</p>
                                    </div>
                                    {/* Tarih formatlama date-fns ile geri eklendi */}
                                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: tr })}</span>
                                 </div>
                                 <p className="text-xs text-muted-foreground pl-6">Kitap: {comment.bookId?.title || "Bilinmiyor"}</p>
                              </DropdownMenuItem>
                           ))}
                           <DropdownMenuSeparator />
                           <DropdownMenuItem className="justify-center text-sm text-primary hover:text-primary cursor-pointer" onClick={() => router.push("/admin/comments")}>
                              Tümünü Gör
                           </DropdownMenuItem>
                        </>
                     )}
                  </DropdownMenuContent>
               </DropdownMenu>

               <Separator orientation="vertical" className="h-8" />
               {/* Profil Dropdown */}
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" size="icon">
                        <User className="h-5 w-5" />
                        <span className="sr-only">Profil Menüsü</span>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-[52]">
                     <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{user?.username}</span>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Çıkış Yap</span>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
      </header>
   );
}
