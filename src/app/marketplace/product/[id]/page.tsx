import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { artisans } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { buyNowAction } from '@/app/marketplace/actions';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { promises as fs } from 'fs';
import path from 'path';
import { ShoppingCart, Star } from 'lucide-react';

async function getProduct(id: string) {
  const productsPath = path.join(process.cwd(), 'src', 'lib', 'data', 'products.json');
  try {
    const productsData = await fs.readFile(productsPath, 'utf-8');
    const products = JSON.parse(productsData);
    return products.find((p: any) => p.id === id);
  } catch (error) {
    console.error("Could not read products data:", error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const artisan = artisans.find(a => a.id === product.artisanId);
  const images = product.imageIds.map((id: string) => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);
  const artisanAvatar = artisan ? PlaceHolderImages.find(img => img.id === artisan.avatarImageId) : undefined;

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image: any, index: number) => image && (
                <CarouselItem key={index}>
                  <div className="aspect-square relative overflow-hidden rounded-lg">
                    <Image
                      src={image.imageUrl}
                      alt={`${product.name} - image ${index + 1}`}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div>
          <h1 className="text-4xl font-bold font-headline">{product.name}</h1>
          
          {artisan && (
            <Link href={`/artisans/${artisan.id}`} className="inline-flex items-center gap-2 mt-4 group">
              <Avatar className="w-8 h-8">
                {artisanAvatar && <AvatarImage src={artisanAvatar.imageUrl} alt={artisan.name} />}
                <AvatarFallback>{artisan.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-lg text-muted-foreground group-hover:text-primary transition-colors">by {artisan.name}</span>
            </Link>
          )}

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>
          </div>
          
          <p className="text-4xl font-bold mt-6">${product.price.toFixed(2)}</p>

          <form action={buyNowAction}>
            <input type="hidden" name="productId" value={product.id} />
            <Button size="lg" className="flex-grow w-full mt-8">
              <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
            </Button>
          </form>
          
          <Separator className="my-8" />
          
          <div>
            <h3 className="text-xl font-bold">Description</h3>
            <p className="mt-2 text-muted-foreground">{product.description}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold">The Story Behind the Product</h3>
            <p className="mt-2 text-muted-foreground italic">"{product.story}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
