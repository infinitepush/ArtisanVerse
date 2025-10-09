'use client';

export const dynamic = 'force-dynamic';

import { useActionState, useEffect, useState, useRef, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { formAction, saveProductAction } from './actions';
import { PenSquare, Loader2, Upload, X, RotateCcw, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { GenerateProductDetailsOutput } from '@/ai/flows/generate-product-details';

const initialState = {
  message: null,
  errors: null,
  generatedDetails: null,
};

function GenerateButton() {
  const { pending } = useFormStatus();
  return (
      <Button type="submit" disabled={pending} className="w-full" name="intent" value="generate">
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <PenSquare className="mr-2 h-4 w-4" />
        )}
        Generate Details
      </Button>
  );
}

function ImagePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    if (!preview) return null;

    return (
        <div className="relative w-full h-full">
            <Image src={preview} alt="preview" fill className="rounded-md object-cover" />
            <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={onRemove}>
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}

export default function ProductGeneratorPage() {
  const [generateState, formActionFn] = useActionState(formAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  
  const { toast } = useToast();
  
  const [keywords, setKeywords] = useState('');
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  
  const [generatedDetails, setGeneratedDetails] = useState<GenerateProductDetailsOutput | null>(null);
  const [isSaving, startSaveTransition] = useTransition();


  useEffect(() => {
    if (generateState.message) {
      if (generateState.generatedDetails) {
        setGeneratedDetails(generateState.generatedDetails);
      } else if (generateState.errors) {
        const errorMessages = Object.values(generateState.errors).flat().join(' ');
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: generateState.message + ' ' + errorMessages,
        });
      } else if (generateState.message !== 'Product details generated successfully.') {
         toast({
            variant: "destructive",
            title: "Error",
            description: generateState.message,
        });
      }
    }
  }, [generateState, toast]);

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles[index] = null;
    setFiles(newFiles);
    if(fileInputRefs[index].current) {
        fileInputRefs[index].current!.value = '';
    }
  }

  const handleStartOver = () => {
    setKeywords('');
    setFiles([null, null, null]);
    setGeneratedDetails(null);
    formRef.current?.reset();
    fileInputRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
    });
  };

  const handleSaveProduct = async () => {
    if (!generatedDetails || !files[0]) {
        toast({
            variant: "destructive",
            title: "Cannot Save",
            description: "Please generate details and ensure at least one image is uploaded before saving."
        });
        return;
    }

    const formData = new FormData();
    const generatedForm = formRef.current;
    if (generatedForm) {
      formData.append('title', new FormData(generatedForm).get('title') || '');
      formData.append('description', new FormData(generatedForm).get('description') || '');
      formData.append('seoTags', new FormData(generatedForm).get('seoTags') || '');
    }
    
    formData.append('keywords', keywords);
    files.forEach((file, index) => {
      if (file) {
        formData.append(`image${index + 1}`, file);
      }
    });
    
    startSaveTransition(async () => {
        try {
            await saveProductAction(formData);
            toast({
                title: "Product Saved!",
                description: "Your new product has been added to your store."
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: error.message || 'An unexpected error occurred.',
            });
        }
    });
  };


  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold font-headline">AI Product Generator</h1>
         <Button variant="outline" onClick={handleStartOver}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Start Over
        </Button>
      </div>
      <p className="text-muted-foreground mb-8">Upload photos and keywords to generate compelling product details, then save the product to your store.</p>
      
      <form action={formActionFn} ref={formRef}>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
              <CardTitle>1. Product Inputs</CardTitle>
              <CardDescription>Provide at least one image and some keywords.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-3">
                <Label>Product Images (up to 3)</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="relative aspect-square border-2 border-dashed rounded-md flex items-center justify-center bg-muted/50">
                      <Input
                        ref={fileInputRefs[i]}
                        id={`image${i+1}`}
                        name={`image${i+1}`}
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleFileChange(i, e)}
                        accept="image/png, image/jpeg"
                      />
                      {files[i] ? (
                        <ImagePreview file={files[i]!} onRemove={() => removeFile(i)} />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
                 {generateState.errors?.image1 && <p className="text-sm font-medium text-destructive">{generateState.errors.image1[0]}</p>}
               </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input id="keywords" name="keywords" placeholder="e.g., Rustic, hand-thrown, stoneware, blue glaze" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
                {generateState.errors?.keywords && <p className="text-sm font-medium text-destructive">{generateState.errors.keywords[0]}</p>}
              </div>
            </CardContent>
            <CardFooter>
                 <GenerateButton />
            </CardFooter>
        </Card>

        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>2. Generated Details</CardTitle>
                <CardDescription>Your AI-crafted product details will appear here. Review and edit them before saving.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6">
                {useFormStatus().pending && !generatedDetails ? (
                    <div className="bg-muted rounded-md h-full min-h-[200px] p-4 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : generatedDetails ? (
                    <>
                        <input type="hidden" name="keywords" value={keywords} />
                        <div>
                            <Label className="text-lg font-semibold">Title</Label>
                            <Input name="title" className="mt-1 text-2xl font-headline h-auto bg-muted p-3 rounded-md" defaultValue={generatedDetails.title} />
                        </div>
                        <div>
                            <Label className="text-lg font-semibold">Description</Label>
                             <Textarea name="description" rows={6} className="mt-1 text-base whitespace-pre-wrap bg-muted p-3 rounded-md" defaultValue={generatedDetails.description} />
                        </div>
                        <div>
                            <Label className="text-lg font-semibold">SEO Tags</Label>
                            <Input name="seoTags" className="mt-2" defaultValue={generatedDetails.seoTags.join(', ')} />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {generatedDetails.seoTags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                     <div className="bg-muted rounded-md h-full min-h-[200px] p-4 flex items-center justify-center">
                        <p className="text-muted-foreground">Waiting for input...</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                {generatedDetails && (
                    <Button 
                        type="button"
                        onClick={handleSaveProduct}
                        variant="secondary" 
                        className="w-full"
                        disabled={isSaving}
                    >
                    {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Product
                    </Button>
                )}
            </CardFooter>
        </Card>
      </div>
      </form>
    </div>
  );
}