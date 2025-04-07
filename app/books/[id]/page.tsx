"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Award, BookMarked, ShoppingCart, ArrowLeft, Star, Share2, MessageSquare, ChevronRight, ExternalLink, Clock, Tag } from "lucide-react";
// Removed useBooksContext import
import { Book } from "@/types/types";
import { bookApi } from "@/services/api/bookApi"; // Import bookApi
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// Label, Input, Textarea importları kaldırıldı (CommentForm içinde var)
import { toast } from "sonner";
import { CommentForm } from "@/components/CommentForm"; // Yeni formu import et

// Book data interface
export interface BookData {
   id: string;
   title: string;
   categoryId: string;
   categoryName?: string;
   year?: string;
   description: string;
   longDescription?: string;
   pages?: number;
   publisher?: string;
   isbn?: string;
   status: "draft" | "published" | "upcoming";
   coverImageUrl: string;
   additionalImages?: string[];
   awards?: {
      name: string;
      year?: string;
   }[];
   buyLinks?: {
      name: string;
      url: string;
   }[];
   seoTitle?: string;
   seoDescription?: string;
   seoKeywords?: string;
   rating?: number;
   ratingCount?: number;
   author?: string;
   language?: string;
   releaseDate?: string;
}

// AddCommentDialog fonksiyonu kaldırıldı

export default function BookDetailPage() {
   const params = useParams();
   const bookId = params.id as string; // Get book ID from URL params
   const [book, setBook] = useState<Book | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null); // Add error state
   const [activeImageIndex, setActiveImageIndex] = useState(0);
   const [similarBooks, setSimilarBooks] = useState<BookData[]>([]);
   const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false); // Yorum dialog state'i
   // Removed useBooksContext usage for fetching the book

   useEffect(() => {
      const fetchBook = async () => {
         if (!bookId) {
            setError("Kitap ID bulunamadı.");
            setLoading(false);
            return;
         }
         setLoading(true);
         setError(null);
         try {
            const response = await bookApi.getBookById(bookId);
            if (response.success && response.data) {
               setBook(response.data);
            } else {
               setError(response.message || response.error || "Kitap yüklenirken bir hata oluştu.");
               setBook(null);
               if (response.error === "NOT_FOUND") {
                  // Optionally handle 404 specifically
                  console.warn("Book not found:", bookId);
               } else {
                  toast.error(response.message || response.error || "Kitap yüklenirken bir hata oluştu.");
               }
            }
         } catch (err: any) {
            console.error("Fetch book error:", err);
            setError("Kitap yüklenirken bir hata oluştu.");
            setBook(null);
            toast.error("Kitap yüklenirken bir hata oluştu.");
         } finally {
            setLoading(false);
         }
      };

      fetchBook();
   }, [bookId]); // Depend on bookId

   if (loading) {
      return (
         <div className="flex min-h-[50vh] items-center justify-center">
            <div className="animate-pulse text-center">
               <div className="h-8 w-64 bg-muted rounded mb-4 mx-auto"></div>
               <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
            </div>
         </div>
      );
   }

   if (error || !book) {
      // Check for error or if book is null
      return (
         <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
               <h2 className="text-2xl font-bold mb-2">{error ? "Hata" : "Kitap Bulunamadı"}</h2>
               <p className="text-muted-foreground mb-4">{error || "Aradığınız kitap mevcut değil veya kaldırılmış olabilir."}</p>
               <Button asChild>
                  <Link href="/books">Tüm Kitaplara Dön</Link>
               </Button>
            </div>
         </div>
      );
   }

   // Tüm görselleri birleştir (kapak + ek görseller)
   const allImages = [book.coverImageUrl, ...(book.additionalImages || [])];

   return (
      <div className="min-h-screen bg-pattern-paper py-10">
         {/* Hero Section - Kitap Kapağı ve Temel Bilgiler */}
         <section className="relative py-12 md:py-20 overflow-hidden max-w-10/12 mx-auto">
            <div className="container relative px-4 md:px-6">
               {/* Breadcrumb */}
               <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
                  <nav className="flex items-center text-sm text-muted-foreground">
                     <Link href="/" className="hover:text-foreground">
                        Ana Sayfa
                     </Link>
                     <ChevronRight className="mx-2 h-4 w-4" />
                     <Link href="/books" className="hover:text-foreground">
                        Kitaplar
                     </Link>
                     <ChevronRight className="mx-2 h-4 w-4" />
                     <span className="text-foreground font-medium truncate">{book.title}</span>
                  </nav>
               </motion.div>

               <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
                  {/* Sol Kolon - Kitap Görselleri */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-5 flex flex-col gap-4">
                     {/* Ana Görsel */}
                     <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-lg border border-primary/10">
                        <Image src={allImages[activeImageIndex] || "/placeholder.svg"} alt={book.title} fill className="object-cover" priority />

                        {/* Durum Rozeti */}
                        {book.status === "upcoming" && (
                           <div className="absolute top-4 right-4">
                              <Badge className="bg-amber-500 hover:bg-amber-600">Yakında</Badge>
                           </div>
                        )}

                        {/* Değerlendirme */}
                        {book.totalRatings && (
                           <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              <span className="text-white font-medium">{book.totalRatings}</span>
                           </div>
                        )}
                     </div>

                     {/* Küçük Görseller */}
                     {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                           {allImages.map((image, index) => (
                              <motion.div
                                 key={index}
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}
                                 className={`relative h-20 w-16 cursor-pointer rounded-md border overflow-hidden transition-all ${activeImageIndex === index ? "ring-2 ring-primary" : ""}`}
                                 onClick={() => setActiveImageIndex(index)}
                              >
                                 <Image src={image || "/placeholder.svg"} alt={`${book.title} - Görsel ${index + 1}`} fill className="object-cover" />
                              </motion.div>
                           ))}
                        </div>
                     )}

                     {/* Etkileşim Butonları */}
                     {/* Etkileşim Butonları */}
                     <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-1 cursor-pointer">
                           <Share2 className="h-4 w-4" />
                           <span className="hidden sm:inline">Paylaş</span>
                        </Button>
                        {/* Yorum Yap Dialog */}
                        <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
                           <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 gap-1 cursor-pointer">
                                 <MessageSquare className="h-4 w-4" />
                                 <span className="hidden sm:inline">Yorum Yap</span>
                              </Button>
                           </DialogTrigger>
                           <DialogContent className="sm:max-w-[500px] p-0">
                              {" "}
                              {/* Padding'i sıfırlayıp CommentForm'a bırakalım */}
                              {/* Dialog Başlığı ve Açıklaması (Erişilebilirlik için önemli) */}
                              <DialogHeader className="p-6 pb-4">
                                 <DialogTitle>{book.title} için Yorum Yap</DialogTitle>
                                 <DialogDescription>Bu kitap hakkındaki düşüncelerinizi ve 0.5 ile 5 arasında bir puanı aşağıdaki formu kullanarak paylaşabilirsiniz.</DialogDescription>
                              </DialogHeader>
                              {/* Formu içeriğe taşıyalım */}
                              <div className="p-6 pt-0">
                                 <CommentForm
                                    bookId={book._id}
                                    // bookTitle prop'u artık CommentForm içinde kullanılmıyor (başlık DialogTitle'da)
                                    onSubmitSuccess={() => setIsCommentDialogOpen(false)}
                                 />
                              </div>
                           </DialogContent>
                        </Dialog>
                     </div>
                  </motion.div>

                  {/* Sağ Kolon - Kitap Bilgileri */}
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="lg:col-span-7 flex flex-col gap-6">
                     <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                           <Badge variant="outline" className="bg-primary/5">
                              {book.category.name || "Kategori"}
                           </Badge>
                           {book.year && (
                              <Badge variant="outline" className="flex items-center gap-1 bg-primary/5">
                                 <Calendar className="h-3 w-3" />
                                 {book.year}
                              </Badge>
                           )}
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{book.title}</h1>

                        <div className="flex items-center gap-3 text-muted-foreground mb-6">
                           {book.year && (
                              <div className="flex items-center gap-1">
                                 <Clock className="h-4 w-4" />
                                 <span>{book.year}</span>
                              </div>
                           )}
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">{book.description}</p>

                        {/* Kitap Özellikleri */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                           {book.pages && (
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                 </div>
                                 <div>
                                    <p className="text-sm text-muted-foreground">Sayfa Sayısı</p>
                                    <p className="font-medium">{book.pages}</p>
                                 </div>
                              </div>
                           )}

                           {book.publisher && (
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <BookMarked className="h-4 w-4 text-primary" />
                                 </div>
                                 <div>
                                    <p className="text-sm text-muted-foreground">Yayınevi</p>
                                    <p className="font-medium">{book.publisher}</p>
                                 </div>
                              </div>
                           )}

                           {book.isbn && (
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Tag className="h-4 w-4 text-primary" />
                                 </div>
                                 <div>
                                    <p className="text-sm text-muted-foreground">ISBN</p>
                                    <p className="font-medium">{book.isbn}</p>
                                 </div>
                              </div>
                           )}
                        </div>

                        {/* Ödüller */}
                        {book.awards && book.awards.length > 0 && (
                           <div className="mb-6 mt-2">
                              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                 <Award className="h-5 w-5 text-amber-500" /> Ödüller
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                 {book.awards.map((award, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg px-4 py-3">
                                       <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                          <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                       </div>
                                       <div className="flex-1">
                                          <p className="font-medium">{award.name}</p>
                                          {award.year && <p className="text-sm text-muted-foreground">{award.year}</p>}
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Satın Alma Linkleri */}
                        {book.buyLinks && book.buyLinks.length > 0 && (
                           <div className="mt-8">
                              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                 <ShoppingCart className="h-5 w-5 text-primary" /> Satın Al
                              </h3>
                              <div className="space-y-3">
                                 {book.buyLinks.map((link, index) => (
                                    <Link key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                                       <Button
                                          variant="outline"
                                          size="lg"
                                          className="w-full bg-white hover:bg-primary/5 border-2 border-primary/20 shadow-sm hover:shadow text-foreground justify-between group"
                                       >
                                          <div className="flex items-center gap-2">
                                             <ShoppingCart className="h-5 w-5 text-primary" />
                                             <span className="font-medium">{link.name}'da Satın Al</span>
                                          </div>
                                          <ExternalLink className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                                       </Button>
                                    </Link>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>
                  </motion.div>
               </div>
            </div>
         </section>

         {/* Detaylı Açıklama Bölümü */}
         {book.longDescription && (
            <section className="py-12">
               <div className="container px-4 md:px-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
                     <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Kitap Hakkında
                     </h2>
                     <div className="prose prose-primary max-w-none">
                        <p className="whitespace-pre-line text-muted-foreground leading-relaxed">{book.longDescription}</p>
                     </div>
                  </motion.div>
               </div>
            </section>
         )}

         {/* Benzer Kitaplar */}
         {similarBooks.length > 0 && (
            <section className="py-12 md:py-16">
               <div className="container px-4 md:px-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                     <h2 className="text-2xl font-bold mb-8 text-center">Benzer Kitaplar</h2>

                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {similarBooks.map((similarBook, index) => (
                           <motion.div
                              key={similarBook.id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              viewport={{ once: true }}
                              whileHover={{ y: -5 }}
                           >
                              <Link href={`/kitaplar/${similarBook.id}`} className="block h-full">
                                 <div className="bg-white rounded-xl overflow-hidden shadow-md border border-primary/10 h-full flex flex-col">
                                    <div className="relative aspect-[3/4] w-full">
                                       <Image src={similarBook.coverImageUrl || "/placeholder.svg"} alt={similarBook.title} fill className="object-cover transition-transform hover:scale-105" />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                       <div className="flex items-center gap-1 mb-2">
                                          <Badge variant="outline" className="text-xs">
                                             {similarBook.categoryName}
                                          </Badge>
                                          {similarBook.rating && (
                                             <div className="ml-auto flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                <span className="text-xs">{similarBook.rating}</span>
                                             </div>
                                          )}
                                       </div>
                                       <h3 className="font-bold mb-2 line-clamp-1">{similarBook.title}</h3>
                                       <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{similarBook.description}</p>
                                       <div className="mt-auto flex items-center justify-between">
                                          <span className="text-xs text-muted-foreground">{similarBook.year}</span>
                                          <span className="text-xs text-primary font-medium">Detaylar</span>
                                       </div>
                                    </div>
                                 </div>
                              </Link>
                           </motion.div>
                        ))}
                     </div>
                  </motion.div>
               </div>
            </section>
         )}

         {/* Geri Dön Butonu */}
         <div className="container px-4 md:px-6 py-8">
            <Button variant="outline" asChild>
               <Link href="/books" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Tüm Kitaplara Dön
               </Link>
            </Button>
         </div>
      </div>
   );
}
