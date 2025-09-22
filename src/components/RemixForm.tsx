"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useIdeas, type Idea } from "~/hooks/useIdeas";
import { useEAS } from "~/hooks/useEAS";
import { useToast } from "~/hooks/use-toast";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";

const remixSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be under 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be under 1000 characters"),
  changes: z.string().min(10, "Please describe what changes you're making").max(500, "Changes description must be under 500 characters"),
});

type RemixFormData = z.infer<typeof remixSchema>;

interface RemixFormProps {
  idea: Idea;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RemixForm({ idea, open, onOpenChange }: RemixFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addRemix } = useIdeas();
  const { attestRemix, isLoading } = useEAS();
  const { context } = useMiniAppSdk();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RemixFormData>({
    resolver: zodResolver(remixSchema),
    defaultValues: {
      title: `${idea.title} (Remix)`,
      description: idea.description,
      changes: "",
    },
  });

  const onSubmit = async (data: RemixFormData) => {
    try {
      setIsSubmitting(true);

      const userAddress = context?.user?.fid?.toString() || "user-" + Math.random().toString(16).slice(2, 8);

      // Add remix to local storage
      const remixId = addRemix(
        idea.id,
        data.title,
        data.description,
        data.changes,
        userAddress
      );

      try {
        // Attempt to attest to blockchain
        await attestRemix({
          originalIdeaUID: idea.attestationUID || idea.id,
          title: data.title,
          description: data.description,
          changes: data.changes,
        });
      } catch (attestError) {
        console.warn("Remix attestation failed, but saved locally:", attestError);
      }

      toast({
        title: "Remix Created!",
        description: "Your remix has been created and will be attested to the blockchain.",
      });

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating remix:", error);
      toast({
        title: "Remix Failed",
        description: "There was an error creating your remix. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = isSubmitting || isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Remix Idea</DialogTitle>
          <DialogDescription>
            Create a variation or expansion of &quot;{idea.title}&quot;
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("title")}
              placeholder="Enter your remix title"
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
              placeholder="Describe your remix..."
              rows={3}
              disabled={loading}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Textarea
              {...register("changes")}
              placeholder="What changes are you making to the original idea?"
              rows={3}
              disabled={loading}
              className={errors.changes ? "border-red-500" : ""}
            />
            {errors.changes && (
              <p className="text-sm text-red-500 mt-1">{errors.changes.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Remix"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}