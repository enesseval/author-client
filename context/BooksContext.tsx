"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { bookApi, BookCategory } from "@/services/api/bookApi";
import { toast } from "sonner";
import { Book } from "@/types/types";

// Context tipi tanımı
interface BooksContextType {
   categories: BookCategory[];
   isLoadingCategories: boolean;
   fetchCategories: () => Promise<BookCategory[] | undefined>;
   createCategory: (data: { name: string; description?: string }) => Promise<boolean>;
   updateCategory: (data: { id: string; name: string; description?: string }) => Promise<boolean>;
   deleteCategory: (categoryId: string) => Promise<boolean>;
   books: Book[];
   isLoadingBooks: boolean;
   fetchBooks: (categoryId?: string) => Promise<void>;
   selectedCategory: string | null;
   setSelectedCategory: (categoryId: string | null) => void;
}

// Context'i oluştur
const BooksContext = createContext<BooksContextType | undefined>(undefined);

// Context hook'u
export function useBooksContext() {
   const context = useContext(BooksContext);
   if (context === undefined) {
      throw new Error("useBooksContext must be used within a BooksProvider");
   }
   return context;
}

// Provider bileşeni
export function BooksProvider({ children }: { children: ReactNode }) {
   const [categories, setCategories] = useState<BookCategory[]>([]);
   const [isLoadingCategories, setIsLoadingCategories] = useState(true);
   const [books, setBooks] = useState<Book[]>([]);
   const [isLoadingBooks, setIsLoadingBooks] = useState(true);
   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

   // Kategorileri getir
   const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
         const response = await bookApi.getCategories();
         if (response.success && response.data) {
            setCategories(response.data);
            return response.data;
         } else {
            toast.error(response.message || "Kategoriler yüklenirken bir hata oluştu");
         }
      } catch (error) {
         toast.error("Kategoriler yüklenirken bir hata oluştu");
      } finally {
         setIsLoadingCategories(false);
      }
   };

   // Kategori oluştur
   const createCategory = async (data: { name: string; description?: string }): Promise<boolean> => {
      try {
         const response = await bookApi.createCategory(data);
         if (response.success) {
            toast.success("Kategori başarıyla oluşturuldu");
            await fetchCategories();
            return true;
         } else {
            toast.error(response.message || "Kategori oluşturulurken bir hata oluştu");
            return false;
         }
      } catch (error: any) {
         toast.error(error.response?.data?.message || "Beklenmeyen bir hata oluştu");
         return false;
      }
   };

   // Kategori güncelle
   const updateCategory = async (data: { id: string; name: string; description?: string }): Promise<boolean> => {
      try {
         const response = await bookApi.updateCategory(data);
         if (response.success) {
            toast.success(response.message || "Kategori başarıyla güncellendi");
            await fetchCategories();
            return true;
         } else {
            toast.error(response.message || "Kategori güncellenirken bir hata oluştu");
            return false;
         }
      } catch (error: any) {
         toast.error(error.response?.data?.message || "Beklenmeyen bir hata oluştu");
         return false;
      }
   };

   // Kategori sil
   const deleteCategory = async (categoryId: string): Promise<boolean> => {
      try {
         const response = await bookApi.deleteCategory(categoryId);
         if (response.success) {
            toast.success("Kategori başarıyla silindi");
            await fetchCategories();
            return true;
         } else {
            toast.error(response.message || "Kategori silinirken bir hata oluştu");
            return false;
         }
      } catch (error) {
         toast.error("Kategori silinirken bir hata oluştu");
         return false;
      }
   };

   const fetchBooks = async (categoryId?: string) => {
      setIsLoadingBooks(true);
      try {
         const response = await bookApi.getBooks(categoryId);
         if (response.success && response.data) {
            setBooks(response.data);
         } else {
            toast.error(response.message || "Kitaplar yüklenirken bir hata oluştu");
         }
      } catch (error) {
         toast.error("Kitaplar yüklenirken bir hata oluştu");
         console.error("Fetch books error:", error);
      } finally {
         setIsLoadingBooks(false);
      }
   };

   // Kategori değiştiğinde kitapları yeniden yükle
   useEffect(() => {
      fetchBooks(selectedCategory || undefined);
   }, [selectedCategory]);

   // İlk yükleme sırasında kategorileri getir
   useEffect(() => {
      fetchCategories();
   }, []);

   // Context değerlerini sağla
   const value: BooksContextType = {
      categories,
      isLoadingCategories,
      fetchCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      books,
      isLoadingBooks,
      fetchBooks,
      selectedCategory,
      setSelectedCategory,
   };

   return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export default BooksContext;
