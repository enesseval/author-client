import axiosInstance from "@/lib/axiosInstance";
import { CommentFormValues, Comment } from "@/types/types"; // Comment tipi eklendi
import { ApiResponse } from "./bookApi"; // Genel API yanıt tipi bookApi'den alınabilir

// Yorum ekleme fonksiyonu
const addComment = async (data: CommentFormValues): Promise<ApiResponse<Comment>> => {
   try {
      // Yorum verisini API'ye gönder
      const response = await axiosInstance.post("/comments", data); // POST isteği /api/comments endpoint'ine
      return response.data; // API'den gelen yanıtı döndür
   } catch (error: any) {
      console.error("Yorum ekleme API hatası:", error);
      // Axios hatası ise backend'den gelen mesajı kullanmaya çalış
      if (error.response && error.response.data) {
         return error.response.data;
      }
      // Genel hata durumu
      return {
         success: false,
         message: "Yorum gönderilirken beklenmedik bir hata oluştu.",
         error: error.message || "Unknown error",
      };
   }
};

// commentApi objesi
export const commentApi = {
   addComment,
   // Bekleyen yorum sayısını getirme fonksiyonu
   getPendingCommentCount: async (): Promise<ApiResponse<{ count: number }>> => {
      try {
         const response = await axiosInstance.get("/comments/pending/count");
         return response.data;
      } catch (error: any) {
         console.error("Bekleyen yorum sayısı API hatası:", error);
         if (error.response && error.response.data) {
            return error.response.data;
         }
         return {
            success: false,
            message: "Bekleyen yorum sayısı alınırken beklenmedik bir hata oluştu.",
            error: error.message || "Unknown error",
         };
      }
   },
   // Bekleyen yorumları getirme fonksiyonu
   getPendingComments: async (): Promise<ApiResponse<Comment[]>> => {
      try {
         const response = await axiosInstance.get("/comments/pending");
         return response.data;
      } catch (error: any) {
         console.error("Bekleyen yorumları getirme API hatası:", error);
         if (error.response && error.response.data) {
            return error.response.data;
         }
         return {
            success: false,
            message: "Bekleyen yorumlar alınırken beklenmedik bir hata oluştu.",
            error: error.message || "Unknown error",
         };
      }
   },
   // Yorum durumunu güncelleme fonksiyonu
   updateCommentStatus: async (commentId: string, status: "approved" | "rejected"): Promise<ApiResponse<Comment>> => {
      try {
         const response = await axiosInstance.put(`/comments/${commentId}/status`, { status });
         return response.data;
      } catch (error: any) {
         console.error("Yorum durumu güncelleme API hatası:", error);
         if (error.response && error.response.data) {
            return error.response.data;
         }
         return {
            success: false,
            message: "Yorum durumu güncellenirken beklenmedik bir hata oluştu.",
            error: error.message || "Unknown error",
         };
      }
   },
   // Onaylanmış yorumları getirme fonksiyonu
   getApprovedComments: async (): Promise<ApiResponse<Comment[]>> => {
      try {
         const response = await axiosInstance.get("/comments/approved"); // Onaylanmış yorumlar için endpoint
         return response.data;
      } catch (error: any) {
         console.error("Onaylanmış yorumları getirme API hatası:", error);
         if (error.response && error.response.data) {
            return error.response.data;
         }
         return {
            success: false,
            message: "Onaylanmış yorumlar alınırken beklenmedik bir hata oluştu.",
            error: error.message || "Unknown error",
         };
      }
   },
   // Gelecekte diğer yorum işlemleri (getComments, deleteComment vb.) buraya eklenebilir
   getApprovedCommentsPiece: async (): Promise<ApiResponse> => {
      const response = await axiosInstance.get("/comments/approved/piece");
      return response.data;
   },
};
