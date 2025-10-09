
import { cookies } from 'next/headers';
import ProfileClientPage from './profile-client-page';
import type { Artisan } from '@/lib/types';
import { promises as fs } from 'fs';
import path from 'path';

async function getArtisan(artisanId: string): Promise<Artisan | null> {
  const artisansPath = path.join(process.cwd(), 'src', 'lib', 'data', 'artisans.json');
  try {
    const artisansData = await fs.readFile(artisansPath, 'utf-8');
    const artisans = JSON.parse(artisansData).artisans as Artisan[];
    const artisan = artisans.find(a => a.id === artisanId);
    return artisan || null;
  } catch (error) {
    console.error('Failed to read or parse artisans.json:', error);
    return null;
  }
}


export default async function ProfilePage() {
  const cookieStore = await cookies();
  const authSession = cookieStore.get('auth-session');
  
  let artisan: Artisan | null = null;
  if (authSession && authSession.value.startsWith('artisan:')) {
      const artisanId = authSession.value.split(':')[1];
      artisan = await getArtisan(artisanId);
  }

  return <ProfileClientPage artisan={artisan} />;
}
