"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useBooksContext } from "@/context/BooksContext";
import { ArrowLeft, MoveLeft, Plus, Save, Trash, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { BookDataToSave, bookFormSchema, BookFormValues } from "@/types/types";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { bookApi } from "@/services/api/bookApi";

// Ödül ve satın alma linki tipleri
interface Award {
   id: string;
   name: string;
   year?: string;
}

interface BuyLink {
   id: string;
   name: string;
   url: string;
}

// Görsel tipi
interface BookImage {
   id: string;
   file: File;
   url: string;
   name: string;
}

function AddBook() {
   const [activeTab, setActiveTab] = useState("general");
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [formErrors, setFormErrors] = useState<Record<string, boolean>>({
      general: false,
      details: false,
      media: false,
      seo: false,
   });
   const { categories } = useBooksContext();

   // Form tanımlaması
   const form = useForm<BookFormValues>({
      resolver: zodResolver(bookFormSchema),
      defaultValues: {
         title: "",
         category: "",
         year: "",
         description: "",
         longDescription: "",
         pages: "",
         publisher: "",
         isbn: "",
         status: "draft",
         seoTitle: "",
         seoDescription: "",
         seoKeywords: "",
         awards: [],
         buyLinks: [],
         additionalImages: [],
      },
   });

   // Görseller için state'ler
   const [coverImage, setCoverImage] = useState<BookImage | null>(null);
   const [additionalImages, setAdditionalImages] = useState<BookImage[]>([]);

   // Input refs
   const coverInputRef = useRef<HTMLInputElement>(null);
   const additionalImageInputRef = useRef<HTMLInputElement>(null);

   // Field arrays için tanımlamalar
   const {
      fields: awardFields,
      append: appendAward,
      remove: removeAward,
   } = useFieldArray({
      control: form.control,
      name: "awards",
   });

   const {
      fields: linkFields,
      append: appendLink,
      remove: removeLink,
   } = useFieldArray({
      control: form.control,
      name: "buyLinks",
   });

   // Form hatalarını izle ve tab durumlarını güncelle
   React.useEffect(() => {
      // Form submit edilmediyse hataları gösterme
      if (!isSubmitted) return;

      const formState = form.formState;
      const errors = formState.errors;

      // Her tab için hata kontrolü
      const hasGeneralErrors = !!(errors.title || errors.category || errors.year || errors.description || errors.longDescription || errors.pages || errors.status);

      const hasDetailsErrors = !!(errors.publisher || errors.isbn || errors.awards || errors.buyLinks);

      const hasMediaErrors = !coverImage; // Kapak görseli zorunlu

      const hasSeoErrors = !!(errors.seoTitle || errors.seoDescription || errors.seoKeywords);

      setFormErrors({
         general: hasGeneralErrors,
         details: hasDetailsErrors,
         media: hasMediaErrors,
         seo: hasSeoErrors,
      });
   }, [form.formState.errors, coverImage, isSubmitted]);

   const onSubmit = async (data: BookFormValues) => {
      setIsSubmitted(true);

      // Kapak görseli kontrolü
      if (!coverImage) {
         setFormErrors((prev) => ({
            ...prev,
            media: true,
         }));
         toast.error("Lütfen bir kapak görseli yükleyin");
         return;
      }

      try {
         // API'ye gönder
         const response = await bookApi.createBook(data, coverImage, additionalImages);

         if (response.success) {
            toast.success("Kitap başarıyla kaydedildi");
            // İsteğe bağlı: Başarılı kayıttan sonra liste sayfasına yönlendirme
            // router.push("/admin/books/list");
         } else {
            throw new Error(response.error || "Bir hata oluştu");
         }
      } catch (error: any) {
         console.error("Kitap kaydetme hatası:", error);
         toast.error("Kitap kaydedilemedi", {
            description: error.message || "Lütfen tekrar deneyin",
         });
      }
   };

   return (
      <div className="container mx-auto py-6 bg-pattern">
         <div className="flex items-center justify-between mb-6">
            <div>
               <h1 className="text-3xl font-bold tracking-tight">Kitaplar</h1>
               <p className="text-muted-foreground">Tüm kitaplarınızı yönetin, düzenleyin ve yenilerini ekleyin.</p>
            </div>
            <div className="space-x-2">
               <Button variant="outline">
                  <Link href="/admin/books/list" className="flex items-center">
                     <MoveLeft className="mr-2 h-4 w-4" />
                     Geri Dön
                  </Link>
               </Button>
               <Button onClick={form.handleSubmit(onSubmit)} className="cursor-pointer">
                  <Save className="mr-2 h-4 w-4" />
                  Kaydet
               </Button>
            </div>
         </div>

         <div className="space-y-6">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                     <TabsList>
                        <TabsTrigger value="general" className={cn(isSubmitted && formErrors.general && "text-red-500 border-red-500")}>
                           Genel Bilgiler
                        </TabsTrigger>
                        <TabsTrigger value="details" className={cn(isSubmitted && formErrors.details && "text-red-500 border-red-500")}>
                           Detaylar
                        </TabsTrigger>
                        <TabsTrigger value="media" className={cn(isSubmitted && formErrors.media && "text-red-500 border-red-500")}>
                           Medya
                        </TabsTrigger>
                        <TabsTrigger value="seo" className={cn(isSubmitted && formErrors.seo && "text-red-500 border-red-500")}>
                           SEO
                        </TabsTrigger>
                     </TabsList>

                     <TabsContent value="general" className="space-y-4">
                        <Card>
                           <CardHeader>
                              <CardTitle>Kitap Bilgileri</CardTitle>
                              <CardDescription>Kitabınızın temel bilgilerini girin</CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                 <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Kitap Adı</FormLabel>
                                          <FormControl>
                                             <Input placeholder="Kitap adını girin" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                                 <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Kategori</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                             <FormControl>
                                                <SelectTrigger>
                                                   <SelectValue placeholder="Kategori seçin" />
                                                </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                                {categories.map((category) => (
                                                   <SelectItem key={category.id} value={category.id}>
                                                      {category.name}
                                                   </SelectItem>
                                                ))}
                                             </SelectContent>
                                          </Select>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </div>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                 <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Yayın Yılı</FormLabel>
                                          <FormControl>
                                             <Input placeholder="Örn: 2023" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                                 <FormField
                                    control={form.control}
                                    name="pages"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Sayfa Sayısı</FormLabel>
                                          <FormControl>
                                             <Input type="number" placeholder="Örn: 320" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                                 <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Durum</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                             <FormControl>
                                                <SelectTrigger>
                                                   <SelectValue placeholder="Durum seçin" />
                                                </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                                <SelectItem value="draft">Taslak</SelectItem>
                                                <SelectItem value="published">Yayında</SelectItem>
                                                <SelectItem value="upcoming">Yakında</SelectItem>
                                             </SelectContent>
                                          </Select>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </div>
                              <FormField
                                 control={form.control}
                                 name="description"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Kısa Açıklama</FormLabel>
                                       <FormControl>
                                          <Textarea placeholder="Kitabın kısa açıklamasını girin" {...field} rows={3} maxLength={150} />
                                       </FormControl>
                                       <FormDescription>Bu açıklama kitap listelerinde ve kartlarda görünecektir. 150 karakteri geçmemelidir.</FormDescription>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                              <FormField
                                 control={form.control}
                                 name="longDescription"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Detaylı Açıklama</FormLabel>
                                       <FormControl>
                                          <Textarea placeholder="Kitabın detaylı açıklamasını girin" {...field} rows={6} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                           </CardContent>
                        </Card>
                     </TabsContent>

                     <TabsContent value="details" className="space-y-4">
                        <Card>
                           <CardHeader>
                              <CardTitle>Yayın Detayları</CardTitle>
                              <CardDescription>Kitabınızın yayın ve teknik detaylarını girin</CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                 <FormField
                                    control={form.control}
                                    name="publisher"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Yayınevi</FormLabel>
                                          <FormControl>
                                             <Input placeholder="Yayınevi adını girin" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                                 <FormField
                                    control={form.control}
                                    name="isbn"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>ISBN</FormLabel>
                                          <FormControl>
                                             <Input placeholder="Örn: 978-605-123-456-7" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </div>

                              <Separator />

                              {/* Ödüller Bölümü */}
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                                    <Label>Ödüller</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={() => appendAward({ name: "", year: "" })}>
                                       <Plus className="mr-2 h-3 w-3" />
                                       Ödül Ekle
                                    </Button>
                                 </div>

                                 <div className="rounded-md border p-4">
                                    {awardFields.length === 0 ? (
                                       <p className="text-sm text-muted-foreground text-center py-8">Henüz ödül eklenmedi. Kitabınızın aldığı ödülleri eklemek için "Ödül Ekle" butonuna tıklayın.</p>
                                    ) : (
                                       <div className="space-y-2">
                                          {awardFields.map((field, index) => (
                                             <div key={field.id} className="flex items-start gap-4 rounded-md border p-3">
                                                <div className="flex-1 space-y-2">
                                                   <FormField
                                                      control={form.control}
                                                      name={`awards.${index}.name`}
                                                      render={({ field }) => (
                                                         <FormItem>
                                                            <FormControl>
                                                               <Input placeholder="Ödül adı" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                         </FormItem>
                                                      )}
                                                   />
                                                   <FormField
                                                      control={form.control}
                                                      name={`awards.${index}.year`}
                                                      render={({ field }) => (
                                                         <FormItem>
                                                            <FormControl>
                                                               <Input placeholder="Ödül yılı (Opsiyonel)" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                         </FormItem>
                                                      )}
                                                   />
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeAward(index)}>
                                                   <Trash className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                             </div>
                                          ))}
                                       </div>
                                    )}
                                 </div>
                              </div>

                              <Separator />

                              {/* Satın Alma Linkleri Bölümü */}
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                                    <Label>Satın Alma Linkleri</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={() => appendLink({ name: "", url: "" })}>
                                       <Plus className="mr-2 h-3 w-3" />
                                       Link Ekle
                                    </Button>
                                 </div>

                                 <div className="rounded-md border p-4">
                                    {linkFields.length === 0 ? (
                                       <p className="text-sm text-muted-foreground text-center py-8">Henüz satın alma linki eklenmedi. Eklemek için "Link Ekle" butonuna tıklayın.</p>
                                    ) : (
                                       <div className="space-y-2">
                                          {linkFields.map((field, index) => (
                                             <div key={field.id} className="flex items-start gap-4 rounded-md border p-3">
                                                <div className="flex-1 space-y-2">
                                                   <FormField
                                                      control={form.control}
                                                      name={`buyLinks.${index}.name`}
                                                      render={({ field }) => (
                                                         <FormItem>
                                                            <FormControl>
                                                               <Input placeholder="Site adı" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                         </FormItem>
                                                      )}
                                                   />
                                                   <FormField
                                                      control={form.control}
                                                      name={`buyLinks.${index}.url`}
                                                      render={({ field }) => (
                                                         <FormItem>
                                                            <FormControl>
                                                               <Input placeholder="https://..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                         </FormItem>
                                                      )}
                                                   />
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(index)}>
                                                   <Trash className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                             </div>
                                          ))}
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     </TabsContent>

                     <TabsContent value="media" className="space-y-4">
                        <Card>
                           <CardHeader>
                              <CardTitle>Kitap Kapağı ve Görseller</CardTitle>
                              <CardDescription>Kitabınızın kapak görselini ve diğer görselleri yükleyin</CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-6">
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                                    <Label>Kapak Görseli</Label>
                                    {coverImage && (
                                       <Button type="button" variant="outline" size="sm" onClick={() => setCoverImage(null)} className="text-destructive">
                                          <Trash className="mr-2 h-3 w-3" />
                                          Görseli Sil
                                       </Button>
                                    )}
                                 </div>

                                 {!coverImage ? (
                                    <div
                                       className="flex items-center justify-center border-2 border-dashed rounded-md p-6 h-64 cursor-pointer hover:bg-muted/50 transition-colors"
                                       onClick={() => coverInputRef.current?.click()}
                                    >
                                       <div className="flex flex-col items-center gap-2 text-center">
                                          <Upload className="h-10 w-10 text-muted-foreground" />
                                          <h3 className="font-medium">Kapak görselini yükleyin</h3>
                                          <p className="text-xs text-muted-foreground max-w-xs">PNG, JPG veya JPEG formatında, 3:4 oranında, en az 600x800 piksel çözünürlükte bir görsel yükleyin</p>
                                          <Button type="button" variant="secondary" size="sm" className="mt-2">
                                             Dosya Seç
                                          </Button>
                                          <input
                                             type="file"
                                             ref={coverInputRef}
                                             className="hidden"
                                             accept="image/*"
                                             onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                   const file = e.target.files[0];
                                                   const imageUrl = URL.createObjectURL(file);
                                                   setCoverImage({
                                                      id: Date.now().toString(),
                                                      file,
                                                      url: imageUrl,
                                                      name: file.name,
                                                   });
                                                }
                                             }}
                                          />
                                       </div>
                                    </div>
                                 ) : (
                                    <div className="relative">
                                       <div className="relative h-64 w-48 mx-auto border rounded-md overflow-hidden">
                                          <Image src={coverImage.url} alt="Kapak Görseli" fill className="object-cover" />
                                       </div>
                                       <div className="mt-2 text-center">
                                          <p className="text-sm font-medium">{coverImage.name}</p>
                                          <p className="text-xs text-muted-foreground">{(coverImage.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                          <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => coverInputRef.current?.click()}>
                                             Değiştir
                                          </Button>
                                          <input
                                             type="file"
                                             ref={coverInputRef}
                                             className="hidden"
                                             accept="image/*"
                                             onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                   const file = e.target.files[0];
                                                   const imageUrl = URL.createObjectURL(file);
                                                   setCoverImage({
                                                      id: Date.now().toString(),
                                                      file,
                                                      url: imageUrl,
                                                      name: file.name,
                                                   });
                                                }
                                             }}
                                          />
                                       </div>
                                    </div>
                                 )}
                              </div>

                              <Separator />

                              {/* Ek Görseller */}
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                                    <Label>Ek Görseller</Label>
                                    <input
                                       type="file"
                                       ref={additionalImageInputRef}
                                       className="hidden"
                                       accept="image/*"
                                       onChange={(e) => {
                                          if (e.target.files && e.target.files.length > 0) {
                                             const file = e.target.files[0];
                                             const imageUrl = URL.createObjectURL(file);
                                             const newImage: BookImage = {
                                                id: Date.now().toString(),
                                                file,
                                                url: imageUrl,
                                                name: file.name,
                                             };
                                             setAdditionalImages((prev) => [...prev, newImage]);
                                          }
                                       }}
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={() => additionalImageInputRef.current?.click()}>
                                       <Plus className="mr-2 h-3 w-3" />
                                       Görsel Ekle
                                    </Button>
                                 </div>

                                 <div className="rounded-md border p-4">
                                    {additionalImages.length === 0 ? (
                                       <p className="text-sm text-muted-foreground text-center py-8">
                                          Henüz ek görsel eklenmedi. Kitabınızla ilgili ek görseller eklemek için "Görsel Ekle" butonuna tıklayın.
                                       </p>
                                    ) : (
                                       <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                          {additionalImages.map((image) => (
                                             <div key={image.id} className="relative group">
                                                <div className="relative h-32 w-full border rounded-md overflow-hidden">
                                                   <Image src={image.url} alt="Ek Görsel" fill className="object-cover" />
                                                </div>
                                                <Button
                                                   type="button"
                                                   variant="destructive"
                                                   size="icon"
                                                   className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                   onClick={() => setAdditionalImages((prev) => prev.filter((img) => img.id !== image.id))}
                                                >
                                                   <X className="h-3 w-3" />
                                                </Button>
                                                <p className="text-xs mt-1 truncate">{image.name}</p>
                                             </div>
                                          ))}
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     </TabsContent>

                     <TabsContent value="seo" className="space-y-4">
                        <Card>
                           <CardHeader>
                              <CardTitle>SEO Ayarları</CardTitle>
                              <CardDescription>Kitabınızın arama motorlarında daha iyi görünmesi için SEO ayarlarını yapın</CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <div className="space-y-2">
                                 <FormField
                                    control={form.control}
                                    name="seoTitle"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>SEO Başlığı</FormLabel>
                                          <FormControl>
                                             <Input placeholder="SEO başlığını girin" {...field} />
                                          </FormControl>
                                          <FormDescription>Boş bırakırsanız kitap adı kullanılacaktır.</FormDescription>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <FormField
                                    control={form.control}
                                    name="seoDescription"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>SEO Açıklaması</FormLabel>
                                          <FormControl>
                                             <Textarea placeholder="SEO açıklamasını girin" {...field} rows={3} />
                                          </FormControl>
                                          <FormDescription>Boş bırakırsanız kısa açıklama kullanılacaktır. 160 karakteri geçmemelidir.</FormDescription>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <FormField
                                    control={form.control}
                                    name="seoKeywords"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Anahtar Kelimeler</FormLabel>
                                          <FormControl>
                                             <Input placeholder="Anahtar kelimeleri virgülle ayırarak girin" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </div>
                           </CardContent>
                        </Card>
                     </TabsContent>
                  </Tabs>
               </form>
            </Form>
         </div>
      </div>
   );
}

export default AddBook;
