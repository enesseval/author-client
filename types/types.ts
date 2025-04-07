import * as z from "zod";

export const profileFormSchema = z.object({
   // Genel bilgiler
   authorName: z.string().min(2, "Yazar adı en az 2 karakter olmalıdır"),
   title: z.string().min(2, "Başlık en az 2 karakter olmalıdır"),
   titleIcon: z.string().optional(),
   shortBio: z.string().max(200, "Kısa açıklama en fazla 200 karakter olmalıdır"),
   profileImage: z.any().optional(),

   // Sayfa Bilgileri
   pageTitle: z.string().min(2, "Sayfa başlığı en az 2 karakter olmalıdır"),
   favicon: z.any().optional(),

   // Rozetler
   showBadges: z.boolean().default(false),
   badges: z
      .array(
         z.object({
            icon: z.string(),
            text: z.string().min(2, "Rozet metni en az 2 karakter olmalıdır"),
         })
      )
      .optional(),

   // Hakkımda
   longBio: z.string().min(10, "Hakkımda metni en az 10 karakter olmalıdır"),

   // Hakkımda için ek özellikler
   useBioImage: z.boolean().default(false),
   bioImage: z.any().optional(),

   // Paragraflar için
   useBioParagraphs: z.boolean().default(false),
   bioParagraphs: z
      .array(
         z.object({
            title: z.string().min(2, "Başlık en az 2 karakter olmalıdır"),
            content: z.string().min(10, "İçerik en az 10 karakter olmalıdır"),
         })
      )
      .optional(),
});

export const editUserSchema = z
   .object({
      username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır").trim(),
      oldPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır").optional().or(z.literal("")),
      newPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır").optional().or(z.literal("")),
      confirmPassword: z.string().optional().or(z.literal("")),
      role: z.enum(["SUPER_ADMIN", "ADMIN"], {
         required_error: "Lütfen bir rol seçin",
      }),
   })
   .refine(
      (data) => {
         // Eğer yeni şifre varsa, eski şifre zorunlu
         if (data.newPassword && !data.oldPassword) {
            return false;
         }
         return true;
      },
      {
         message: "Şifre değişikliği için mevcut şifrenizi girmelisiniz",
         path: ["oldPassword"],
      }
   )
   .refine(
      (data) => {
         // Yeni şifre ve tekrarı eşleşmeli
         if (data.newPassword && data.newPassword !== data.confirmPassword) {
            return false;
         }
         return true;
      },
      {
         message: "Yeni şifreler eşleşmiyor",
         path: ["confirmPassword"],
      }
   );

// Form değerleri tipi
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// API'den gelen profil verileri tipi
export interface ProfileData {
   id: string;
   authorName: string;
   title: string;
   titleIcon: string;
   shortBio: string;
   profileImageUrl: string;
   pageTitle: string;
   faviconUrl: string;
   showBadges: boolean;
   badges: {
      icon: string;
      text: string;
   }[];
   longBio: string;
   useBioImage: boolean;
   bioImageUrl: string;
   useBioParagraphs: boolean;
   bioParagraphs: {
      title: string;
      content: string;
   }[];
   updatedAt: string;
}

// Form verilerinden API için veri dönüşüm tipi
export interface ProfileDataToSave {
   authorName: string;
   title: string;
   titleIcon: string;
   shortBio: string;
   profileImageUrl: string;
   pageTitle: string;
   faviconUrl: string;
   showBadges: boolean;
   badges: {
      icon: string;
      text: string;
   }[];
   longBio: string;
   useBioImage: boolean;
   bioImageUrl: string;
   useBioParagraphs: boolean;
   bioParagraphs: {
      title: string;
      content: string;
   }[];
}

// Dosya tipleri için
export interface FileWithPreview extends File {
   preview: string;
}

// Cloudinary yanıt tipi
export interface CloudinaryUploadResponse {
   secure_url: string;
   public_id: string;
   format: string;
   width: number;
   height: number;
}

// API yanıt tipi
export interface ApiResponse<T> {
   success: boolean;
   data?: T;
   error?: string;
}

export const categoryFormSchema = z.object({
   name: z.string().min(2, "Kategori adı en az 2 karakter olmalıdır"),
   description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// Kitap formu için Zod şeması
export const bookFormSchema = z.object({
   // Genel bilgiler
   title: z.string().min(2, "Kitap adı en az 2 karakter olmalıdır"),
   category: z.string().min(1, "Kategori seçilmelidir"),
   year: z.string().optional(),
   description: z.string().max(150, "Kısa açıklama en fazla 150 karakter olmalıdır"),
   longDescription: z.string().optional(),
   pages: z.string().optional(),
   publisher: z.string().optional(),
   isbn: z.string().optional(),
   status: z.enum(["draft", "published", "upcoming"], {
      required_error: "Durum seçilmelidir",
   }),

   // Medya
   coverImage: z.any().optional(), // File tipini temsil ediyor
   additionalImages: z.array(z.any()).optional(), // File[] tipini temsil ediyor

   // Ödüller
   awards: z
      .array(
         z.object({
            name: z.string().min(2, "Ödül adı en az 2 karakter olmalıdır"),
            year: z.string().optional(),
         })
      )
      .optional(),

   // Satın Alma Linkleri
   buyLinks: z
      .array(
         z.object({
            name: z.string().min(2, "Site adı en az 2 karakter olmalıdır"),
            url: z.string().url("Geçerli bir URL giriniz"),
         })
      )
      .optional(),

   // SEO alanları
   seoTitle: z.string().optional(),
   seoDescription: z.string().max(160, "SEO açıklaması en fazla 160 karakter olmalıdır").optional(),
   seoKeywords: z.string().optional(),
});

// Kitap form değerleri tipi
export type BookFormValues = z.infer<typeof bookFormSchema>;

// Ödül tipi
export interface Award {
   id: string;
   name: string;
   year?: string;
}

// Satın alma linki tipi
export interface BuyLink {
   id: string;
   name: string;
   url: string;
}

// Kitap görseli tipi
export interface BookImage {
   id: string;
   file: File;
   url: string;
   name: string;
}

// API'ye gönderilecek kitap verisi tipi
export interface BookDataToSave {
   title: string;
   categoryId: string;
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
   ratings?: {
      userId: string;
      rating: number;
      createdAt: Date;
   }[];
   averageRating: number;
   totalRatings: number;
}

// Bildirim tipi (Backend'deki INotification ile uyumlu olmalı)
export interface NotificationPayload {
   _id: string;
   user: string;
   type: string;
   message: string;
   link?: string;
   isRead: boolean;
   createdAt: string;
}

// API'den gelen yorum verisi tipi
export interface Comment {
   _id: string;
   bookId: {
      // Yorumları listelerken kitap bilgisi gerekebilir
      _id: string;
      title: string;
   };
   name?: string;
   city?: string;
   rating: number;
   comment: string;
   isAnonymous: boolean;
   status: "pending" | "approved" | "rejected";
   createdAt: string; // Genellikle string olarak gelir
   updatedAt: string; // Genellikle string olarak gelir
}

// Yorum formu için Zod şeması
export const commentSchema = z
   .object({
      bookId: z.string().optional(), // Kitap detay sayfasından gelirse
      name: z.string().optional(),
      city: z.string().optional(),
      rating: z.number().min(0).max(5, "Puan en fazla 5 olmalı"),
      comment: z.string().min(10, "Yorum en az 10 karakter olmalıdır").max(500, "Yorum en fazla 500 karakter olmalıdır"),
      isAnonymous: z.boolean().default(false),
   })
   .refine(
      (data) => {
         // Anonim değilse isim ve şehir zorunlu
         if (!data.isAnonymous && (!data.name || data.name.trim().length < 2)) {
            return false;
         }
         return true;
      },
      {
         message: "Anonim değilseniz adınızı girmelisiniz (en az 2 karakter)",
         path: ["name"],
      }
   )
   .refine(
      (data) => {
         // Anonim değilse isim ve şehir zorunlu
         if (!data.isAnonymous && (!data.city || data.city.trim().length < 2)) {
            return false;
         }
         return true;
      },
      {
         message: "Anonim değilseniz şehrinizi girmelisiniz (en az 2 karakter)",
         path: ["city"],
      }
   );

// Yorum formu değerleri tipi
export type CommentFormValues = z.infer<typeof commentSchema>;

// API'den gelen kitap verisi tipi
export interface Book {
   _id: string;
   title: string;
   category: {
      id: string;
      name: string;
   };
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
      id: string;
      name: string;
      year?: string;
   }[];
   buyLinks?: {
      id: string;
      name: string;
      url: string;
   }[];
   seoTitle?: string;
   seoDescription?: string;
   seoKeywords?: string;
   createdAt: string;
   updatedAt: string;
   ratings?: {
      userId: string;
      rating: number;
      createdAt: string;
   }[];
   averageRating: number;
   totalRatings: number;
}
