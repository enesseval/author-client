"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, Calendar, Edit, Eye, Filter, MoreHorizontal, Plus, Search, Star, Trash } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useBooksContext } from "@/context/BooksContext";
import { useRouter } from "next/navigation";

function BookList() {
   const [searchTerm, setSearchTerm] = useState("");
   const [filterCategory, setFilterCategory] = useState("all");
   const { categories, books, setSelectedCategory, isLoadingBooks } = useBooksContext();
   const router = useRouter();

   useEffect(() => {
      if (filterCategory === "all") {
         setSelectedCategory(null);
      } else {
         setSelectedCategory(filterCategory);
      }
   }, [filterCategory, setSelectedCategory]);

   if (isLoadingBooks) {
      return (
         <div className="container mx-auto py-6 flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
               <p className="mt-2 text-muted-foreground">Kitaplar yükleniyor...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto py-6 bg-pattern">
         <div className="flex items-center justify-between mb-6">
            <div>
               <h1 className="text-3xl font-bold tracking-tight">Kitaplar</h1>
               <p className="text-muted-foreground">Tüm kitaplarınızı yönetin, düzenleyin ve yenilerini ekleyin.</p>
            </div>
            <Button>
               <Link href="/admin/books/add" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Kitap Ekle
               </Link>
            </Button>
         </div>

         {/* Arama ve Filtreleme */}
         <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input type="search" placeholder="Kitap ara..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
               <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                     <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="Kategori Filtrele" />
                     </div>
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">Tüm Kategoriler</SelectItem>
                     {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                           {category.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         </div>

         <Tabs defaultValue="list" className="space-y-2 mt-2">
            <TabsList>
               <TabsTrigger value="list">Liste Görünümü</TabsTrigger>
               <TabsTrigger value="grid">Kart Görünümü</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-2">
               <Card>
                  <CardContent className="p-0">
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableHead className="w-[80px]">Kapak</TableHead>
                              <TableHead>
                                 <div className="flex items-center gap-1 cursor-pointer">
                                    Başlık
                                    <ArrowUpDown className="h-3 w-3" />
                                 </div>
                              </TableHead>
                              <TableHead>Kategori</TableHead>
                              <TableHead>
                                 <div className="flex items-center gap-1 cursor-pointer">
                                    Yıl
                                    <ArrowUpDown className="h-3 w-3" />
                                 </div>
                              </TableHead>
                              <TableHead>Yayınevi</TableHead>
                              <TableHead>
                                 <div className="flex items-center gap-1 cursor-pointer">
                                    Değerlendirme
                                    <ArrowUpDown className="h-3 w-3" />
                                 </div>
                              </TableHead>
                              <TableHead>Durum</TableHead>
                              <TableHead className="text-right">İşlemler</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {books.map((book) => (
                              <TableRow key={book._id} onClick={() => router.push(`/books/${book._id}`)} className="cursor-pointer">
                                 <TableCell>
                                    <div className="w-12 h-16 relative overflow-hidden rounded-sm">
                                       <Image src={book.coverImageUrl || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                                    </div>
                                 </TableCell>
                                 <TableCell className="font-medium">{book.title}</TableCell>
                                 <TableCell>
                                    <Badge variant="outline">{book.category.name}</Badge>
                                 </TableCell>
                                 <TableCell>{book.year}</TableCell>
                                 <TableCell>{book.publisher}</TableCell>
                                 <TableCell>
                                    <div className="flex items-center gap-1">
                                       {/*<Star className={`h-3 w-3 ${book.rating > 0 ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                                       <span>{book.rating > 0 ? book.rating : "Henüz değerlendirilmedi"}</span>*/}
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <Badge variant={book.status === "published" ? "default" : "secondary"}>{book.status === "published" ? "Yayında" : "Taslak"}</Badge>
                                 </TableCell>
                                 <TableCell className="text-right">
                                    <DropdownMenu>
                                       <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                             <MoreHorizontal className="h-4 w-4" />
                                             <span className="sr-only">Menüyü Aç</span>
                                          </Button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent align="end">
                                          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem>
                                             <Eye className="mr-2 h-4 w-4" />
                                             <span>Görüntüle</span>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                             <Edit className="mr-2 h-4 w-4" />
                                             <span>Düzenle</span>
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem className="text-destructive">
                                             <Trash className="mr-2 h-4 w-4" />
                                             <span>Sil</span>
                                          </DropdownMenuItem>
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="grid" className="space-y-4">
               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {books.map((book) => (
                     <motion.div key={book._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} whileHover={{ y: -5 }}>
                        <Card className="overflow-hidden h-full flex flex-col p-0 cursor-pointer" onClick={() => router.push(`/books/${book._id}`)}>
                           <div className="relative aspect-[3/4] w-full">
                              <Image src={book.coverImageUrl || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                              <div className="absolute top-2 right-2">
                                 <Badge variant={book.status === "published" ? "default" : "secondary"}>{book.status === "published" ? "Yayında" : "Taslak"}</Badge>
                              </div>
                           </div>
                           <CardContent className="flex-1 p-4">
                              <div className="space-y-2">
                                 <div className="flex items-center justify-between">
                                    <h3 className="font-semibold truncate">{book.title}</h3>
                                    <div className="flex items-center gap-1">
                                       {/*<Star className={`h-3 w-3 ${book.rating > 0 ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                                       <span className="text-sm">{book.rating > 0 ? book.rating : "-"}</span>*/}
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Badge variant="outline">{book.category.name}</Badge>
                                    <div className="flex items-center gap-1">
                                       <Calendar className="h-3 w-3" />
                                       <span>{book.year}</span>
                                    </div>
                                 </div>
                                 <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
                              </div>
                           </CardContent>
                           <div className="p-4 pt-0 mt-auto">
                              <div className="flex gap-2">
                                 <Button variant="outline" size="sm" className="flex-1 cursor-pointer">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Görüntüle
                                 </Button>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                       <Button variant="outline" size="sm" className="px-2">
                                          <MoreHorizontal className="h-4 w-4" />
                                       </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                       <DropdownMenuItem className="cursor-pointer">
                                          <Edit className="mr-2 h-4 w-4" />
                                          <span>Düzenle</span>
                                       </DropdownMenuItem>
                                       <DropdownMenuItem className="cursor-pointer text-destructive">
                                          <Trash className="mr-2 h-4 w-4" />
                                          <span>Sil</span>
                                       </DropdownMenuItem>
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                              </div>
                           </div>
                        </Card>
                     </motion.div>
                  ))}
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}

export default BookList;
