"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useEAS } from "~/hooks/useEAS";
import { useToast } from "~/hooks/use-toast";
import { useIdeas } from "~/hooks/useIdeas";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";

const ideaSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be under 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be under 1000 characters"),
});

type IdeaFormData = z.infer<typeof ideaSchema>;

interface IdeaSubmissionFormProps {
  onSuccess?: () => void;
}

export default function IdeaSubmissionForm({ onSuccess }: IdeaSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { attestIdea, isLoading, isSuccess, transactionHash } = useEAS();
  const { addIdea } = useIdeas();
  const { context } = useMiniAppSdk();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
  });

  const onSubmit = async (data: IdeaFormData) => {
    try {
      setIsSubmitting(true);

      const userAddress = context?.user?.fid?.toString() || "user-" + Math.random().toString(16).slice(2, 8);

      // Add to local storage first
      const ideaId = addIdea(data.title, data.description, userAddress);

      try {
        // Then attempt to attest to blockchain
        await attestIdea({
          title: data.title,
          description: data.description,
        });
      } catch (attestError) {
        console.warn("Attestation failed, but idea saved locally:", attestError);
      }

      toast({
        title: "Idea Submitted!",
        description: "Your idea has been saved and will be attested to the blockchain.",
      });

      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting idea:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = isSubmitting || isLoading;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Submit Your Miniapp Idea</CardTitle>
        <CardDescription>
          Share your idea for a new miniapp. It will be attested to the blockchain for transparency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("title")}
              placeholder="Enter your idea title"
              disabled={loading}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Textarea
              {...register("description")}
              placeholder="Describe your miniapp idea in detail..."
              rows={4}
              disabled={loading}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Idea"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}