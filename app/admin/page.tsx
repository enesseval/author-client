"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { commentApi } from "@/services/api/commentApi"; // commentApi objesini import et
import { Comment } from "@/types/types"; // Varsayılan yorum tipi
import Loading from "@/components/Loading"; // Varsayılan yükleme bileşeni
import { ApiResponse, bookApi } from "@/services/api/bookApi"; // ApiResponse tipini import et

function Dashboard() {
   const [comments, setComments] = useState<Comment[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [bookPiece, setBookPiece] = useState<Number | null>(null);
   const [commentPiece, setCommentPiece] = useState<Number | null>(null);

   useEffect(() => {
      const loadBookPiece = async () => {
         try {
            const response: ApiResponse<Number> = await bookApi.getBookPiece();
            if (response.success && response.data) {
               setBookPiece(response.data);
            }
         } catch (err) {
            console.error("Kitap sayısı alınırken hata:", err);
         }
      };
      loadBookPiece();
   }, []);

   useEffect(() => {
      const loadCommentPiece = async () => {
         try {
            const response: ApiResponse = await commentApi.getApprovedCommentsPiece();
            if (response.success && response) {
               setCommentPiece(response.data);
            }
         } catch (err) {
            console.error("Yorum sayısı alınırken hata:", err);
         }
      };
      loadCommentPiece();
   }, []);

   useEffect(() => {
      const loadComments = async () => {
         try {
            setLoading(true);
            // Onaylanmış tüm yorumları çek
            const response: ApiResponse<Comment[]> = await commentApi.getApprovedComments();

            if (response.success && response.data) {
               // Yorumları tarihe göre tersten sırala (en yeni önce)
               const sortedComments = response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
               // Son 10 yorumu al
               setComments(sortedComments.slice(0, 10));
               setError(null);
            } else {
               throw new Error(response.error || "Yorumlar alınamadı.");
            }
         } catch (err: any) {
            console.error("Yorumlar yüklenirken hata:", err);
            setError("Yorumlar yüklenemedi.");
            setComments([]); // Hata durumunda yorumları temizle
         } finally {
            setLoading(false);
         }
      };

      loadComments();
   }, []);

   return (
      <div className="flex-1 p-6 bg-pattern">
         <div className="flex flex-col gap-4">
            <div className="container mx-auto p-4 space-y-6">
               <h1 className="text-3xl font-bold mb-6">Yönetim Paneli</h1>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* İstatistik Kartları (Yer Tutucu) */}
                  <Card>
                     <CardHeader>
                        <CardTitle>Toplam Kitap Sayısı</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-2xl font-bold">{bookPiece !== null ? bookPiece.toString() : "Yükleniyor..."}</p>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardHeader>
                        <CardTitle>Toplam Yorum Sayısı</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-2xl font-bold">{commentPiece !== null ? commentPiece.toString() : "Yükleniyor"}</p> {/* Buraya dinamik veri gelecek */}
                     </CardContent>
                  </Card>
               </div>

               <Card>
                  <CardHeader>
                     <CardTitle>Son Yorumlar</CardTitle>
                  </CardHeader>
                  <CardContent>
                     {loading ? (
                        <Loading />
                     ) : error ? (
                        <p className="text-red-500">{error}</p>
                     ) : comments.length === 0 ? (
                        <p>Henüz yorum bulunmuyor.</p>
                     ) : (
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead>Kullanıcı</TableHead>
                                 <TableHead>Yorum</TableHead>
                                 <TableHead>Kitap</TableHead>
                                 <TableHead>Tarih</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {comments.map((comment) => (
                                 <TableRow key={comment._id}>
                                    <TableCell>{comment.isAnonymous ? "Anonim" : comment.name || "Bilinmiyor"}</TableCell>
                                    <TableCell className="max-w-xs truncate">{comment.comment}</TableCell>
                                    <TableCell>{comment.bookId?.title || "Bilinmiyor"}</TableCell>
                                    <TableCell>{new Date(comment.createdAt).toLocaleDateString()}</TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     )}
                  </CardContent>
               </Card>

               {/* Diğer Bileşenler / İstatistikler İçin Alan */}
               {/* Örneğin: Son Etkinlikler, Popüler Kitaplar vb. */}
            </div>
         </div>
      </div>
   );
}

export default Dashboard;
