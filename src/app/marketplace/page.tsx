import { products } from '@/lib/data';
import MarketplaceClientPage from './marketplace-client-page';

export default function MarketplacePage() {
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