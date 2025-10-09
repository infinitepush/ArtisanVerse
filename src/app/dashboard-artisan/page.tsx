import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import DashboardClientPage from './dashboard-client-page';
import type { Product } from '@/lib/types';

async function getArtisanData(artisanId: string): Promise<{ myProducts: Product[], totalRevenue: number, totalSales: number }> {
    const productsPath = path.join(process.cwd(), 'src', 'lib', 'data', 'products.json');
    try {
        const productsData = await fs.readFile(productsPath, 'utf-8');
        const allProducts = JSON.parse(productsData) as Product[];
        const myProducts = allProducts.filter(p => p.artisanId === artisanId);
        
        const totalRevenue = myProducts.reduce((acc, p) => acc + (p.price * p.reviewCount), 0); // Assuming reviewCount is sales
        const totalSales = myProducts.reduce((acc, p) => acc + p.reviewCount, 0);

        return { myProducts, totalRevenue, totalSales };
    } catch (error) {
        console.error('Failed to read or parse products.json:', error);
        return { myProducts: [], totalRevenue: 0, totalSales: 0 };
    }
}

export default async function DashboardPage() {
    const cookieStore = cookies();
    const authSession = cookieStore.get('auth-session');
    let artisanId: string | null = null;

    if (authSession && authSession.value.startsWith('artisan:')) {
        artisanId = authSession.value.split(':')[1];
    }

    const { myProducts, totalRevenue, totalSales } = artisanId ? await getArtisanData(artisanId) : { myProducts: [], totalRevenue: 0, totalSales: 0 };

    return <DashboardClientPage myProducts={myProducts} totalRevenue={totalRevenue} totalSales={totalSales} />;
}