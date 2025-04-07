import { ApiResponse, ProfileData, ProfileDataToSave, ProfileFormValues } from "@/types/types";
import { uploadProfileImage, uploadFavicon, uploadBioImage } from "@/lib/cloudinary";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Profil verilerini getiren fonksiyon
 * @returns Profil verileri
 */
export async function getProfileData(): Promise<ProfileData> {
   try {
      const response = await fetch(`${API_URL}/author/profile`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
         credentials: "include",
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || errorData.error || "Profil verileri getirilemedi");
      }

      const data: ApiResponse<ProfileData> = await response.json();

      if (!data.success || !data.data) {
         throw new Error(data.error || "Profil verileri getirilemedi");
      }

      return data.data;
   } catch (error) {
      console.error("Profil verileri getirme hatası:", error);
      throw error;
   }
}

/**
 * Form verilerini MongoDB'ye kaydetmeden önce Cloudinary'e resimleri yükler
 * @param formData Form verileri
 * @returns Kaydedilmeye hazır veri
 */
export async function prepareDataForSaving(formData: ProfileFormValues): Promise<ProfileDataToSave> {
   try {
      // Mevcut dosya yolları (eğer varsa)
      let profileImageUrl = "";
      let faviconUrl = "";
      let bioImageUrl = "";

      // Profil resmi yükleme
      if (formData.profileImage) {
         if (formData.profileImage instanceof File) {
            const profileImageResult = await uploadProfileImage(formData.profileImage);
            profileImageUrl = profileImageResult.secure_url;
         } else {
            // Eğer dosya değil URL ise, doğrudan kullan
            profileImageUrl = formData.profileImage;
         }
      }

      // Favicon yükleme
      if (formData.favicon) {
         if (formData.favicon instanceof File) {
            const faviconResult = await uploadFavicon(formData.favicon);
            faviconUrl = faviconResult.secure_url;
         } else {
            // Eğer dosya değil URL ise, doğrudan kullan
            faviconUrl = formData.favicon;
         }
      }

      // Biyografi görseli yükleme
      if (formData.useBioImage && formData.bioImage) {
         if (formData.bioImage instanceof File) {
            const bioImageResult = await uploadBioImage(formData.bioImage);
            bioImageUrl = bioImageResult.secure_url;
         } else {
            // Eğer dosya değil URL ise, doğrudan kullan
            bioImageUrl = formData.bioImage;
         }
      }

      // API'ye gönderilecek veriyi hazırla
      const dataToSave: ProfileDataToSave = {
         authorName: formData.authorName,
         title: formData.title,
         titleIcon: formData.titleIcon || "",
         shortBio: formData.shortBio,
         profileImageUrl,
         pageTitle: formData.pageTitle,
         faviconUrl,
         showBadges: formData.showBadges,
         badges: formData.badges || [],
         longBio: formData.longBio,
         useBioImage: formData.useBioImage,
         bioImageUrl,
         useBioParagraphs: formData.useBioParagraphs,
         bioParagraphs: formData.bioParagraphs || [],
      };

      return dataToSave;
   } catch (error) {
      console.error("Veri hazırlama hatası:", error);
      throw new Error("Veriler kaydedilmeye hazırlanırken bir hata oluştu");
   }
}

/**
 * Form verilerini resimleri Cloudinary'e yükledikten sonra API'ye gönderir
 * @param formData Form verileri
 * @returns API yanıtı
 */
export async function saveProfileData(formData: ProfileFormValues): Promise<ApiResponse<ProfileData>> {
   try {
      // Önce resimleri Cloudinary'e yükle ve veriyi hazırla
      const dataToSave = await prepareDataForSaving(formData);

      // Hazırlanan veriyi API'ye gönder
      const response = await fetch(`${API_URL}/author/profile`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         credentials: "include",
         body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || errorData.error || "Profil kaydedilemedi");
      }

      return await response.json();
   } catch (error) {
      console.error("Profil kaydetme hatası:", error);
      throw error;
   }
}

/**
 * Form verilerini API formatına dönüştürür
 * @param data API'den gelen veriler
 * @returns Form için hazır veriler
 */
export function convertApiDataToFormData(data: ProfileData): ProfileFormValues {
   return {
      authorName: data.authorName,
      title: data.title,
      titleIcon: data.titleIcon,
      shortBio: data.shortBio,
      profileImage: data.profileImageUrl, // String URL
      pageTitle: data.pageTitle,
      favicon: data.faviconUrl, // String URL
      showBadges: data.showBadges,
      badges: data.badges,
      longBio: data.longBio,
      useBioImage: data.useBioImage,
      bioImage: data.bioImageUrl, // String URL
      useBioParagraphs: data.useBioParagraphs,
      bioParagraphs: data.bioParagraphs,
   };
}
