"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { authApi } from "@/services/api/authApi";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { useUser } from "@/context/UserContext";
import Unauthorized from "@/components/Unauthorized";
import { editUserSchema } from "@/types/types";

interface User {
   id: string;
   username: string;
   role: "SUPER_ADMIN" | "ADMIN";
}

type EditUserFormValues = z.infer<typeof editUserSchema>;

function EditUserDialog({ user, onSuccess }: { user: User; onSuccess: () => void }) {
   const [isOpen, setIsOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const form = useForm<EditUserFormValues>({
      resolver: zodResolver(editUserSchema),
      defaultValues: {
         username: user.username,
         oldPassword: "",
         newPassword: "",
         confirmPassword: "",
         role: user.role,
      },
   });

   const onSubmit = async (data: EditUserFormValues) => {
      setIsLoading(true);
      try {
         const updateData = {
            userId: user.id,
            username: data.username,
            role: data.role,
            ...(data.newPassword && {
               oldPassword: data.oldPassword,
               newPassword: data.newPassword,
            }),
         };

         const response = await authApi.updateUser(updateData);
         if (response.success) {
            toast.success(response.message || "Kullanıcı başarıyla güncellendi");
            setIsOpen(false);
            onSuccess();
         } else {
            toast.error(response.message || "Kullanıcı güncellenirken bir hata oluştu");
         }
      } catch (error: any) {
         toast.error(error.response?.data?.message || "Beklenmeyen bir hata oluştu");
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
               <DialogTitle>Kullanıcı Düzenle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                  <FormField
                     control={form.control}
                     name="username"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Kullanıcı Adı</FormLabel>
                           <FormControl>
                              <Input placeholder="Kullanıcı adını giriniz" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="oldPassword"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Mevcut Şifre</FormLabel>
                           <FormControl>
                              <Input type="password" placeholder="Mevcut şifrenizi giriniz" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="newPassword"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Yeni Şifre</FormLabel>
                           <FormControl>
                              <Input type="password" placeholder="Yeni şifre giriniz (değiştirmek istemiyorsanız boş bırakın)" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="confirmPassword"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Yeni Şifre Tekrar</FormLabel>
                           <FormControl>
                              <Input type="password" placeholder="Yeni şifreyi tekrar giriniz" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="role"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Rol</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Rol seçiniz" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 <SelectItem value="ADMIN">Yönetici</SelectItem>
                                 <SelectItem value="SUPER_ADMIN">Süper Yönetici</SelectItem>
                              </SelectContent>
                           </Select>
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

function AddUserDialog({ onSuccess }: { onSuccess: () => void }) {
   const [isOpen, setIsOpen] = useState(false);
   const [formData, setFormData] = useState({
      username: "",
      password: "",
      role: "ADMIN" as "SUPER_ADMIN" | "ADMIN",
   });
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         const response = await authApi.register(formData);
         if (response.success) {
            toast.success("Kullanıcı başarıyla oluşturuldu");
            setIsOpen(false);
            setFormData({ username: "", password: "", role: "ADMIN" });
            onSuccess();
         } else {
            toast.error(response.message || "Kullanıcı oluşturulurken bir hata oluştu");
         }
      } catch (error: any) {
         toast.error(error.response?.data?.message || "Beklenmeyen bir hata oluştu");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button className="mb-4">
               <PlusCircle className="w-4 h-4 mr-2" />
               Yeni Kullanıcı Ekle
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
               <div className="grid gap-2">
                  <Label htmlFor="username">Kullanıcı Adı</Label>
                  <Input
                     id="username"
                     placeholder="Kullanıcı adını giriniz"
                     value={formData.username}
                     onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                     required
                     minLength={3}
                  />
               </div>
               <div className="grid gap-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                     id="password"
                     type="password"
                     placeholder="Şifre giriniz"
                     value={formData.password}
                     onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                     required
                     minLength={6}
                  />
               </div>
               <div className="grid gap-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select value={formData.role} onValueChange={(value: "SUPER_ADMIN" | "ADMIN") => setFormData((prev) => ({ ...prev, role: value }))}>
                     <SelectTrigger>
                        <SelectValue placeholder="Rol seçiniz" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="ADMIN">Yönetici</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Süper Yönetici</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <Button type="submit" className="mt-2" disabled={isLoading}>
                  {isLoading ? "Ekleniyor..." : "Kullanıcı Ekle"}
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   );
}

export default function Users() {
   const [users, setUsers] = useState<User[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const { user } = useUser();

   const fetchUsers = async () => {
      try {
         const response = await authApi.getUsers();
         if (response.success && response.data) {
            setUsers(response.data);
         } else {
            toast.error("Kullanıcılar yüklenirken bir hata oluştu");
         }
      } catch (error) {
         toast.error("Kullanıcılar yüklenirken bir hata oluştu");
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      if (user?.role === "SUPER_ADMIN") fetchUsers();
   }, []);

   const getRoleDisplay = (role: "SUPER_ADMIN" | "ADMIN") => {
      return role === "SUPER_ADMIN" ? "Süper Yönetici" : "Yönetici";
   };

   const handleDelete = async (userId: string) => {
      try {
         const response = await authApi.deleteUser(userId);
         if (response.success) {
            toast.success("Kullanıcı başarıyla silindi");
            fetchUsers();
         } else {
            toast.error(response.message || "Kullanıcı silinirken bir hata oluştu");
         }
      } catch (error) {
         toast.error("Kullanıcı silinirken bir hata oluştu");
      }
   };

   if (user?.role !== "SUPER_ADMIN") return <Unauthorized />;

   return (
      <div className="p-6 bg-pattern">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
            <AddUserDialog onSuccess={fetchUsers} />
         </div>

         <div className="border rounded-lg">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Kullanıcı Adı</TableHead>
                     <TableHead>Rol</TableHead>
                     <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {isLoading ? (
                     <TableRow>
                        <TableCell colSpan={3} className="text-center py-10">
                           Yükleniyor...
                        </TableCell>
                     </TableRow>
                  ) : users.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={3} className="text-center py-10">
                           Henüz kullanıcı bulunmamaktadır
                        </TableCell>
                     </TableRow>
                  ) : (
                     users.map((user) => (
                        <TableRow key={user.id}>
                           <TableCell>{user.username}</TableCell>
                           <TableCell>{getRoleDisplay(user.role)}</TableCell>
                           <TableCell className="text-right">
                              <EditUserDialog user={user} onSuccess={fetchUsers} />
                              <AlertDialog>
                                 <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-red-500">
                                       <Trash2 className="w-4 h-4" />
                                    </Button>
                                 </AlertDialogTrigger>
                                 <AlertDialogContent>
                                    <AlertDialogHeader>
                                       <AlertDialogTitle>Silmek istediğinize emin misiniz?</AlertDialogTitle>
                                       <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                       <AlertDialogCancel>İptal</AlertDialogCancel>
                                       <AlertDialogAction onClick={() => handleDelete(user.id)}>Sil</AlertDialogAction>
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
