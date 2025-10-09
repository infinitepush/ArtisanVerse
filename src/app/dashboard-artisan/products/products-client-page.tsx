'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import type { Product } from "@/lib/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useState } from "react";
import { GeneratePostDialog } from "./generate-post-dialog";
import Link from "next/link";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProductsClientPage({ myProducts }: { myProducts: Product[] }) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const handleEdit = (product: Product) => {
        console.log("Editing product:", product.name);
    }

    const handleViewPerformance = (product: Product) => {
        console.log("Viewing performance for product:", product.name);
    }

    const handleDelete = (product: Product) => {
        console.log("Deleting product:", product.name);
    }

    return (
        <>
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-headline">My Products</h1>
                <Button asChild>
                    <Link href="/dashboard-artisan/ai-tools/product-generator">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Product
                    </Link>
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Product Listings</CardTitle>
                    <CardDescription>Manage your inventory and view product performance.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Image</span>
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Price</TableHead>
                                <TableHead className="hidden md:table-cell">Sales</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myProducts.map(product => {
                                const imageUrl = PlaceHolderImages.find(img => img.id === product.imageIds[0])?.imageUrl;
                                return (
                                <TableRow key={product.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        {imageUrl && <Image src={imageUrl} alt={product.name} width={48} height={48} className="rounded-md" />}
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell><Badge>Active</Badge></TableCell>
                                    <TableCell className="hidden md:table-cell">${product.price.toFixed(2)}</TableCell>
                                    <TableCell className="hidden md:table-cell">{product.reviewCount}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onSelect={() => handleEdit(product)}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleViewPerformance(product)}>View Performance</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleGeneratePost(product)}>
                                                    Generate Post
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(product)}>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        {selectedProduct && (
            <GeneratePostDialog
                product={selectedProduct}
                isOpen={isDialogOpen}
                onOpenChange={setDialogOpen}
            />
        )}
        </>
    )
}
