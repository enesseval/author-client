"use client";

import React, { useState, useEffect } from "react"; // useEffect eklendi
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, CommentFormValues } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // shadcn Select importları
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { commentApi } from "@/services/api/commentApi"; // commentApi import edildi
import { Book } from "@/types/types"; // Book tipi import edildi (varsayılan)
import { useBooksContext } from "@/context/BooksContext"; // BooksContext import edildi

interface CommentFormProps {
   bookId?: string; // Kitap detay sayfasından gelirse
   bookTitle?: string; // Kitap detay sayfasında başlık göstermek için
   onSubmitSuccess?: () => void; // Form başarıyla gönderildiğinde çağrılacak fonksiyon
   showBookSelector?: boolean; // Testimonials sayfasında kitap seçici göstermek için
   // availableBooks prop'u kaldırıldı
}

export function CommentForm({ bookId, bookTitle, onSubmitSuccess, showBookSelector = false }: CommentFormProps) {
   // availableBooks kaldırıldı
   const [isLoading, setIsLoading] = useState(false);
   const [rating, setRating] = useState(0);
   const [hoverRating, setHoverRating] = useState(0);
   // fetchedBooks ve isFetchingBooks state'leri kaldırıldı
   const { books } = useBooksContext(); // Context'ten sadece kitapları al, isLoading kaldırıldı

   const form = useForm<CommentFormValues>({
      resolver: zodResolver(commentSchema),
      defaultValues: {
         bookId: bookId,
         name: "",
         city: "",
         rating: 0,
         comment: "",
         isAnonymous: false,
      },
   });

   // Kitapları çekmek için kullanılan useEffect kaldırıldı

   const isAnonymous = form.watch("isAnonymous");

   const onSubmit = async (values: CommentFormValues) => {
      setIsLoading(true);

      // Değerlendirme puanını forma ekle
      values.rating = rating;

      // Puan kontrolü
      if (values.rating < 0.5) {
         form.setError("rating", { type: "manual", message: "Lütfen 0.5 ile 5 arasında bir puan verin." });
         setIsLoading(false);
         return;
      }

      try {
         // API çağrısı commentApi.addComment kullanılarak güncellendi
         const response = await commentApi.addComment(values);
         if (response.success) {
            toast.success("Yorumunuz başarıyla gönderildi!");
            form.reset({
               // Formu sıfırla, ancak bookId varsa koru
               bookId: bookId,
               name: "",
               city: "",
               rating: 0,
               comment: "",
               isAnonymous: false,
            });
            setRating(0); // Puanı sıfırla
            if (onSubmitSuccess) {
               onSubmitSuccess(); // Başarı callback'ini çağır
            }
         } else {
            // Backend'den gelen hata mesajını göster
            toast.error(response.message || "Yorum gönderilirken bir hata oluştu.");
         }
      } catch (error: any) {
         // Hata tipi any olarak belirtildi
         console.error("Yorum gönderme hatası:", error);
         // Yakalanan genel hatalar için mesaj
         toast.error("Yorum gönderilirken beklenmedik bir hata oluştu.");
      } finally {
         setIsLoading(false);
      }
   };

   const handleStarClick = (value: number) => {
      setRating(value);
      form.setValue("rating", value, { shouldValidate: true }); // Form değerini güncelle ve doğrula
      form.clearErrors("rating"); // Puan hatasını temizle
   };

   const handleStarHover = (value: number) => {
      setHoverRating(value);
   };

   const handleMouseLeave = () => {
      setHoverRating(0);
   };

   const renderStars = () => {
      const stars = [];
      const displayRating = hoverRating || rating;

      for (let i = 1; i <= 5; i++) {
         const fullValue = i;
         const halfValue = i - 0.5;
         const isHalfSelected = displayRating >= halfValue;
         const isFullSelected = displayRating >= fullValue;

         stars.push(
            <div
               key={i}
               className="relative cursor-pointer" // Ana container'a cursor-pointer
               onMouseLeave={handleMouseLeave}
            >
               {" "}
               {/* Mouse yıldızdan çıkınca hover'ı sıfırla */}
               {/* Görsel Yıldız (arka plan) */}
               <Star className="h-6 w-6 text-muted-foreground/30" />
               {/* Dolu Kısım (yarım veya tam) */}
               <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: isFullSelected ? "100%" : isHalfSelected ? "50%" : "0%" }}>
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
               </div>
               {/* Tıklama Alanları (Görünmez) */}
               {/* Sol Yarı (0.5 puan) */}
               <button
                  type="button"
                  className="absolute top-0 left-0 h-full w-1/2 z-10" // Sol yarıyı kapla
                  onClick={() => handleStarClick(halfValue)}
                  onMouseEnter={() => handleStarHover(halfValue)}
                  aria-label={`Puan ${halfValue}`}
               />
               {/* Sağ Yarı (1.0 puan) */}
               <button
                  type="button"
                  className="absolute top-0 right-0 h-full w-1/2 z-10" // Sağ yarıyı kapla
                  onClick={() => handleStarClick(fullValue)}
                  onMouseEnter={() => handleStarHover(fullValue)}
                  aria-label={`Puan ${fullValue}`}
               />
            </div>
         );
      }

      return (
         <div className="flex items-center">
            {stars}
            <span className="ml-3 text-sm font-medium text-muted-foreground tabular-nums w-20">{displayRating > 0 ? `${displayRating.toFixed(1)} / 5` : "Puan Verin"}</span>
         </div>
      );
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            {" "}
            {/* Card kaldırıldığı için biraz padding ekleyelim */}
            {/* Anonim Seçeneği */}
            <FormField
               control={form.control}
               name="isAnonymous"
               render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                     <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                     </FormControl>
                     <div className="space-y-1 leading-none">
                        <FormLabel>Anonim olarak yorum yap</FormLabel>
                        <FormMessage />
                     </div>
                  </FormItem>
               )}
            />
            {/* Ad ve Şehir Alanları (Anonim değilse gösterilir) */}
            <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 transition-all duration-300 ease-in-out ${isAnonymous ? "opacity-0 h-0 overflow-hidden p-0 m-0" : "opacity-100 h-auto pt-4"}`}>
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Adınız</FormLabel>
                        <FormControl>
                           <Input placeholder="Adınız" {...field} disabled={isAnonymous} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Şehir</FormLabel>
                        <FormControl>
                           <Input placeholder="Şehriniz" {...field} disabled={isAnonymous} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>
            {/* Kitap Seçici (Testimonials sayfası için) */}
            {showBookSelector && (
               <FormField
                  control={form.control}
                  name="bookId"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Kitap</FormLabel>
                        <Select
                           onValueChange={field.onChange}
                           defaultValue={field.value}
                           // disabled={isLoadingBooks} // isLoadingBooks kaldırıldığı için disabled kaldırıldı
                        >
                           <FormControl>
                              <SelectTrigger>
                                 {/* isLoadingBooks kaldırıldığı için placeholder basitleştirildi */}
                                 <SelectValue placeholder="Kitap Seçin" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {/* Context'ten gelen kitapları kullan */}
                              {/* isLoadingBooks kontrolü kaldırıldı */}
                              {books.length === 0 && (
                                 <SelectItem value="no-books" disabled>
                                    Kitap bulunamadı
                                 </SelectItem>
                              )}
                              {books.map((book) => (
                                 <SelectItem key={book._id} value={book._id}>
                                    {book.title}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            )}
            {/* Değerlendirme */}
            <FormField
               control={form.control}
               name="rating"
               render={(
                  { field } // field'ı doğrudan kullanmıyoruz ama hook form için gerekli
               ) => (
                  <FormItem>
                     <FormLabel>Değerlendirme</FormLabel>
                     <FormControl>
                        {/* renderStars artık kendi div'ini ve puan metnini içeriyor */}
                        {renderStars()}
                     </FormControl>
                     <FormMessage /> {/* Hata mesajı için yer */}
                  </FormItem>
               )}
            />
            {/* Yorum Alanı */}
            <FormField
               control={form.control}
               name="comment"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Yorumunuz</FormLabel>
                     <FormControl>
                        <Textarea placeholder="Kitap hakkındaki düşüncelerinizi paylaşın..." rows={5} {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            {/* Gönder Butonu */}
            <Button type="submit" className="w-full" disabled={isLoading}>
               <MessageSquare className="mr-2 h-4 w-4" />
               {isLoading ? "Gönderiliyor..." : "Yorum Gönder"}
            </Button>
         </form>
      </Form>
   );
}
