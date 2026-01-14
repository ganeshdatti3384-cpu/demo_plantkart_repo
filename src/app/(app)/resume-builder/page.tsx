'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateResumeAction } from './actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader, Copy, FileText, Wand2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader className="mr-2 animate-spin" />}
      Generate Resume
    </Button>
  );
}

export default function ResumeBuilderPage() {
  const initialState = { message: null, result: null, error: false };
  const [state, dispatch] = useActionState(generateResumeAction, initialState);
  const { toast } = useToast();
  const [option, setOption] = useState('optimize');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.error ? 'Error' : 'Success',
        description: state.message,
        variant: state.error ? 'destructive' : 'default',
      });
    }
  }, [state, toast]);
  
  const handleCopy = () => {
    if (state.result) {
        navigator.clipboard.writeText(state.result).then(() => {
            toast({
                title: 'Copied!',
                description: 'Resume content copied to clipboard.',
            })
        })
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">AI Resume Builder</h1>
            <p className="text-muted-foreground">
              Optimize your resume for the Australian market or create a new one from scratch.
            </p>
        </div>

        <form ref={formRef} action={dispatch} className="flex flex-col gap-6">
          <RadioGroup
            name="option"
            defaultValue="optimize"
            value={option}
            onValueChange={setOption}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Card className="relative shadow-md">
              <RadioGroupItem value="optimize" id="optimize" className="peer sr-only" />
              <Label
                htmlFor="optimize"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-transparent bg-card p-4 hover:bg-accent/20 cursor-pointer peer-data-[state=checked]:border-primary h-full"
              >
                <Wand2 className="w-8 h-8 mb-4 text-primary"/>
                <p className="font-semibold text-center">Optimize Existing Resume</p>
              </Label>
            </Card>
            <Card className="relative shadow-md">
              <RadioGroupItem value="create" id="create" className="peer sr-only" />
              <Label
                htmlFor="create"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-transparent bg-card p-4 hover:bg-accent/20 cursor-pointer peer-data-[state=checked]:border-primary h-full"
              >
                 <FileText className="w-8 h-8 mb-4 text-primary"/>
                <p className="font-semibold text-center">Create From Scratch</p>
              </Label>
            </Card>
          </RadioGroup>

          <Card className="shadow-md">
            <CardContent className="pt-6">
                {option === 'optimize' && (
                <div className="grid gap-2">
                    <Label htmlFor="resumeText">Your Resume Content</Label>
                    <Textarea
                    id="resumeText"
                    name="resumeText"
                    placeholder="Paste your resume content here..."
                    className="min-h-[150px] md:min-h-[200px] bg-secondary"
                    />
                </div>
                )}
                
                <div className="grid gap-2 mt-4">
                    <Label htmlFor="jobDescription">Target Job Description</Label>
                    <Textarea
                    id="jobDescription"
                    name="jobDescription"
                    placeholder="Paste the job description here..."
                    className="min-h-[150px] md:min-h-[200px] bg-secondary"
                    required
                    />
                </div>
            </CardContent>
             <CardFooter className="justify-end">
                <SubmitButton />
             </CardFooter>
          </Card>
        </form>
      </div>

      <div className="flex flex-col gap-6 lg:h-[calc(100vh-10rem)]">
        <h2 className="text-2xl font-bold font-headline">Generated Resume</h2>
        <Card className="flex-grow shadow-md flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Result</CardTitle>
             {state.result && <Button variant="ghost" size="icon" onClick={handleCopy}><Copy className="h-4 w-4" /></Button>}
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {useFormStatus().pending ? (
                <div className="flex flex-col items-center justify-center flex-1">
                    <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Generating your resume...</p>
                </div>
            ) : state.result ? (
                <ScrollArea className="flex-1">
                    <pre className="whitespace-pre-wrap font-body text-sm bg-secondary p-4 rounded-md">
                        {state.result}
                    </pre>
                </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-4" />
                <p>Your generated resume will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
