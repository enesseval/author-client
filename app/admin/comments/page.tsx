"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Star, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Accordion eklendi
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Card eklendi
import { commentApi } from "@/services/api/commentApi"; // commentApi import edildi
import { Comment } from "@/types/types"; // Comment tipi import edildi
import { toast } from "sonner";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge"; // Badge eklendi
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Tooltip eklendi

// Tarih formatlama fonksiyonu (basit)
const formatDate = (dateString: string) => {
   const date = new Date(dateString);
   return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
   });
};

export default function CommentsAdminPage() {
   const [pendingComments, setPendingComments] = useState<Comment[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   const fetchPendingComments = async () => {
      setIsLoading(true); // Veri çekmeye başlarken yükleniyor durumunu ayarla
      try {
         const response = await commentApi.getPendingComments();
         if (response.success && response.data) {
            setPendingComments(response.data);
         } else {
            toast.error(response.message || "Bekleyen yorumlar yüklenirken bir hata oluştu");
         }
      } catch (error) {
         toast.error("Bekleyen yorumlar yüklenirken bir sunucu hatası oluştu");
         console.error("Fetch pending comments error:", error);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchPendingComments();
   }, []);

   const handleUpdateStatus = async (commentId: string, status: "approved" | "rejected") => {
      const actionText = status === "approved" ? "onaylamak" : "reddetmek";
      const successText = status === "approved" ? "onaylandı" : "reddedildi";
      try {
         const response = await commentApi.updateCommentStatus(commentId, status);
         if (response.success) {
            toast.success(`Yorum başarıyla ${successText}`);
            // Listeyi yeniden yükle
            fetchPendingComments();
         } else {
            toast.error(response.message || `Yorum ${actionText}ken bir hata oluştu`);
         }
      } catch (error) {
         toast.error(`Yorum ${actionText}ken bir sunucu hatası oluştu`);
         console.error(`Update comment status error (${status}):`, error);
      }
   };

   return (
      <TooltipProvider>
         {" "}
         {/* Tooltip için Provider */}
         <div className="p-6 bg-pattern">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-2xl font-bold">Bekleyen Yorumlar</h1>
               {/* İleride filtreleme veya başka butonlar eklenebilir */}
            </div>

            {/* Masaüstü Görünümü (Table) */}
            <div className="border rounded-lg bg-card hidden lg:block">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="w-[150px]">Yorum Yapan</TableHead>
                        <TableHead>Kitap</TableHead>
                        <TableHead>Yorum</TableHead>
                        <TableHead className="w-[80px] text-center">Puan</TableHead>
                        <TableHead className="w-[150px]">Tarih</TableHead>
                        <TableHead className="text-right w-[120px]">İşlemler</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {isLoading ? (
                        <TableRow>
                           <TableCell colSpan={6} className="text-center py-10">
                              Yükleniyor...
                           </TableCell>
                        </TableRow>
                     ) : pendingComments.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={6} className="text-center py-10">
                              Onay bekleyen yorum bulunmamaktadır.
                           </TableCell>
                        </TableRow>
                     ) : (
                        pendingComments.map((comment) => (
                           <TableRow key={comment._id}>
                              <TableCell>
                                 <div className="font-medium">{comment.name || "Anonim"}</div>
                                 {comment.city && <div className="text-xs text-muted-foreground">{comment.city}</div>}
                                 {comment.isAnonymous && (
                                    <Badge variant="outline" className="mt-1">
                                       Anonim
                                    </Badge>
                                 )}
                              </TableCell>
                              <TableCell>{comment.bookId?.title || "Bilinmiyor"}</TableCell>
                              <TableCell>
                                 <Tooltip>
                                    <TooltipTrigger asChild>
                                       <p className="max-w-[300px] truncate cursor-default">{comment.comment}</p>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="start" className="max-w-[400px] bg-popover text-popover-foreground p-2 rounded shadow-lg border">
                                       <p className="text-sm">{comment.comment}</p>
                                    </TooltipContent>
                                 </Tooltip>
                              </TableCell>
                              <TableCell className="text-center">
                                 <div className="flex items-center justify-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span>{comment.rating.toFixed(1)}</span>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(comment.createdAt)}
                                 </div>
                              </TableCell>
                              <TableCell className="text-right">
                                 {/* Onayla Butonu */}
                                 <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                       <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700">
                                          <CheckCircle className="w-4 h-4" />
                                       </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                       <AlertDialogHeader>
                                          <AlertDialogTitle>Yorumu Onayla</AlertDialogTitle>
                                          <AlertDialogDescription>Bu yorumu onaylamak istediğinize emin misiniz? Onaylandıktan sonra sitede görünecektir.</AlertDialogDescription>
                                       </AlertDialogHeader>
                                       <AlertDialogFooter>
                                          <AlertDialogCancel>İptal</AlertDialogCancel>
                                          <AlertDialogAction className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(comment._id, "approved")}>
                                             Onayla
                                          </AlertDialogAction>
                                       </AlertDialogFooter>
                                    </AlertDialogContent>
                                 </AlertDialog>
                                 {/* Reddet Butonu */}
                                 <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                       <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                                          <XCircle className="w-4 h-4" />
                                       </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                       <AlertDialogHeader>
                                          <AlertDialogTitle>Yorumu Reddet</AlertDialogTitle>
                                          <AlertDialogDescription>Bu yorumu reddetmek istediğinize emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription>
                                       </AlertDialogHeader>
                                       <AlertDialogFooter>
                                          <AlertDialogCancel>İptal</AlertDialogCancel>
                                          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleUpdateStatus(comment._id, "rejected")}>
                                             Reddet
                                          </AlertDialogAction>
                                       </AlertDialogFooter>
                                    </AlertDialogContent>
                                 </AlertDialog>
                              </TableCell>
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </div>

            {/* Mobil Görünümü (Accordion) */}
            <div className="block lg:hidden space-y-4">
               {isLoading ? (
                  <div className="text-center py-10">Yükleniyor...</div>
               ) : pendingComments.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">Onay bekleyen yorum bulunmamaktadır.</div>
               ) : (
                  <Accordion type="single" collapsible className="w-full">
                     {pendingComments.map((comment) => (
                        <AccordionItem value={comment._id} key={comment._id} className="last:border border rounded-lg mb-3 bg-card overflow-hidden">
                           <AccordionTrigger className="px-4 py-3 hover:no-underline">
                              <div className="flex justify-between items-center w-full">
                                 <div className="flex flex-col text-left">
                                    <span className="font-medium">{comment.name || "Anonim"}</span>
                                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">{comment.bookId?.title || "Bilinmiyor"}</span>
                                 </div>
                                 <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
                                    <Clock className="w-3 h-3" />
                                    {new Date(comment.createdAt).toLocaleDateString("tr-TR")}
                                 </div>
                              </div>
                           </AccordionTrigger>
                           <AccordionContent className="px-4 pb-4 pt-0">
                              <Card className="border-none shadow-none bg-transparent">
                                 <CardContent className="p-0 space-y-3">
                                    {comment.city && (
                                       <p className="text-sm text-muted-foreground">
                                          <span className="font-medium">Şehir:</span> {comment.city}
                                       </p>
                                    )}
                                    {comment.isAnonymous && <Badge variant="outline">Anonim</Badge>}
                                    <div className="flex items-center gap-1">
                                       <span className="font-medium">Puan:</span>
                                       <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                       <span>{comment.rating.toFixed(1)}</span>
                                    </div>
                                    <div>
                                       <p className="font-medium mb-1">Yorum:</p>
                                       <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.comment}</p>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                       {/* Onayla Butonu */}
                                       <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                             <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
                                                <CheckCircle className="w-4 h-4 mr-1" /> Onayla
                                             </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                             <AlertDialogHeader>
                                                <AlertDialogTitle>Yorumu Onayla</AlertDialogTitle>
                                                <AlertDialogDescription>Bu yorumu onaylamak istediğinize emin misiniz? Onaylandıktan sonra sitede görünecektir.</AlertDialogDescription>
                                             </AlertDialogHeader>
                                             <AlertDialogFooter>
                                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                                <AlertDialogAction className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(comment._id, "approved")}>
                                                   Onayla
                                                </AlertDialogAction>
                                             </AlertDialogFooter>
                                          </AlertDialogContent>
                                       </AlertDialog>
                                       {/* Reddet Butonu */}
                                       <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                             <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
                                                <XCircle className="w-4 h-4 mr-1" /> Reddet
                                             </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                             <AlertDialogHeader>
                                                <AlertDialogTitle>Yorumu Reddet</AlertDialogTitle>
                                                <AlertDialogDescription>Bu yorumu reddetmek istediğinize emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription>
                                             </AlertDialogHeader>
                                             <AlertDialogFooter>
                                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleUpdateStatus(comment._id, "rejected")}>
                                                   Reddet
                                                </AlertDialogAction>
                                             </AlertDialogFooter>
                                          </AlertDialogContent>
                                       </AlertDialog>
                                    </div>
                                 </CardContent>
                              </Card>
                           </AccordionContent>
                        </AccordionItem>
                     ))}
                  </Accordion>
               )}
            </div>
         </div>
      </TooltipProvider>
   );
}
