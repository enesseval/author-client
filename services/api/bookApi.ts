import axiosInstance from "@/lib/axiosInstance";
import { Book, BookDataToSave, BookFormValues } from "@/types/types";
import { uploadBookCover, uploadBookImage } from "@/lib/cloudinary";

// API Response Types
export interface ApiResponse<T = any> {
   success: boolean;
   error?: string;
   message?: string;
   data?: T;
}

// Book Category Types
export interface BookCategory {
   id: string;
   name: string;
   description?: string;
   createdAt: string;
   updatedAt: string;
}

export interface CreateCategoryData {
   name: string;
   description?: string;
}

export interface UpdateCategoryData {
   id: string;
   name: string;
   description?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Form verilerini MongoDB'ye kaydetmeden önce Cloudinary'e resimleri yükler
 * @param formData Form verileri
 * @param coverImage Kapak görseli
 * @param additionalImages Ek görseller
 * @returns Kaydedilmeye hazır veri
 */
export async function prepareBookDataForSaving(formData: BookFormValues, coverImage: { file: File } | null, additionalImages: { file: File }[]): Promise<BookDataToSave> {
   try {
      // Kapak görseli yükleme
      let coverImageUrl = "";
      if (coverImage?.file) {
         const coverImageResult = await uploadBookCover(coverImage.file);
         coverImageUrl = coverImageResult.secure_url;
      }

      // Ek görselleri yükleme
      const additionalImageUrls: string[] = [];
      for (const image of additionalImages) {
         if (image.file) {
            const imageResult = await uploadBookImage(image.file);
            additionalImageUrls.push(imageResult.secure_url);
         }
      }

      // API'ye gönderilecek veriyi hazırla
      const dataToSave: BookDataToSave = {
         ...formData,
         categoryId: formData.category,
         pages: formData.pages ? parseInt(formData.pages) : undefined,
         coverImageUrl,
         additionalImages: additionalImageUrls,
         averageRating: 0,
         totalRatings: 0,
      };

      return dataToSave;
   } catch (error) {
      console.error("Veri hazırlama hatası:", error);
      throw new Error("Veriler kaydedilmeye hazırlanırken bir hata oluştu");
   }
}

/**
 * Kitap oluşturma
 * @param formData Form verileri
 * @param coverImage Kapak görseli
 * @param additionalImages Ek görseller
 * @returns API yanıtı
 */
export async function createBook(formData: BookFormValues, coverImage: { file: File } | null, additionalImages: { file: File }[]): Promise<ApiResponse<any>> {
   try {
      // Önce resimleri Cloudinary'e yükle ve veriyi hazırla
      const dataToSave = await prepareBookDataForSaving(formData, coverImage, additionalImages);

      // Hazırlanan veriyi API'ye gönder
      const response = await fetch(`${API_URL}/books/create-book`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         credentials: "include",
         body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || errorData.error || "Kitap kaydedilemedi");
      }

      return await response.json();
   } catch (error) {
      console.error("Kitap kaydetme hatası:", error);
      throw error;
   }
}

// Book API Methods
export const bookApi = {
   // Category APIs
   getCategories: async (): Promise<ApiResponse<BookCategory[]>> => {
      const response = await axiosInstance.get("/books/categories");
      return response.data;
   },

   getCategoryById: async (id: string): Promise<ApiResponse<BookCategory>> => {
      const response = await axiosInstance.get(`/books/categories/${id}`);
      return response.data;
   },

   createCategory: async (data: CreateCategoryData): Promise<ApiResponse<BookCategory>> => {
      const response = await axiosInstance.post("/books/categories", data);
      return response.data;
   },

   updateCategory: async (data: UpdateCategoryData): Promise<ApiResponse<BookCategory>> => {
      const response = await axiosInstance.put(`/books/categories/${data.id}`, data);
      return response.data;
   },

   deleteCategory: async (id: string): Promise<ApiResponse> => {
      const response = await axiosInstance.delete(`/books/categories/${id}`);
      return response.data;
   },

   // Book APIs
   createBook,
   getBooks: async (categoryId?: string, limit?: number): Promise<ApiResponse<Book[]>> => {
      const params: { categoryId?: string; limit?: number } = {};
      if (categoryId) {
         params.categoryId = categoryId;
      }
      if (limit) {
         params.limit = limit;
      }
      const response = await axiosInstance.get("/books/get-books", { params });
      return response.data;
   },
   getBookById: async (id: string): Promise<ApiResponse<Book>> => {
      const response = await axiosInstance.get(`/books/get-book/${id}`);
      return response.data;
   },
   getBookPiece: async (): Promise<ApiResponse<Number>> => {
      const response = await axiosInstance.get("/books/get-book-piece");
      return response.data;
   },
};
