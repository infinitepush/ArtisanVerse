import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import ProductsClientPage from './products-client-page';
import type { Product } from '@/lib/types';

// Define the ImagePlaceholder type here as it's not in the central types file
export interface ImagePlaceholder {
    id: string;
    description: string;
    imageUrl: string;
    imageHint: string;
}

async function getArtisanProducts(artisanId: string): Promise<Product[]> {
    const productsPath = path.join(process.cwd(), 'src', 'lib', 'data', 'products.json');
    try {
        const productsData = await fs.readFile(productsPath, 'utf-8');
        const allProducts = JSON.parse(productsData) as Product[];
        return allProducts.filter(p => p.artisanId === artisanId);
    } catch (error) {
        console.error('Failed to read or parse products.json:', error);
        return [];
    }
}

async function getImages(): Promise<ImagePlaceholder[]> {
    const imagesPath = path.join(process.cwd(), 'src', 'lib', 'data', 'placeholder-images.json');
    try {
        const imagesData = await fs.readFile(imagesPath, 'utf-8');
        return JSON.parse(imagesData).placeholderImages;
    } catch (error) {
        console.error('Failed to read or parse placeholder-images.json:', error);
        return [];
    }
}

export default async function ProductsPage() {
    const cookieStore = cookies();
    const authSession = cookieStore.get('auth-session');
    let artisanId: string | null = null;

    if (authSession && authSession.value.startsWith('artisan:')) {
        artisanId = authSession.value.split(':')[1];
    }

    const [myProducts, allImages] = await Promise.all([
        artisanId ? getArtisanProducts(artisanId) : Promise.resolve([]),
        getImages()
    ]);

    return <ProductsClientPage myProducts={myProducts} allImages={allImages} />;
}