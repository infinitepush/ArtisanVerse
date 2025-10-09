import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import ProductsClientPage from './products-client-page';
import type { Product } from '@/lib/types';

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

export default async function ProductsPage() {
    const cookieStore = cookies();
    const authSession = cookieStore.get('auth-session');
    let artisanId: string | null = null;

    if (authSession && authSession.value.startsWith('artisan:')) {
        artisanId = authSession.value.split(':')[1];
    }

    const myProducts = artisanId ? await getArtisanProducts(artisanId) : [];

    return <ProductsClientPage myProducts={myProducts} />;
}