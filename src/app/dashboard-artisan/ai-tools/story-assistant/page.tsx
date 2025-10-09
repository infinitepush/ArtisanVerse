import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import StoryAssistantClientPage from './story-assistant-client-page';
import type { Artisan } from '@/lib/types';

async function getArtisanBio(artisanId: string): Promise<string | null> {
    const artisansPath = path.join(process.cwd(), 'src', 'lib', 'data', 'artisans.json');
    try {
        const artisansData = await fs.readFile(artisansPath, 'utf-8');
        const artisans = JSON.parse(artisansData).artisans as Artisan[];
        const artisan = artisans.find(a => a.id === artisanId);
        return artisan?.bio || null;
    } catch (error) {
        console.error('Failed to read or parse artisans.json:', error);
        return null;
    }
}

export default async function StoryAssistantPage() {
    const cookieStore = await cookies();
    const authSession = cookieStore.get('auth-session');
    let artisanId: string | null = null;

    if (authSession && authSession.value.startsWith('artisan:')) {
        artisanId = authSession.value.split(':')[1];
    }

    const artisanBio = artisanId ? await getArtisanBio(artisanId) : null;

    return <StoryAssistantClientPage artisanBio={artisanBio} />;
}