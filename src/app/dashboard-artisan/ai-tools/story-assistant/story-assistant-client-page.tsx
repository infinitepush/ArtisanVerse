'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateStoryAction } from './actions';
import { Wand, Loader2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: null,
  errors: null,
  generatedNarrative: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand className="mr-2 h-4 w-4" />
      )}
      Generate Story
    </Button>
  );
}

function FormContent({ state, artisanBio, productName, setProductName, productDescription, setProductDescription, artisanBackground, setArtisanBackground, generatedNarrative, setGeneratedNarrative }) {
    const { pending } = useFormStatus();

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Provide information about your product and yourself to generate a story.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input id="productName" name="productName" placeholder="e.g., Azure Dream Vase" value={productName} onChange={e => setProductName(e.target.value)} />
                    {state.errors?.productName && <p className="text-sm font-medium text-destructive">{state.errors.productName[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="productDescription">Product Description</Label>
                    <Textarea id="productDescription" name="productDescription" placeholder="Materials, craftsmanship, unique features..." value={productDescription} onChange={e => setProductDescription(e.target.value)} />
                    {state.errors?.productDescription && <p className="text-sm font-medium text-destructive">{state.errors.productDescription[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="artisanBackground">Artisan Background</Label>
                    <Textarea id="artisanBackground" name="artisanBackground" placeholder="Your background, inspiration, techniques..." value={artisanBackground} onChange={e => setArtisanBackground(e.target.value)} />
                    {state.errors?.artisanBackground && <p className="text-sm font-medium text-destructive">{state.errors.artisanBackground[0]}</p>}
                </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Generated Narrative</CardTitle>
                    <CardDescription>Your AI-crafted story will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="bg-muted rounded-md h-full min-h-[200px] p-4 text-sm whitespace-pre-wrap flex items-center justify-center">
                        {pending ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : (generatedNarrative ? generatedNarrative : "Waiting for input...")}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" disabled={!generatedNarrative}>Copy to Clipboard</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function StoryAssistantClientPage({ artisanBio }: { artisanBio: string | null }) {
  const [state, formAction] = useActionState(generateStoryAction, initialState);
  const { toast } = useToast();

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [artisanBackground, setArtisanBackground] = useState(artisanBio || '');
  const [generatedNarrative, setGeneratedNarrative] = useState(initialState.generatedNarrative);

  useEffect(() => {
    if (state.message) {
        if (state.generatedNarrative) {
          setGeneratedNarrative(state.generatedNarrative);
        } else if (state.message !== 'Narrative generated successfully.') {
            toast({
                variant: "destructive",
                title: "Error",
                description: state.message,
            });
        }
    }
  }, [state, toast]);

  const handleStartOver = () => {
    setProductName('');
    setProductDescription('');
    setArtisanBackground(artisanBio || '');
    setGeneratedNarrative(null);
    // Reset action state
    state.message = null;
    state.errors = null;
    state.generatedNarrative = null;
  };

  return (
    <div className="p-4 md:p-8">
       <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold font-headline">AI Storytelling Assistant</h1>
        <Button variant="outline" onClick={handleStartOver}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Start Over
        </Button>
      </div>
      <p className="text-muted-foreground mb-8">Craft compelling narratives for your products.</p>
      
      <form action={formAction}>
        <FormContent 
            state={state}
            artisanBio={artisanBio}
            productName={productName}
            setProductName={setProductName}
            productDescription={productDescription}
            setProductDescription={setProductDescription}
            artisanBackground={artisanBackground}
            setArtisanBackground={setArtisanBackground}
            generatedNarrative={generatedNarrative}
            setGeneratedNarrative={setGeneratedNarrative}
        />
      </form>
    </div>
  );
}
