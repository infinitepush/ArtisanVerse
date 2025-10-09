'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ProductCard } from '@/components/shared/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ListFilter, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { searchAction, type SearchState } from './actions';
import { categories } from '@/lib/data';
import type { Product } from '@/lib/types';

const initialState: SearchState = {
  products: [],
  query: '',
};

function SearchButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9" disabled={pending}>
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
      <span className="sr-only">Search</span>
    </Button>
  );
}

export default function MarketplaceClientPage({ initialProducts }: { initialProducts: Product[] }) {
  const [state, formAction] = useFormState(searchAction, {
    ...initialState,
    products: initialProducts,
  });
  const [query, setQuery] = useState('');

  // Sync input with state.query for cases like browser back navigation
  useEffect(() => {
    setQuery(state.query);
  }, [state.query]);


  return (
    <>
      <div className="mb-8 sticky top-14 z-40 bg-background/80 backdrop-blur-sm py-4 -my-4 flex flex-col md:flex-row gap-4">
        <form action={formAction} className="relative flex-grow">
          <Input
            name="query"
            placeholder="Try 'ceramic mugs under $50 in earth tones'..."
            className="w-full pl-4 pr-12 h-12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchButton />
        </form>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px] h-12">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select defaultValue="popularity">
            <SelectTrigger className="w-full md:w-[180px] h-12">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-12 w-12 hidden md:inline-flex">
            <ListFilter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {state.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {state.products.length === 0 && (
        <div className="text-center py-16 col-span-full">
          <p className="text-muted-foreground">No products found matching your search.</p>
        </div>
      )}
    </>
  );
}
