import MarketplaceClientPage from './marketplace-client-page';
import { promises as fs } from 'fs';
import path from 'path';

async function getProducts() {
  const productsPath = path.join(process.cwd(), 'src', 'lib', 'data', 'products.json');
  try {
    const productsData = await fs.readFile(productsPath, 'utf-8');
    return JSON.parse(productsData);
  } catch (error) {
    console.error("Could not read products data:", error);
    return []; // Return empty array on error
  }
}

export default async function MarketplacePage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">Marketplace</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Find unique, handcrafted items from artisans around the world.
        </p>
      </div>
      <MarketplaceClientPage initialProducts={products} />
    </div>
  );
}