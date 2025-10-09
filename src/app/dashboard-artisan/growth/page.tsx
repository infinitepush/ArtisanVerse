import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import GrowthClientPage from './growth-client-page';
import { generateGrowthInsights } from "@/ai/flows/generate-growth-insights";
import { trafficData } from "@/lib/data";
import type { Product } from '@/lib/types';

interface GrowthInsights {
  insights: string[];
  nextSteps: string[];
}

async function getGrowthData(artisanId: string): Promise<{ insights: GrowthInsights | null, error: string | null }> {
    const productsPath = path.join(process.cwd(), 'src', 'lib', 'data', 'products.json');
    try {
        const productsData = await fs.readFile(productsPath, 'utf-8');
        const allProducts = JSON.parse(productsData) as Product[];
        const myProducts = allProducts.filter(p => p.artisanId === artisanId);

        // Generate mock sales data based on user's products
        const mockSalesData = myProducts.map((p, i) => ({
            date: new Date(new Date().setDate(new Date().getDate() - (myProducts.length - i))).toISOString().split('T')[0],
            revenue: p.price * (p.reviewCount || 1) * (Math.random() + 0.5) // Add some randomness
        }));

        const formattedTrafficData = trafficData.map(d => ({...d, date: d.date.toISOString().split('T')[0]}));

        const result = await generateGrowthInsights({
            salesData: mockSalesData,
            trafficData: formattedTrafficData,
        });
        
        return { insights: result, error: null };

    } catch (error) {
        console.error('Failed to generate growth insights:', error);
        return { insights: null, error: "Sorry, we couldn't generate your insights right now. Please try again later." };
    }
}

export default async function GrowthPage() {
    const cookieStore = cookies();
    const authSession = cookieStore.get('auth-session');
    let artisanId: string | null = null;

    if (authSession && authSession.value.startsWith('artisan:')) {
        artisanId = authSession.value.split(':')[1];
    }

    if (!artisanId) {
        return <GrowthClientPage insights={null} error={"Could not identify artisan. Please log in again."} />;
    }

    const { insights, error } = await getGrowthData(artisanId);

    return <GrowthClientPage insights={insights} error={error} />;
}