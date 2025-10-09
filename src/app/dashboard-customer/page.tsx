import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { products, customerPurchases } from '@/lib/data';
import type { User, Product, CustomerPurchase } from '@/lib/types';
import { ProductCard } from '@/components/shared/product-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CustomerDashboardClientPage from './customer-dashboard-client-page';

async function getCustomer(customerId: string): Promise<User | null> {
  const customersPath = path.join(process.cwd(), 'src', 'lib', 'data', 'customers.json');
  try {
    const data = await fs.readFile(customersPath, 'utf-8');
    const customers = JSON.parse(data) as User[];
    return customers.find(c => c.id === customerId) || null;
  } catch (error) {
    return null;
  }
}

interface EnrichedPurchase extends CustomerPurchase {
    product: Product | undefined;
}

export default async function CustomerDashboardPage() {
  const cookieStore = cookies();
  const authSession = cookieStore.get('auth-session');
  
  if (!authSession || !authSession.value.startsWith('customer:')) {
    redirect('/login-customer');
  }

  const customerId = authSession.value.split(':')[1];
  const customer = await getCustomer(customerId);

  if (!customer) {
    redirect('/login-customer');
  }

  const purchases: EnrichedPurchase[] = customerPurchases
    .filter(p => p.customerId === customerId)
    .map(p => ({
        ...p,
        product: products.find(prod => prod.id === p.productId)
    }))
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());


  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-left mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">Welcome, {customer.name}!</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          This is your personal dashboard. View your order history, manage your profile, and discover new treasures.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>My Orders</CardTitle>
                    <CardDescription>An overview of your purchase history.</CardDescription>
                </CardHeader>
                <CardContent>
                    {purchases.length > 0 ? (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchases.map(purchase => (
                                    <TableRow key={purchase.orderId}>
                                        <TableCell className="font-mono text-sm">{purchase.orderId}</TableCell>
                                        <TableCell className="font-medium">{purchase.product?.name || 'Unknown Product'}</TableCell>
                                        <TableCell>{new Date(purchase.purchaseDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">${purchase.product?.price.toFixed(2) || 'N/A'}</TableCell>
                                        <TableCell><Badge>Shipped</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            <p>You haven't made any purchases yet.</p>
                            <Button asChild className="mt-4">
                                <Link href="/marketplace">Start Shopping</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <CustomerDashboardClientPage customer={customer} />
      </div>

      <div className="mt-16">
            <h2 className="text-3xl font-bold font-headline tracking-tight mb-8">Continue Shopping</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    </div>
  );
}
