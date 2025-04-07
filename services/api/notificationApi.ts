import axiosInstance from "@/lib/axiosInstance"; // Oluşturduğumuz axios instance'ı
import { NotificationPayload } from "@/types/types"; // Bildirim tipi types dosyasından import edildi

// Bildirimler için API çağrılarını yöneten nesne
export const notificationApi = {
   // Kullanıcının tüm bildirimlerini getir
   getNotifications: async (): Promise<{ success: boolean; data?: NotificationPayload[]; message?: string }> => {
      try {
         const response = await axiosInstance.get("/notifications");
         return response.data;
      } catch (error: any) {
         console.error("Bildirimleri getirme hatası:", error.response?.data || error.message);
         throw error.response?.data || new Error("Bildirimler getirilemedi.");
      }
   },

   // Okunmamış bildirim sayısını getir
   getUnreadCount: async (): Promise<{ success: boolean; data?: { count: number }; message?: string }> => {
      try {
         const response = await axiosInstance.get("/notifications/unread-count");
         return response.data;
      } catch (error: any) {
         console.error("Okunmamış bildirim sayısını getirme hatası:", error.response?.data || error.message);
         throw error.response?.data || new Error("Okunmamış bildirim sayısı alınamadı.");
      }
   },

   // Tek bir bildirimi okundu olarak işaretle
   markAsRead: async (notificationId: string): Promise<{ success: boolean; data?: NotificationPayload; message?: string }> => {
      try {
         const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
         return response.data;
      } catch (error: any) {
         console.error("Bildirim okundu işaretleme hatası:", error.response?.data || error.message);
         throw error.response?.data || new Error("Bildirim okundu olarak işaretlenemedi.");
      }
   },

   // Tüm bildirimleri okundu olarak işaretle
   markAllAsRead: async (): Promise<{ success: boolean; message?: string }> => {
      try {
         const response = await axiosInstance.patch("/notifications/read-all");
         return response.data;
      } catch (error: any) {
         console.error("Tüm bildirimleri okundu işaretleme hatası:", error.response?.data || error.message);
         throw error.response?.data || new Error("Tüm bildirimler okundu olarak işaretlenemedi.");
      }
   },
};
