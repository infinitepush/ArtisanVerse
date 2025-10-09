'use server';

import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { products as productsData, customerPurchases as customerPurchasesData } from '@/lib/data';

const productsJsonPath = path.join(process.cwd(), 'src', 'lib', 'data', 'products.json');
const customerPurchasesJsonPath = path.join(process.cwd(), 'src', 'lib', 'data', 'customer-purchases.json');

const buyNowSchema = z.object({
  productId: z.string(),
});

export async function buyNowAction(formData: FormData) {
  const cookieStore = cookies();
  const authSession = cookieStore.get('auth-session');
  
  if (!authSession || !authSession.value.startsWith('customer:')) {
    return { message: 'You must be logged in as a customer to make a purchase.' };
  }

  const customerId = authSession.value.split(':')[1];

  const validatedFields = buyNowSchema.safeParse({
    productId: formData.get('productId'),
  });

  if (!validatedFields.success) {
    return { message: 'Invalid product ID.' };
  }

  const { productId } = validatedFields.data;

  try {
    // Read products data
    const productsFile = await fs.readFile(productsJsonPath, 'utf-8');
    const productsData = JSON.parse(productsFile);
    const products = productsData.products;

    // Find the product
    const productIndex = products.findIndex((p: any) => p.id === productId);
    if (productIndex === -1) {
      return { message: 'Product not found.' };
    }

    // Read customer purchases data
    let customerPurchases = [];
    try {
      const purchasesFile = await fs.readFile(customerPurchasesJsonPath, 'utf-8');
      customerPurchases = JSON.parse(purchasesFile).customerPurchases;
    } catch (error) {
      // File might not exist yet, which is fine
    }

    // Create a new purchase
    const newPurchase = {
      orderId: `order-${Date.now()}`,
      customerId,
      productId,
      purchaseDate: new Date().toISOString(),
    };

    // Add the new purchase
    customerPurchases.push(newPurchase);

    // Update product sales
    products[productIndex].reviewCount = (products[productIndex].reviewCount || 0) + 1;

    // Write updated data back to files
    await fs.writeFile(productsJsonPath, JSON.stringify({ products }, null, 2));
    await fs.writeFile(customerPurchasesJsonPath, JSON.stringify({ customerPurchases }, null, 2));

    // Revalidate paths
    revalidatePath('/marketplace/product/[id]');
    revalidatePath('/dashboard-customer');
    revalidatePath('/dashboard-artisan/products');

    return { message: 'Purchase successful!' };
  } catch (error) {
    console.error('Error processing purchase:', error);
    return { message: 'An unexpected error occurred while processing your purchase.' };
  }
}