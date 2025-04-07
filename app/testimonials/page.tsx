"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Quote, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CommentForm } from "@/components/CommentForm";
import { useBooksContext } from "@/context/BooksContext";
import { commentApi } from "@/services/api/commentApi";
import { Comment } from "@/types/types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Tarih formatlama fonksiyonu
const formatDate = (dateString: string | undefined) => {
   if (!dateString) return "";
   const date = new Date(dateString);
   return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long", // Ay adını uzun formatta göster
      year: "numeric",
   });
};

// Yüklenme durumu için iskelet (skeleton) bileşeni
const CommentSkeleton = () => (
   <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               {/* Avatar kaldırıldı */}
               <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
               </div>
            </div>
            <div className="flex items-center gap-1">
               <Skeleton className="h-4 w-4" />
               <Skeleton className="h-4 w-4" />
               <Skeleton className="h-4 w-4" />
               <Skeleton className="h-4 w-4" />
               <Skeleton className="h-4 w-4" />
            </div>
         </div>
      </CardHeader>
      <CardContent className="flex-grow">
         <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
         </div>
         <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-20" />
         </div>
         <Skeleton className="h-4 w-full mb-1" />
         <Skeleton className="h-4 w-5/6" />
      </CardContent>
   </Card>
);

// Öne çıkan yorumlar için iskelet
const FeaturedCommentSkeleton = () => (
   <div className="flex flex-col items-center text-center">
      <div className="relative mb-4 w-full">
         <Skeleton className="h-52 w-full rounded-lg" />
      </div>
      <div className="flex flex-col items-center w-full">
         {/* Avatar kaldırıldı */}
         <div className="mt-2 w-full">
            <Skeleton className="h-4 w-24 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
         </div>
      </div>
   </div>
);

function Testimonials() {
   const { books } = useBooksContext();
   const [approvedComments, setApprovedComments] = useState<Comment[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   const fetchApprovedComments = async () => {
      setIsLoading(true);
      try {
         const response = await commentApi.getApprovedComments();
         if (response.success && response.data) {
            setApprovedComments(response.data);
         } else {
            toast.error(response.message || "Onaylanmış yorumlar yüklenirken bir hata oluştu");
         }
      } catch (error) {
         toast.error("Onaylanmış yorumlar yüklenirken bir sunucu hatası oluştu");
         console.error("Fetch approved comments error:", error);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchApprovedComments();
   }, []);

   return (
      <div className="flex min-h-screen flex-col">
         <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex-1">
            {/* Hero Section */}
            <section className="w-full py-10 mt-16">
               <div className="container px-4 md:px-6 mx-auto">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4 text-center">
                     <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Okuyucu Yorumları</h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                           Kitaplarım hakkında değerli okuyucularımın düşünceleri ve deneyimleri
                        </p>
                     </div>
                  </motion.div>
               </div>
            </section>

            {/* Tabs Section */}
            <section className="w-full py-10 bg-pattern-paper">
               <div className="container px-4 md:px-6 mx-auto">
                  <Tabs defaultValue="all" className="w-full">
                     {/* Carousel'i TabsList içine al */}
                     <div className="flex justify-center mb-8">
                        <TabsList className="p-0 bg-transparent border-none">
                           <Carousel className="max-w-[400px] w-full" opts={{ align: "center" }}>
                              <CarouselContent className="-ml-2">
                                 <CarouselItem className="basis-auto pl-2">
                                    <TabsTrigger value="all">Tüm Yorumlar</TabsTrigger>
                                 </CarouselItem>
                                 {/* Kitap sekmeleri BooksContext'ten geliyor */}
                                 {books &&
                                    books.map((book) => (
                                       <CarouselItem key={book._id} className="basis-auto pl-2">
                                          <TabsTrigger value={book._id}>{book.title}</TabsTrigger>
                                       </CarouselItem>
                                    ))}
                              </CarouselContent>
                              {/* Butonlar sadece birden fazla sekme varsa gösterilir */}
                              {books &&
                                 books.length > 3 && ( // Eşik değeri ayarlanabilir
                                    <>
                                       <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2" />
                                       <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2" />
                                    </>
                                 )}
                           </Carousel>
                        </TabsList>
                     </div>

                     {/* Tüm Yorumlar Sekmesi */}
                     <TabsContent value="all" className="space-y-8">
                        {isLoading ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {[...Array(4)].map((_, i) => (
                                 <CommentSkeleton key={`skel-all-${i}`} />
                              ))}
                           </div>
                        ) : approvedComments.length === 0 ? (
                           <p className="text-center text-muted-foreground py-10">Henüz onaylanmış yorum bulunmamaktadır.</p>
                        ) : (
                           <motion.div
                              initial="hidden"
                              animate="visible"
                              variants={{
                                 hidden: { opacity: 0 },
                                 visible: {
                                    opacity: 1,
                                    transition: {
                                       staggerChildren: 0.1,
                                    },
                                 },
                              }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-6"
                           >
                              {approvedComments.map((comment) => (
                                 <motion.div
                                    key={comment._id}
                                    variants={{
                                       hidden: { opacity: 0, y: 20 },
                                       visible: { opacity: 1, y: 0 },
                                    }}
                                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                    className="flex flex-col h-full"
                                 >
                                    <Card className="flex flex-col h-full">
                                       <CardHeader className="pb-2">
                                          <div className="flex items-center justify-between">
                                             <div className="flex items-center gap-4">
                                                {/* Avatar kaldırıldı */}
                                                <div>
                                                   <CardTitle className="text-base">{comment.name || "Anonim"}</CardTitle>
                                                   {comment.city && <CardDescription>{comment.city}</CardDescription>}
                                                </div>
                                             </div>
                                             {/* Puan Yıldızları (Yarım Yıldız Desteği) */}
                                             <div className="flex items-center gap-1">
                                                {comment.rating &&
                                                   Array.from({ length: 5 }).map((_, index) => {
                                                      const ratingValue = comment.rating ?? 0;
                                                      const isFull = index < Math.floor(ratingValue);
                                                      const isHalf = index === Math.floor(ratingValue) && ratingValue % 1 !== 0;
                                                      const isEmpty = index >= Math.ceil(ratingValue);

                                                      if (isFull) {
                                                         // Tam dolu yıldız
                                                         return <Star key={index} className="h-4 w-4 fill-primary text-primary" />;
                                                      } else if (isHalf) {
                                                         // Yarım yıldız (üst üste bindirme yöntemi)
                                                         return (
                                                            <div key={index} className="relative h-4 w-4">
                                                               {/* Alttaki boş yıldız */}
                                                               <Star className="absolute top-0 left-0 h-4 w-4 text-muted-foreground" />
                                                               {/* Üstteki dolu yıldızın sol yarısı */}
                                                               <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
                                                                  <Star className="h-4 w-4 fill-primary text-primary" />
                                                               </div>
                                                            </div>
                                                         );
                                                      } else {
                                                         // Tamamen boş yıldız
                                                         return <Star key={index} className="h-4 w-4 text-muted-foreground" />;
                                                      }
                                                      // Hatalı ');' kaldırıldı
                                                   })}
                                             </div>
                                          </div>
                                       </CardHeader>
                                       <CardContent className="flex-grow">
                                          <div className="flex items-center gap-2 mb-2 text-sm">
                                             <BookOpen className="h-4 w-4 text-muted-foreground" />
                                             <span className="font-medium">{comment.bookId?.title || "Bilinmeyen Kitap"}</span>
                                          </div>
                                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                                             <Clock className="w-3 h-3" />
                                             <span>{formatDate(comment.createdAt)}</span>
                                          </div>
                                          <blockquote className="text-sm leading-relaxed italic text-muted-foreground relative pl-4 border-l-2 border-border">{comment.comment}</blockquote>
                                       </CardContent>
                                    </Card>
                                 </motion.div>
                              ))}
                           </motion.div>
                        )}
                     </TabsContent>

                     {/* Kitaplara Özel Sekmeler */}
                     {books &&
                        books.map((book) => (
                           <TabsContent key={book._id} value={book._id} className="space-y-8">
                              {isLoading ? (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[...Array(2)].map((_, i) => (
                                       <CommentSkeleton key={`skel-${book._id}-${i}`} />
                                    ))}
                                 </div>
                              ) : (
                                 (() => {
                                    const filteredComments = approvedComments.filter((comment) => comment.bookId?._id === book._id);
                                    return filteredComments.length === 0 ? (
                                       <p className="text-center text-muted-foreground py-10">Bu kitap için henüz onaylanmış yorum bulunmamaktadır.</p>
                                    ) : (
                                       <motion.div
                                          initial="hidden"
                                          animate="visible"
                                          variants={{
                                             hidden: { opacity: 0 },
                                             visible: {
                                                opacity: 1,
                                                transition: {
                                                   staggerChildren: 0.1,
                                                },
                                             },
                                          }}
                                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                       >
                                          {filteredComments.map((comment) => (
                                             <motion.div
                                                key={comment._id}
                                                variants={{
                                                   hidden: { opacity: 0, y: 20 },
                                                   visible: { opacity: 1, y: 0 },
                                                }}
                                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                                className="flex flex-col h-full"
                                             >
                                                <Card className="flex flex-col h-full">
                                                   <CardHeader className="pb-2">
                                                      <div className="flex items-center justify-between">
                                                         <div className="flex items-center gap-4">
                                                            {/* Avatar kaldırıldı */}
                                                            <div>
                                                               <CardTitle className="text-base">{comment.name || "Anonim"}</CardTitle>
                                                               {comment.city && <CardDescription>{comment.city}</CardDescription>}
                                                            </div>
                                                         </div>
                                                         {/* Puan Yıldızları (Yarım Yıldız Desteği) */}
                                                         <div className="flex items-center gap-1">
                                                            {comment.rating &&
                                                               Array.from({ length: 5 }).map((_, index) => {
                                                                  const ratingValue = comment.rating ?? 0;
                                                                  const isFull = index < Math.floor(ratingValue);
                                                                  const isHalf = index === Math.floor(ratingValue) && ratingValue % 1 !== 0;
                                                                  const isEmpty = index >= Math.ceil(ratingValue);

                                                                  if (isFull) {
                                                                     return <Star key={index} className="h-4 w-4 fill-primary text-primary" />;
                                                                  } else if (isHalf) {
                                                                     return (
                                                                        <div key={index} className="relative h-4 w-4">
                                                                           <Star className="absolute top-0 left-0 h-4 w-4 text-muted-foreground" />
                                                                           <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
                                                                              <Star className="h-4 w-4 fill-primary text-primary" />
                                                                           </div>
                                                                        </div>
                                                                     );
                                                                  } else {
                                                                     return <Star key={index} className="h-4 w-4 text-muted-foreground" />;
                                                                  }
                                                                  // Hatalı ');' kaldırıldı (Bu blokta zaten yoktu ama kontrol amaçlı)
                                                               })}
                                                         </div>
                                                      </div>
                                                   </CardHeader>
                                                   <CardContent className="flex-grow">
                                                      {/* Kitap başlığı zaten sekme başlığında var, tekrar göstermeye gerek yok */}
                                                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                                                         <Clock className="w-3 h-3" />
                                                         <span>{formatDate(comment.createdAt)}</span>
                                                      </div>
                                                      <blockquote className="text-sm leading-relaxed italic text-muted-foreground relative pl-4 border-l-2 border-border">{comment.comment}</blockquote>
                                                   </CardContent>
                                                </Card>
                                             </motion.div>
                                          ))}
                                       </motion.div>
                                    );
                                 })() // IIFE to handle conditional rendering
                              )}
                           </TabsContent>
                        ))}
                  </Tabs>
               </div>
            </section>

            {/* Alt Dekoratif Çizgi */}
            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1 }} viewport={{ once: true }} className="w-full max-w-lg mx-auto">
               <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
            </motion.div>

            {/* Featured Testimonials */}
            <section className="w-full py-10 bg-pattern-paper">
               <div className="container px-4 md:px-6 mx-auto">
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }} // Changed animate to whileInView for scroll trigger
                     transition={{ duration: 0.5 }}
                     viewport={{ once: true }} // Ensures animation runs only once when visible
                     className="flex flex-col items-center justify-center space-y-4 text-center mb-10"
                  >
                     <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Öne Çıkan Yorumlar</h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                           Okuyucularımın kitaplarım hakkındaki en etkileyici değerlendirmeleri
                        </p>
                     </div>
                  </motion.div>

                  {isLoading ? (
                     <div className="grid gap-8 md:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                           <FeaturedCommentSkeleton key={`skel-feat-${i}`} />
                        ))}
                     </div>
                  ) : approvedComments.length === 0 ? (
                     <p className="text-center text-muted-foreground py-10">Öne çıkarılacak yorum bulunmamaktadır.</p>
                  ) : (
                     <div className="grid gap-8 md:grid-cols-3">
                        {approvedComments.slice(0, 3).map((comment) => (
                           <motion.div
                              key={comment._id}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              viewport={{ once: true }}
                              className="flex flex-col items-center text-center"
                           >
                              <div className="relative mb-4 w-full">
                                 <div className="absolute -top-2 -left-2 text-primary opacity-20">
                                    <Quote className="h-12 w-12" />
                                 </div>
                                 <div className="relative z-10 rounded-lg bg-card p-6 shadow-md border h-52 flex flex-col justify-center">
                                    {/* Added line-clamp for better text fitting */}
                                    <blockquote className="text-sm leading-relaxed italic text-muted-foreground line-clamp-6">"{comment.comment}"</blockquote>
                                    {/* Puan Yıldızları (Yarım Yıldız Desteği) */}
                                    <div className="mt-4 flex items-center justify-center gap-1">
                                       {comment.rating &&
                                          Array.from({ length: 5 }).map((_, index) => {
                                             const ratingValue = comment.rating ?? 0;
                                             const isFull = index < Math.floor(ratingValue);
                                             const isHalf = index === Math.floor(ratingValue) && ratingValue % 1 !== 0;
                                             const isEmpty = index >= Math.ceil(ratingValue);

                                             if (isFull) {
                                                return <Star key={index} className="h-4 w-4 fill-primary text-primary" />;
                                             } else if (isHalf) {
                                                return (
                                                   <div key={index} className="relative h-4 w-4">
                                                      <Star className="absolute top-0 left-0 h-4 w-4 text-muted-foreground" />
                                                      <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
                                                         <Star className="h-4 w-4 fill-primary text-primary" />
                                                      </div>
                                                   </div>
                                                );
                                             } else {
                                                return <Star key={index} className="h-4 w-4 text-muted-foreground" />;
                                             }
                                             // Hatalı ');' kaldırıldı
                                          })}
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-col items-center">
                                 {/* Avatar kaldırıldı */}
                                 <div className="mt-2">
                                    <p className="font-medium">{comment.name || "Anonim"}</p>
                                    {comment.city && <p className="text-xs text-muted-foreground">{comment.city}</p>}
                                 </div>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  )}
               </div>
            </section>

            {/* Alt Dekoratif Çizgi */}
            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1 }} viewport={{ once: true }} className="w-full max-w-lg mx-auto">
               <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
            </motion.div>

            {/* Add Testimonial */}
            <section className="w-full py-10 bg-pattern-paper">
               <div className="container px-4 md:px-6 mx-auto">
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5 }}
                     viewport={{ once: true }}
                     className="flex flex-col items-center justify-center space-y-4 text-center mb-10"
                  >
                     <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Yorum Ekle</h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Kitaplarım hakkındaki düşüncelerinizi paylaşın</p>
                     </div>
                  </motion.div>

                  {/* Yeni Yorum Formu (Card içine alındı) */}
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="mx-auto max-w-2xl">
                     <Card>
                        <CardHeader>
                           <CardTitle>Yeni Yorum</CardTitle>
                           <CardDescription>Okuduğunuz kitap hakkındaki düşüncelerinizi paylaşın</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <CommentForm showBookSelector={true} />
                        </CardContent>
                     </Card>
                  </motion.div>
               </div>
            </section>

            {/* Newsletter */}
            <section className="w-full py-10 bg-primary text-primary-foreground">
               <div className="container px-4 md:px-6 mx-auto">
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5 }}
                     viewport={{ once: true }}
                     className="flex flex-col items-center justify-center space-y-4 text-center"
                  >
                     <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Bültenime Abone Olun</h2>
                        <p className="mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                           Yeni kitaplarım, etkinliklerim ve özel içeriklerim hakkında haberdar olmak için bültenime abone olun.
                        </p>
                     </div>
                     <div className="mx-auto w-full max-w-sm space-y-2">
                        <form className="flex flex-col gap-2 sm:flex-row">
                           <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="E-posta adresiniz"
                              type="email"
                           />
                           <Button type="submit" variant="secondary">
                              Abone Ol
                           </Button>
                        </form>
                        <p className="text-xs">Kişisel verileriniz gizlilik politikamıza uygun olarak korunacaktır.</p>
                     </div>
                  </motion.div>
               </div>
            </section>
         </motion.main>
      </div>
   );
}

export default Testimonials;
