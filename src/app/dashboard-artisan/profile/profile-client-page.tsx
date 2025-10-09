'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wand, Loader2, Save } from 'lucide-react';
import { generateBioAction } from './actions';
import { updateProfileAction, type UpdateProfileState } from './update-profile-action';
import { useToast } from '@/hooks/use-toast';
import type { Artisan } from '@/lib/types';
import Link from 'next/link';

const generateBioInitialState = {
  message: null,
  errors: null,
  generatedBio: null,
};

const saveChangesInitialState: UpdateProfileState = {
  message: null,
  errors: null,
};

function GenerateBioButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} name="intent" value="generateBio" className="w-full">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand className="mr-2 h-4 w-4" />
      )}
      Generate Bio
    </Button>
  );
}

function SaveChangesButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" name="intent" value="saveChanges" disabled={pending}>
            {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
        </Button>
    );
}

export default function ProfileClientPage({ artisan }: { artisan: Artisan | null }) {
    const { toast } = useToast();
    
    const [generateBioState, generateBioFormAction] = useActionState(generateBioAction, generateBioInitialState);
    const [saveChangesState, saveChangesFormAction] = useActionState(updateProfileAction, saveChangesInitialState);

    const formRef = useRef<HTMLFormElement>(null);
    const bioTextareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (generateBioState.message && generateBioState.message !== 'Bio generated successfully.') {
            toast({
                variant: "destructive",
                title: "Error Generating Bio",
                description: generateBioState.message,
            })
        }
    }, [generateBioState, toast]);

    useEffect(() => {
      if (generateBioState.generatedBio && bioTextareaRef.current) {
        bioTextareaRef.current.value = generateBioState.generatedBio;
      }
    }, [generateBioState.generatedBio]);
    
    useEffect(() => {
        if (saveChangesState.message) {
            toast({
                variant: saveChangesState.errors ? "destructive" : "default",
                title: saveChangesState.errors ? "Save Failed" : "Success!",
                description: saveChangesState.message,
            })
        }
    }, [saveChangesState, toast]);

    const handleFormAction = (payload: FormData) => {
        const intent = payload.get('intent');
        if (intent === 'generateBio') {
            const formData = new FormData(formRef.current!);
            // Add artisan name to the form data for the bio generator
            if (artisan) {
                formData.set('artisanName', artisan.name);
            }
            generateBioFormAction(formData);
        } else if (intent === 'saveChanges') {
            saveChangesFormAction(payload);
        }
    };

    if (!artisan) {
        return (
             <div className="p-4 md:p-8">
                <h1 className="text-3xl font-bold font-headline mb-8">Manage Profile</h1>
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        <p>Could not load artisan profile. Please try logging in again.</p>
                        <Button asChild className="mt-4">
                            <Link href="/login-artisan">Return to Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline mb-8">Manage Profile</h1>
            
            <form action={handleFormAction} ref={formRef}>
                 <input type="hidden" name="artisanId" value={artisan.id} />
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>This information will be displayed on your public artisan page.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="artisanName">Full Name</Label>
                                        <Input id="artisanName" name="artisanName" defaultValue={artisan.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" name="email" defaultValue={artisan.email} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="craft">Primary Craft</Label>
                                        <Input id="craft" name="craftType" defaultValue={artisan.craft || ''} placeholder="e.g., Pottery, Weaving" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="region">Region</Label>
                                        <Input id="region" name="region" defaultValue={artisan.region || ''} placeholder="e.g., Tuscany, Italy" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="style">Style</Label>
                                    <Input id="style" name="style" defaultValue={artisan.style || ''} placeholder="e.g., Organic & Ethereal" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Biography</Label>
                                    <Textarea ref={bioTextareaRef} id="bio" name="bio" rows={8} defaultValue={artisan.bio || ''} placeholder="Tell your story. Where do you get your inspiration? What makes your craft unique?"/>
                                </div>
                                <SaveChangesButton />
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>AI Bio Assistant</CardTitle>
                                <CardDescription>Struggling with words? Let us help you craft the perfect bio.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Use your information on the left to generate a new bio.
                                    Provide some keywords or background info below for better results.
                                </p>
                                <div className="space-y-2">
                                    <Label htmlFor="background">Background & Inspiration</Label>
                                    <Textarea id="background" name="background" placeholder="e.g., Inspired by classical sculpture, Mediterranean sea, quiet sunrises..." />
                                </div>
                                <GenerateBioButton />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}
