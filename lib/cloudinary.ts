import { CloudinaryUploadResponse } from "@/types/types";

// Cloudinary bilgileri için ortam değişkenlerini kontrol et ve varsayılan değerler sağla
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "default_cloud_name";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset";

// Cloudinary Upload URL'sini doğru şekilde oluştur
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Cloudinary'ye resim yükler
 * @param file Yüklenecek dosya
 * @param folder Dosyanın yükleneceği klasör (varsayılan: "author_profile")
 * @returns Cloudinary yanıtı
 */
export async function uploadImageToCloudinary(file: File, folder: string = "author_profile"): Promise<CloudinaryUploadResponse> {
   if (!file) throw new Error("Yüklenecek dosya bulunamadı");

   // Cloudinary bilgilerini kontrol et
   if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === "default_cloud_name") {
      throw new Error("Cloudinary Cloud Name belirtilmemiş. Lütfen .env dosyasını kontrol edin.");
   }

   if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET === "default_preset") {
      throw new Error("Cloudinary Upload Preset belirtilmemiş. Lütfen .env dosyasını kontrol edin.");
   }

   const formData = new FormData();
   formData.append("file", file);
   formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
   formData.append("folder", folder);

   try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
         method: "POST",
         body: formData,
      });

      if (!response.ok) {
         const errorData = await response.json();
         console.error("Cloudinary API hatası:", errorData);
         throw new Error(errorData.error?.message || "Resim yükleme hatası");
      }

      const result = await response.json();
      return result;
   } catch (error) {
      console.error("Cloudinary yükleme hatası:", error);
      throw new Error("Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
   }
}

/**
 * File nesnesini base64 formatına çevirir
 * @param file Dosya
 * @returns Base64 formatında string
 */
export async function fileToBase64(file: File): Promise<string> {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
   });
}

/**
 * Cloudinary'ye birden fazla resim yükler
 * @param files Yüklenecek dosyalar
 * @param folder Dosyaların yükleneceği klasör
 * @returns Cloudinary yanıtlarının dizisi
 */
export async function uploadMultipleImages(files: File[], folder: string = "author_profile"): Promise<CloudinaryUploadResponse[]> {
   if (!files || files.length === 0) return [];

   try {
      const uploadPromises = files.map((file) => uploadImageToCloudinary(file, folder));
      return await Promise.all(uploadPromises);
   } catch (error) {
      console.error("Çoklu resim yükleme hatası:", error);
      throw new Error("Resimler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
   }
}

/**
 * Profil resmi yükleme işlevi
 * @param file Profil resmi
 * @returns Cloudinary yanıtı
 */
export async function uploadProfileImage(file: File): Promise<CloudinaryUploadResponse> {
   return uploadImageToCloudinary(file, "author/profile");
}

/**
 * Favicon yükleme işlevi
 * @param file Favicon dosyası
 * @returns Cloudinary yanıtı
 */
export async function uploadFavicon(file: File): Promise<CloudinaryUploadResponse> {
   return uploadImageToCloudinary(file, "author/favicon");
}

/**
 * Biyografi görseli yükleme işlevi
 * @param file Biyografi görseli
 * @returns Cloudinary yanıtı
 */
export async function uploadBioImage(file: File): Promise<CloudinaryUploadResponse> {
   return uploadImageToCloudinary(file, "author/bio");
}

/**
 * Kitap kapak görselini Cloudinary'e yükler
 * @param file Kapak görseli dosyası
 * @returns Cloudinary yanıtı
 */
export async function uploadBookCover(file: File): Promise<CloudinaryUploadResponse> {
   return uploadImageToCloudinary(file, "books/covers");
}

/**
 * Kitap ek görselini Cloudinary'e yükler
 * @param file Ek görsel dosyası
 * @returns Cloudinary yanıtı
 */
export async function uploadBookImage(file: File): Promise<CloudinaryUploadResponse> {
   return uploadImageToCloudinary(file, "books/images");
}
