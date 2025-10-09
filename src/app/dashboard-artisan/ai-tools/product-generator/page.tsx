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
      <div className.tsx
