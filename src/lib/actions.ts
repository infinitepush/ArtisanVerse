'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { comparePassword } from '@/lib/bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const artisansPath = path.join(process.cwd(), 'src', 'lib', 'data', 'artisans.json');

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string(),
});

async function readArtisans() {
    try {
        const data = await fs.readFile(artisansPath, 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData.artisans || [];
    } catch (error) {
        console.error("Failed to read or parse artisans.json:", error);
        return [];
    }
}

export async function authenticateArtisan(prevState: string | undefined, formData: FormData) {
    try {
        const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

        if (!validatedFields.success) {
            return 'Invalid email or password format.';
        }

        const { email, password } = validatedFields.data;
        const artisans = await readArtisans();
        const artisan = artisans.find((a: any) => a.email === email);

        if (!artisan) {
            return 'Invalid credentials.';
        }

        const isPasswordValid = await comparePassword(password, artisan.password);

        if (!isPasswordValid) {
            return 'Invalid credentials.';
        }
        
        cookies().set('auth-session', `artisan:${artisan.id}`, { path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });

    } catch (error) {
        console.error("Artisan Login Action Error:", error);
        return 'An unexpected error occurred.';
    }
    redirect('/dashboard-artisan');
}


export async function logoutAction() {
    cookies().delete('auth-session');
    redirect('/');
}