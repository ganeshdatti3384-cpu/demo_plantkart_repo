"use server";

import { generateResumeFromScratch } from "@/ai/flows/generate-resume-from-scratch";
import { optimizeResumeForAustralianMarket } from "@/ai/flows/optimize-resume-australian-market";
import { z } from "zod";

const resumeSchema = z.object({
  resumeText: z.string().optional(),
  jobDescription: z.string().min(20, "Job description must be at least 20 characters."),
  option: z.enum(["optimize", "create"]),
});

type State = {
  message?: string | null;
  result?: string | null;
  error?: boolean;
}

export async function generateResumeAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = resumeSchema.safeParse({
    resumeText: formData.get("resumeText"),
    jobDescription: formData.get("jobDescription"),
    option: formData.get("option"),
  });

  if (!validatedFields.success) {
    const firstError = validatedFields.error.flatten().fieldErrors.jobDescription?.[0];
    return {
      message: firstError || 'Invalid input. Please check the fields.',
      error: true,
    };
  }

  const { resumeText, jobDescription, option } = validatedFields.data;

  if (option === 'optimize' && (!resumeText || resumeText.length < 50)) {
    return {
      message: 'Please provide a resume with at least 50 characters to optimize.',
      error: true,
    }
  }

  try {
    if (option === 'create') {
      const { resume } = await generateResumeFromScratch({ jobDescription });
      return { message: "Resume created successfully.", result: resume, error: false };
    } else {
      // The schema ensures resumeText is present for the 'optimize' option.
      const { optimizedResume } = await optimizeResumeForAustralianMarket({
        resumeText: resumeText!,
        jobDescription,
      });
      return { message: "Resume optimized successfully.", result: optimizedResume, error: false };
    }
  } catch (e: any) {
    console.error(e);
    return { message: e.message || "An unexpected error occurred. Please try again.", error: true };
  }
}
