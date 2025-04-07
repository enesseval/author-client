"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import {
   Award,
   Book,
   Bookmark,
   BookMarked,
   BookOpen,
   BookText,
   Edit,
   Eye,
   Feather,
   FileText,
   GraduationCap,
   HelpCircle,
   Library,
   Medal,
   PenTool,
   Plus,
   ScrollText,
   Star,
   Trash2,
   Trophy,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { profileFormSchema } from "@/types/types";
import { getProfileData, saveProfileData } from "@/services/api/authorApi";
import { toast } from "sonner";
import { MarkdownDisplay } from "@/components/MarkdownDisplay";

const iconList = [
   { icon: Book, name: "book", label: "Kitap" },
   { icon: BookOpen, name: "bookOpen", label: "Açık Kitap" },
   { icon: BookMarked, name: "bookMarked", label: "İşaretli Kitap" },
   { icon: Library, name: "library", label: "Kütüphane" },
   { icon: PenTool, name: "penTool", label: "Kalem" },
   { icon: Feather, name: "feather", label: "Tüy Kalem" },
   { icon: Edit, name: "edit", label: "Düzenle" },
   { icon: FileText, name: "fileText", label: "Metin" },
   { icon: ScrollText, name: "scrollText", label: "Parşömen" },
   { icon: BookText, name: "bookText", label: "Kitap ve Metin" },
   { icon: GraduationCap, name: "graduationCap", label: "Mezuniyet" },
   { icon: Award, name: "award", label: "Ödül" },
   { icon: Trophy, name: "trophy", label: "Kupa" },
   { icon: Medal, name: "medal", label: "Madalya" },
   { icon: Star, name: "star", label: "Yıldız" },
   { icon: Bookmark, name: "bookmark", label: "Yer İmi" },
];

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function Profile() {
   const [activeTab, setActiveTab] = useState("general");
   const [formErrors, setFormErrors] = useState<Record<string, boolean>>({
      general: false,
      badges: false,
      about: false,
   });
   const [isMarkdownPreview, setIsMarkdownPreview] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isSaving, setIsSaving] = useState(false);

   // Varsayılan değerler
   const defaultValues: Partial<ProfileFormValues> = {
      authorName: "",
      title: "",
      titleIcon: "",
      shortBio: "",
      pageTitle: "Yazar Sayfası",
      favicon: null,
      showBadges: false,
      badges: [],
      longBio: "",
      useBioImage: false,
      bioImage: null,
      useBioParagraphs: false,
      bioParagraphs: [],
   };

   const form = useForm<ProfileFormValues>({
      resolver: zodResolver(profileFormSchema),
      defaultValues,
      mode: "onChange",
   });

   // Form değerlerini izleyelim - Hakkımda sekmesi için yeni izlemeler ekleyelim
   const showBadges = form.watch("showBadges");
   const badges = form.watch("badges") || [];
   const useBioImage = form.watch("useBioImage");
   const useBioParagraphs = form.watch("useBioParagraphs");
   const bioParagraphs = form.watch("bioParagraphs") || [];

   // Rozet ekle fonksiyonu
   const addBadge = () => {
      const currentBadges = form.getValues("badges") || [];
      form.setValue("badges", [...currentBadges, { icon: "award", text: "Yeni Rozet" }]);
   };

   // Rozet sil fonksiyonu
   const removeBadge = (index: number) => {
      const currentBadges = form.getValues("badges") || [];
      form.setValue(
         "badges",
         currentBadges.filter((_, i) => i !== index)
      );
   };

   // Rozet ikon güncelleme fonksiyonu
   const updateBadgeIcon = (index: number, iconName: string) => {
      const currentBadges = form.getValues("badges") || [];
      const updatedBadges = [...currentBadges];
      updatedBadges[index] = { ...updatedBadges[index], icon: iconName };
      form.setValue("badges", updatedBadges);
   };

   // Paragraf ekle fonksiyonu
   const addParagraph = () => {
      const currentParagraphs = form.getValues("bioParagraphs") || [];
      form.setValue("bioParagraphs", [...currentParagraphs, { title: "Yeni Başlık", content: "Paragraf içeriği..." }]);
   };

   // Paragraf sil fonksiyonu
   const removeParagraph = (index: number) => {
      const currentParagraphs = form.getValues("bioParagraphs") || [];
      form.setValue(
         "bioParagraphs",
         currentParagraphs.filter((_, i) => i !== index)
      );
   };

   // Sayfa yüklendiğinde verileri getir
   useEffect(() => {
      async function loadProfileData() {
         setIsLoading(true);
         try {
            const profileData = await getProfileData();

            // Form değerlerini güncelle
            form.reset({
               authorName: profileData.authorName,
               title: profileData.title,
               titleIcon: profileData.titleIcon,
               shortBio: profileData.shortBio,
               profileImage: profileData.profileImageUrl || null,
               pageTitle: profileData.pageTitle,
               favicon: profileData.faviconUrl || null,
               showBadges: profileData.showBadges,
               badges: profileData.badges || [],
               longBio: profileData.longBio,
               useBioImage: profileData.useBioImage,
               bioImage: profileData.bioImageUrl || null,
               useBioParagraphs: profileData.useBioParagraphs,
               bioParagraphs: profileData.bioParagraphs || [],
            });
         } catch (error) {
            console.error("Profil verileri yüklenirken hata:", error);
            toast.error("Profil verileri yüklenemedi", {
               description: "Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.",
            });
         } finally {
            setIsLoading(false);
         }
      }

      loadProfileData();
   }, [form]);

   // Form gönderme fonksiyonu
   const onSubmit = async (data: ProfileFormValues) => {
      setIsSaving(true);
      try {
         const response = await saveProfileData(data);

         if (response.success) {
            toast.success("Profil bilgileriniz başarıyla kaydedildi.", {
               description: "Değişiklikler anasayfada görüntülenecektir.",
            });

            // URL yerine dosya nesnesi olarak saklanan dosyaları temizle
            form.reset({
               ...data,
               profileImage: data.profileImage instanceof File ? response.data?.profileImageUrl : data.profileImage,
               favicon: data.favicon instanceof File ? response.data?.faviconUrl : data.favicon,
               bioImage: data.bioImage instanceof File ? response.data?.bioImageUrl : data.bioImage,
            });
         } else {
            throw new Error(response.error || "Bir hata oluştu");
         }
      } catch (error: any) {
         console.error("Profil kaydetme hatası:", error);
         toast.error("Profil bilgileriniz kaydedilemedi.", {
            description: error.message || "Lütfen tekrar deneyin.",
         });
      } finally {
         setIsSaving(false);
      }
   };

   // Form hata durumuna göre tab durumlarını güncelleme
   React.useEffect(() => {
      const formState = form.formState;
      const errors = formState.errors;

      const hasGeneralErrors = !!(errors.authorName || errors.title || errors.titleIcon || errors.shortBio || errors.profileImage || errors.pageTitle || errors.favicon);
      const hasBadgesErrors = !!(errors.badges || errors.showBadges);
      const hasAboutErrors = !!errors.longBio;

      // Önceki state değerleriyle karşılaştırma yaparak gereksiz güncellemeleri önle
      setFormErrors((prev) => {
         if (prev.general === hasGeneralErrors && prev.badges === hasBadgesErrors && prev.about === hasAboutErrors) {
            return prev; // Değişiklik yoksa mevcut state'i koru
         }

         return {
            general: hasGeneralErrors,
            badges: hasBadgesErrors,
            about: hasAboutErrors,
         };
      });
   }, [form.formState.errors]); // Sadece errors değiştiğinde çalış

   return (
      <div className="container mx-auto py-6 bg-pattern">
         <div className="flex items-center justify-between mb-6">
            <div>
               <h1 className="text-3xl font-bold tracking-tight">Profil Ayarları</h1>
               <p className="text-muted-foreground">Anasayfada görünen profil bilgilerinizi düzenleyebilirsiniz.</p>
            </div>
         </div>

         {isLoading ? (
            <div className="flex justify-center items-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
         ) : (
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Tabs defaultValue="general" className="space-y-6" onValueChange={setActiveTab} value={activeTab}>
                     <TabsList>
                        <TabsTrigger value="general" className={cn(formErrors.general && "text-red-500 border-red-500")}>
                           Genel Bilgiler
                        </TabsTrigger>
                        <TabsTrigger value="badges" className={cn(formErrors.badges && "text-red-500 border-red-500")}>
                           Rozetler
                        </TabsTrigger>
                        <TabsTrigger value="about" className={cn(formErrors.about && "text-red-500 border-red-500")}>
                           Hakkımda
                        </TabsTrigger>
                     </TabsList>

                     <TabsContent value="general" className="space-y-6">
                        <Card>
                           <CardHeader>
                              <CardTitle>Sayfa Bilgileri</CardTitle>
                              <CardDescription>Sitenizin tarayıcı başlığı ve favicon simgesini güncelleyebilirsiniz.</CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <div className="grid gap-4">
                                 <FormField
                                    control={form.control}
                                    name="pageTitle"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel htmlFor="pageTitle">Sayfa Başlığı</FormLabel>
                                          <FormControl>
                                             <Input id="pageTitle" placeholder="Tarayıcıda görünecek başlık" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                          <p className="text-xs text-muted-foreground">Bu başlık tarayıcı sekmesinde ve arama sonuçlarında görünecektir.</p>
                                       </FormItem>
                                    )}
                                 />

                                 <FormField
                                    control={form.control}
                                    name="favicon"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel htmlFor="favicon">Favicon</FormLabel>
                                          <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 border rounded flex items-center justify-center bg-muted">
                                                {form.watch("favicon") ? (
                                                   form.watch("favicon") instanceof File ? (
                                                      <Image src={URL.createObjectURL(form.watch("favicon") as File)} alt="Favicon" width={32} height={32} className="object-contain" />
                                                   ) : (
                                                      <Image src={form.watch("favicon") as string} alt="Favicon" width={32} height={32} className="object-contain" />
                                                   )
                                                ) : (
                                                   <div className="text-xs text-muted-foreground">Icon</div>
                                                )}
                                             </div>
                                             <FormControl>
                                                <Input id="favicon" type="file" accept=".ico,.png,.svg" className="max-w-xs" onChange={(e) => field.onChange(e.target.files?.[0])} />
                                             </FormControl>
                                          </div>
                                          <FormMessage />
                                          <p className="text-xs text-muted-foreground mt-2">Önerilen format: 32x32 piksel PNG, ICO veya SVG dosyası.</p>
                                       </FormItem>
                                    )}
                                 />
                              </div>
                           </CardContent>
                        </Card>
                        <Card>
                           <CardHeader>
                              <CardTitle>Profil Resmi</CardTitle>
                              <CardDescription>Anasayfada görünen profil resminizi düzenleyebilirsiniz.</CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <div className="flex items-center gap-6">
                                 <div className="relative w-40 h-40 overflow-hidden border rounded-md flex items-center justify-center bg-muted">
                                    {form.watch("profileImage") ? (
                                       form.watch("profileImage") instanceof File ? (
                                          <Image src={URL.createObjectURL(form.watch("profileImage") as File)} alt="Profil resmi" fill className="object-cover" />
                                       ) : (
                                          <Image src={form.watch("profileImage") as string} alt="Profil resmi" fill className="object-cover" />
                                       )
                                    ) : (
                                       <span className="text-muted-foreground">Resim Yok</span>
                                    )}
                                 </div>
                                 <div>
                                    <FormField
                                       control={form.control}
                                       name="profileImage"
                                       render={({ field }) => (
                                          <FormItem>
                                             <FormLabel htmlFor="profileImage">Yeni Resim Yükle</FormLabel>
                                             <FormControl>
                                                <Input id="profileImage" type="file" accept="image/*" className="max-w-xs" onChange={(e) => field.onChange(e.target.files?.[0])} />
                                             </FormControl>
                                             <FormMessage />
                                             <p className="text-xs text-muted-foreground mt-2">Önerilen boyut: 500x500 piksel, maksimum dosya boyutu: 5MB</p>
                                          </FormItem>
                                       )}
                                    />
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                        <Card>
                           <CardHeader>
                              <CardTitle>Temel Bilgiler</CardTitle>
                              <CardDescription>Anasayfada görünen temel bilgilerinizi düzenleyebilirsiniz.</CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <div className="grid gap-4">
                                 <FormField
                                    control={form.control}
                                    name="authorName"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel htmlFor="authorName">Yazar Adı</FormLabel>
                                          <FormControl>
                                             <Input id="authorName" placeholder="Adınız ve soyadınız" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel htmlFor="title">Başlık</FormLabel>
                                          <FormControl>
                                             <Input id="title" placeholder="Örn: Yazar & Şair" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 <FormField
                                    control={form.control}
                                    name="titleIcon"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Başlık İkonu</FormLabel>
                                          <FormControl>
                                             <Popover>
                                                <PopoverTrigger asChild>
                                                   <Button variant="outline" className="w-full justify-start gap-2">
                                                      {field.value ? (
                                                         <>
                                                            {React.createElement(iconList.find((i) => i.name === field.value)?.icon || Book, { className: "h-4 w-4 mr-2" })}
                                                            {iconList.find((i) => i.name === field.value)?.label || "İkon Seç"}
                                                         </>
                                                      ) : (
                                                         "İkon Seç"
                                                      )}
                                                   </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                   <div className="grid grid-cols-4 gap-2 p-2">
                                                      {iconList.map((item) => (
                                                         <Button
                                                            key={item.name}
                                                            variant="ghost"
                                                            className={`flex flex-col items-center justify-center p-2 h-auto aspect-square ${
                                                               field.value === item.name ? "bg-primary/10 text-primary" : ""
                                                            }`}
                                                            onClick={() => field.onChange(item.name)}
                                                            type="button"
                                                         >
                                                            {React.createElement(item.icon, { className: "h-6 w-6 mb-1" })}
                                                            <span className="text-xs text-center">{item.label}</span>
                                                         </Button>
                                                      ))}
                                                   </div>
                                                </PopoverContent>
                                             </Popover>
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 <FormField
                                    control={form.control}
                                    name="shortBio"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel htmlFor="shortBio">Kısa Açıklama</FormLabel>
                                          <FormControl>
                                             <Textarea id="shortBio" placeholder="Kısa bir açıklama yazın" rows={3} {...field} />
                                          </FormControl>
                                          <FormMessage />
                                          <p className="text-xs text-muted-foreground">Bu açıklama anasayfada isminizin altında görünecektir. En fazla 200 karakter olmalıdır.</p>
                                       </FormItem>
                                    )}
                                 />
                              </div>
                           </CardContent>
                        </Card>
                     </TabsContent>

                     <TabsContent value="badges" className="space-y-6">
                        <Card>
                           <CardHeader>
                              <CardTitle>Rozetler</CardTitle>
                              <CardDescription>
                                 <div className="flex justify-between">
                                    Anasayfada görünen rozetleri düzenleyebilirsiniz.
                                    <TooltipProvider>
                                       <Tooltip>
                                          <TooltipTrigger asChild>
                                             <div className="cursor-help">
                                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                             </div>
                                          </TooltipTrigger>
                                          <TooltipContent className="max-w-sm">
                                             <p>Rozetler, anasayfada yazar adının altında gösterilir. Her rozet bir ikon ve metin içerir.</p>
                                          </TooltipContent>
                                       </Tooltip>
                                    </TooltipProvider>
                                 </div>
                              </CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <FormField
                                 control={form.control}
                                 name="showBadges"
                                 render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                       <FormControl>
                                          <Checkbox id="showBadges" checked={field.value} onCheckedChange={field.onChange} />
                                       </FormControl>
                                       <FormLabel htmlFor="showBadges" className="!mt-0">
                                          Rozetleri göster
                                       </FormLabel>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              {showBadges && (
                                 <div className="space-y-4 mt-4">
                                    <div className="grid gap-4">
                                       {badges.map((badge, index) => {
                                          const currentIcon = badge.icon || "award";
                                          const IconComponent = iconList.find((i) => i.name === currentIcon)?.icon || Award;
                                          return (
                                             <div key={index} className="space-y-1">
                                                <div className="flex items-center gap-2 mb-0">
                                                   <div className="w-[60px] relative">
                                                      <Popover>
                                                         <PopoverTrigger asChild>
                                                            <div className="flex items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-muted">
                                                               <IconComponent className="h-4 w-4" />
                                                            </div>
                                                         </PopoverTrigger>
                                                         <PopoverContent className="w-[220px] p-2">
                                                            <div className="grid grid-cols-4 gap-2">
                                                               {iconList.map((item) => (
                                                                  <div
                                                                     key={item.name}
                                                                     className={`flex items-center justify-center p-2 rounded-md cursor-pointer hover:bg-muted ${
                                                                        currentIcon === item.name ? "bg-primary/10 text-primary" : ""
                                                                     }`}
                                                                     onClick={() => updateBadgeIcon(index, item.name)}
                                                                  >
                                                                     <item.icon className="h-4 w-4" />
                                                                  </div>
                                                               ))}
                                                            </div>
                                                         </PopoverContent>
                                                      </Popover>
                                                   </div>
                                                   <div className="flex-1">
                                                      <FormField
                                                         control={form.control}
                                                         name={`badges.${index}.text`}
                                                         render={({ field }) => (
                                                            <FormItem className="mb-0">
                                                               <FormControl>
                                                                  <Input placeholder="Rozet metni" {...field} />
                                                               </FormControl>
                                                            </FormItem>
                                                         )}
                                                      />
                                                   </div>
                                                   <Button type="button" variant="outline" size="icon" onClick={() => removeBadge(index)}>
                                                      <Trash2 className="h-4 w-4" />
                                                   </Button>
                                                </div>
                                                <FormField
                                                   control={form.control}
                                                   name={`badges.${index}.text`}
                                                   render={() => (
                                                      <div className="pl-[72px]">
                                                         <FormMessage />
                                                      </div>
                                                   )}
                                                />
                                             </div>
                                          );
                                       })}
                                    </div>
                                    <Button type="button" variant="outline" onClick={addBadge} className="mt-2 h-[34px]">
                                       <Plus className="h-4 w-4 mr-2" />
                                       Rozet Ekle
                                    </Button>
                                    <FormField control={form.control} name="badges" render={() => <FormMessage />} />
                                 </div>
                              )}
                           </CardContent>
                        </Card>
                     </TabsContent>

                     <TabsContent value="about" className="space-y-6">
                        <Card>
                           <CardHeader>
                              <CardTitle>Hakkımda</CardTitle>
                              <CardDescription>
                                 <div className="flex justify-between">
                                    Anasayfada görünen detaylı biyografinizi düzenleyin.
                                    <Popover>
                                       <PopoverTrigger asChild>
                                          <div className="cursor-help">
                                             <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                          </div>
                                       </PopoverTrigger>
                                       <PopoverContent className="w-80">
                                          <div className="space-y-2">
                                             <h4 className="font-medium">Markdown İpuçları</h4>
                                             <ul className="text-sm space-y-1 text-muted-foreground">
                                                <li>
                                                   <code className="bg-muted px-1 rounded"># Başlık 1</code> - En büyük başlık
                                                </li>
                                                <li>
                                                   <code className="bg-muted px-1 rounded">## Başlık 2</code> - Orta başlık
                                                </li>
                                                <li>
                                                   <code className="bg-muted px-1 rounded">### Başlık 3</code> - Küçük başlık
                                                </li>
                                                <li>
                                                   <code className="bg-muted px-1 rounded">**Kalın**</code> - <strong>Kalın</strong> metin
                                                </li>
                                                <li>
                                                   <code className="bg-muted px-1 rounded">*İtalik*</code> - <em>İtalik</em> metin
                                                </li>
                                                <li>
                                                   <code className="bg-muted px-1 rounded">- Liste öğesi</code> - Madde işaretli liste
                                                </li>
                                                <li>
                                                   <code className="bg-muted px-1 rounded">[Link](https://ornek.com)</code> - Link
                                                </li>
                                             </ul>
                                             <p className="text-xs text-muted-foreground mt-2">
                                                <strong>Önemli:</strong> Başlıklar için # işaretinden sonra mutlaka bir boşluk bırakın. Örneğin: <code className="bg-muted px-1 rounded"># Başlık</code>{" "}
                                                şeklinde yazın,
                                                <code className="bg-muted px-1 rounded">#Başlık</code> şeklinde değil.
                                             </p>
                                          </div>
                                       </PopoverContent>
                                    </Popover>
                                 </div>
                              </CardDescription>
                           </CardHeader>
                           <CardContent>
                              <div className="grid gap-6">
                                 <div className="flex justify-end items-center gap-3">
                                    <span className="text-sm font-medium">{isMarkdownPreview ? "Önizleme Modu" : "Düzenleme Modu"}</span>
                                    <div className="flex items-center space-x-2">
                                       <Switch id="markdown-preview" checked={isMarkdownPreview} onCheckedChange={setIsMarkdownPreview} />
                                       <label htmlFor="markdown-preview" className="text-sm cursor-pointer">
                                          {isMarkdownPreview ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                                       </label>
                                    </div>
                                 </div>

                                 {/* Ana metin alanı - Her zaman görünür */}
                                 <FormField
                                    control={form.control}
                                    name="longBio"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel htmlFor="longBio">Hakkımda Metni {isMarkdownPreview ? "(Önizleme)" : "(Markdown Destekli)"}</FormLabel>
                                          <FormControl>
                                             {isMarkdownPreview ? (
                                                <div className="prose prose-stone dark:prose-invert max-w-none border rounded-md p-4 min-h-[250px] bg-card overflow-auto">
                                                   {field.value ? (
                                                      <MarkdownDisplay className="max-w-none">{field.value}</MarkdownDisplay>
                                                   ) : (
                                                      <p className="text-muted-foreground">Önizlenecek içerik yok</p>
                                                   )}
                                                </div>
                                             ) : (
                                                <Textarea
                                                   id="longBio"
                                                   placeholder="# Hakkımda

Ben [Adınız], [mesleğiniz/uzmanlık alanınız] alanında çalışan bir yazarım.

## Eğitim Hayatım

[Eğitim bilgileriniz]

## Yazarlık Serüvenim

[Yazarlık hikayeniz]

### Eserlerim

- [Eser 1]
- [Eser 2]
- [Eser 3]

**Not:** Markdown formatını kullanarak metninizi düzenleyebilirsiniz."
                                                   rows={15}
                                                   className="font-mono"
                                                   {...field}
                                                />
                                             )}
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 {/* Görsel Ekleme Seçeneği */}
                                 <FormField
                                    control={form.control}
                                    name="useBioImage"
                                    render={({ field }) => (
                                       <FormItem className="flex items-center space-x-2">
                                          <FormControl>
                                             <Checkbox id="useBioImage" checked={field.value} onCheckedChange={field.onChange} />
                                          </FormControl>
                                          <FormLabel htmlFor="useBioImage" className="!mt-0">
                                             Görsel Ekle
                                          </FormLabel>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 {useBioImage && (
                                    <div className="pl-6 border-l-2 border-muted">
                                       <FormField
                                          control={form.control}
                                          name="bioImage"
                                          render={({ field }) => (
                                             <FormItem>
                                                <FormLabel>Görsel</FormLabel>
                                                <FormControl>
                                                   <div className="flex flex-col space-y-4">
                                                      <div className="flex items-center gap-6">
                                                         <div className="relative w-40 h-40 overflow-hidden border rounded-md">
                                                            {field.value ? (
                                                               <Image
                                                                  src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                                                                  alt="Hakkımda görseli"
                                                                  fill
                                                                  className="object-cover"
                                                               />
                                                            ) : (
                                                               <span className="text-muted-foreground">Resim Yok</span>
                                                            )}
                                                         </div>
                                                         <div>
                                                            <Input id="bioImage" type="file" accept="image/*" className="max-w-xs" onChange={(e) => field.onChange(e.target.files?.[0])} />
                                                            <p className="text-xs text-muted-foreground mt-2">Bu görsel hakkımda bölümünde kullanılacaktır.</p>
                                                         </div>
                                                      </div>
                                                   </div>
                                                </FormControl>
                                                <FormMessage />
                                             </FormItem>
                                          )}
                                       />
                                    </div>
                                 )}

                                 {/* Yapılandırılmış Paragraflar Seçeneği */}
                                 <FormField
                                    control={form.control}
                                    name="useBioParagraphs"
                                    render={({ field }) => (
                                       <FormItem className="flex items-center space-x-2">
                                          <FormControl>
                                             <Checkbox id="useBioParagraphs" checked={field.value} onCheckedChange={field.onChange} />
                                          </FormControl>
                                          <FormLabel htmlFor="useBioParagraphs" className="!mt-0">
                                             Yapılandırılmış Paragraflar Ekle
                                          </FormLabel>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 {useBioParagraphs && (
                                    <div className="pl-6 border-l-2 border-muted space-y-4">
                                       <div className="flex justify-between items-center">
                                          <h3 className="text-lg font-medium">İçerik Paragrafları</h3>
                                          <Button type="button" variant="outline" size="sm" onClick={addParagraph} className="flex items-center gap-1">
                                             <Plus className="h-4 w-4" /> Paragraf Ekle
                                          </Button>
                                       </div>

                                       {bioParagraphs.length === 0 ? (
                                          <div className="text-center p-8 border border-dashed rounded-lg">
                                             <p className="text-muted-foreground">Henüz paragraf eklenmemiş. "Paragraf Ekle" butonuna tıklayarak içerik ekleyebilirsiniz.</p>
                                          </div>
                                       ) : (
                                          <div className="space-y-6">
                                             {bioParagraphs.map((paragraph, index) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                   <div className="flex justify-between items-start mb-4">
                                                      <h4 className="text-lg font-medium">Paragraf {index + 1}</h4>
                                                      <Button
                                                         type="button"
                                                         variant="ghost"
                                                         size="icon"
                                                         onClick={() => removeParagraph(index)}
                                                         className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                      >
                                                         <Trash2 className="h-4 w-4" />
                                                      </Button>
                                                   </div>

                                                   <div className="space-y-4">
                                                      <FormField
                                                         control={form.control}
                                                         name={`bioParagraphs.${index}.title`}
                                                         render={({ field }) => (
                                                            <FormItem>
                                                               <FormLabel>Başlık</FormLabel>
                                                               <FormControl>
                                                                  <Input {...field} placeholder="Paragraf başlığı" />
                                                               </FormControl>
                                                               <FormMessage />
                                                            </FormItem>
                                                         )}
                                                      />

                                                      <FormField
                                                         control={form.control}
                                                         name={`bioParagraphs.${index}.content`}
                                                         render={({ field }) => (
                                                            <FormItem>
                                                               <FormLabel>İçerik</FormLabel>
                                                               <FormControl>
                                                                  <Textarea {...field} placeholder="Paragraf içeriği" rows={5} />
                                                               </FormControl>
                                                               <FormMessage />
                                                            </FormItem>
                                                         )}
                                                      />
                                                   </div>
                                                </div>
                                             ))}
                                          </div>
                                       )}
                                    </div>
                                 )}

                                 <div className="bg-muted/30 p-4 rounded-md">
                                    <h3 className="text-sm font-medium mb-2">Bilgi</h3>
                                    <p className="text-xs text-muted-foreground">
                                       Markdown metin içeriğiniz her zaman gösterilecektir. Ayrıca isterseniz görsel ve yapılandırılmış paragraflar da ekleyebilirsiniz. Bu içerikler anasayfada
                                       sırasıyla gösterilir.
                                    </p>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     </TabsContent>
                  </Tabs>

                  <div className="flex justify-end mt-6">
                     <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                           <>
                              <span className="animate-spin mr-2">○</span>
                              Kaydediliyor...
                           </>
                        ) : (
                           "Tüm Değişiklikleri Kaydet"
                        )}
                     </Button>
                  </div>
               </form>
            </Form>
         )}
      </div>
   );
}

export default Profile;
