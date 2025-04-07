"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BookCategory } from "@/services/api/bookApi";
import { categoryFormSchema, CategoryFormValues } from "@/types/types";
import { useBooksContext } from "@/context/BooksContext";

function EditCategoryDialog({ category, onSuccess }: { category: BookCategory; onSuccess: () => void }) {
   const [isOpen, setIsOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const { updateCategory } = useBooksContext();

   const form = useForm<CategoryFormValues>({
      resolver: zodResolver(categoryFormSchema),
      defaultValues: {
         name: category.name,
         description: category.description || "",
      },
   });

   const onSubmit = async (data: CategoryFormValues) => {
      setIsLoading(true);
      try {
         const success = await updateCategory({
            id: category.id,
            name: data.name,
            description: data.description,
         });

         if (success) {
            setIsOpen(false);
            onSuccess();
         }
      } catch (error) {
         // Error handling is already done in the context
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
               <Edit className="w-4 h-4" />
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Kategori Düzenle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Kategori Adı</FormLabel>
                           <FormControl>
                              <Input placeholder="Kategori adını giriniz" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Açıklama (Opsiyonel)</FormLabel>
                           <FormControl>
                              <Textarea placeholder="Kategori açıklamasını giriniz" className="resize-none min-h-[80px]" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button type="submit" className="mt-2" disabled={isLoading}>
                     {isLoading ? "Güncelleniyor..." : "Güncelle"}
                  </Button>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}

function AddCategoryDialog({ onSuccess }: { onSuccess: () => void }) {
   const [isOpen, setIsOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const { createCategory } = useBooksContext();

   const form = useForm<CategoryFormValues>({
      resolver: zodResolver(categoryFormSchema),
      defaultValues: {
         name: "",
         description: "",
      },
   });

   const onSubmit = async (data: CategoryFormValues) => {
      setIsLoading(true);
      try {
         const success = await createCategory(data);
         if (success) {
            setIsOpen(false);
            form.reset();
            onSuccess();
         }
      } catch (error) {
         // Error handling is already done in the context
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button className="mb-4">
               <PlusCircle className="w-4 h-4 mr-2" />
               Yeni Kategori Ekle
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Yeni Kategori Ekle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Kategori Adı</FormLabel>
                           <FormControl>
                              <Input placeholder="Kategori adını giriniz" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Açıklama (Opsiyonel)</FormLabel>
                           <FormControl>
                              <Textarea placeholder="Kategori açıklamasını giriniz" className="resize-none min-h-[80px]" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button type="submit" className="mt-2" disabled={isLoading}>
                     {isLoading ? "Ekleniyor..." : "Kategori Ekle"}
                  </Button>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}

export default function Categories() {
   const { categories, isLoadingCategories, fetchCategories, deleteCategory } = useBooksContext();

   const handleDelete = async (categoryId: string) => {
      await deleteCategory(categoryId);
   };

   return (
      <div className="p-6 bg-pattern">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Kitap Kategorileri</h1>
            <AddCategoryDialog onSuccess={fetchCategories} />
         </div>

         <div className="border rounded-lg">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Kategori Adı</TableHead>
                     <TableHead>Açıklama</TableHead>
                     <TableHead>Oluşturulma Tarihi</TableHead>
                     <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {isLoadingCategories ? (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center py-10">
                           Yükleniyor...
                        </TableCell>
                     </TableRow>
                  ) : categories.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center py-10">
                           Henüz kategori bulunmamaktadır
                        </TableCell>
                     </TableRow>
                  ) : (
                     categories.map((category) => (
                        <TableRow key={category.id}>
                           <TableCell className="font-medium">{category.name}</TableCell>
                           <TableCell>{category.description || "-"}</TableCell>
                           <TableCell>{new Date(category.createdAt).toLocaleDateString("tr-TR")}</TableCell>
                           <TableCell className="text-right">
                              <EditCategoryDialog category={category} onSuccess={fetchCategories} />
                              <AlertDialog>
                                 <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-red-500">
                                       <Trash2 className="w-4 h-4" />
                                    </Button>
                                 </AlertDialogTrigger>
                                 <AlertDialogContent>
                                    <AlertDialogHeader>
                                       <AlertDialogTitle>Silmek istediğinize emin misiniz?</AlertDialogTitle>
                                       <AlertDialogDescription>Bu işlem geri alınamaz. Bu kategori kalıcı olarak silinecektir.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                       <AlertDialogCancel>İptal</AlertDialogCancel>
                                       <AlertDialogAction onClick={() => handleDelete(category.id)}>Sil</AlertDialogAction>
                                    </AlertDialogFooter>
                                 </AlertDialogContent>
                              </AlertDialog>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
