import { io } from "socket.io-client";

// Backend sunucu adresini .env dosyasından veya doğrudan alabilirsiniz.
// .env dosyasındaki NEXT_PUBLIC_API_BASE_URL'den '/api' kısmını çıkararak kullanabiliriz.
// VEYA doğrudan backend adresini yazabiliriz: 'http://192.168.1.103:3001'
// Emin olmak için server/src/server.ts dosyasındaki portu kontrol edin (3001).
const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL.replace("/api", "") : "http://localhost:3001"; // Fallback adresi

export const socket = io(SOCKET_URL, {
   withCredentials: true, // Cookie'lerin gönderilmesi için
   autoConnect: false, // Otomatik bağlanmayı kapatıyoruz, manuel yöneteceğiz
});

// Bağlantı ve hata durumları için log ekleyebiliriz (opsiyonel)
socket.on("connect", () => {});

socket.on("connect_error", (err) => {
   console.error("Socket.IO bağlantı hatası:", err.message);
});

socket.on("disconnect", (reason) => {});
