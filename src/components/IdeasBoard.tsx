"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ChevronUp, Clock, User, GitFork } from "lucide-react";
import { useIdeas, type Idea } from "~/hooks/useIdeas";
import { useEAS } from "~/hooks/useEAS";
import { useToast } from "~/hooks/use-toast";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";
import { useState } from "react";
import RemixForm from "~/components/RemixForm";

interface IdeaCardProps {
  idea: Idea;
  onUpvote: (ideaId: string) => void;
  onClaim: (ideaId: string) => void;
  onRemix: (ideaId: string) => void;
  hasUpvoted: boolean;
  canUpvote: boolean;
}

function IdeaCard({ idea, onUpvote, onClaim, onRemix, hasUpvoted, canUpvote }: IdeaCardProps) {
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{idea.title}</CardTitle>
            <CardDescription className="mt-2">{idea.description}</CardDescription>
          </div>
          <div className="ml-4 flex flex-col items-center">
            <Button
              variant={hasUpvoted ? "default" : "outline"}
              size="sm"
              onClick={() => onUpvote(idea.id)}
              disabled={!canUpvote || hasUpvoted}
              className="flex flex-col items-center px-3 py-2 h-auto"
            >
              <ChevronUp className="h-4 w-4" />
              <span className="text-xs font-semibold">{idea.upvotes}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{idea.submitter.slice(0, 8)}...</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(idea.timestamp)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {idea.claimed && (
              <Badge variant="secondary">
                Claimed by {idea.claimedBy?.slice(0, 8)}...
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemix(idea.id)}
            >
              <GitFork className="h-3 w-3 mr-1" />
              Remix
            </Button>
            {!idea.claimed && (
              <Button
                size="sm"
                onClick={() => onClaim(idea.id)}
              >
                Claim
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function IdeasBoard() {
  const { ideas, upvoteIdea, claimIdea, hasUserUpvoted } = useIdeas();
  const { attestUpvote, attestClaim } = useEAS();
  const { toast } = useToast();
  const { sdk, context } = useMiniAppSdk();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [remixDialogOpen, setRemixDialogOpen] = useState(false);
  const [selectedIdeaForRemix, setSelectedIdeaForRemix] = useState<Idea | null>(null);

  // Get user address from SDK context
  const userAddress = context?.user?.fid?.toString() || "user-" + Math.random().toString(16).slice(2, 8); // Use FID as identifier

  const handleUpvote = async (ideaId: string) => {
    if (hasUserUpvoted(ideaId, userAddress)) {
      toast({
        title: "Already Upvoted",
        description: "You have already upvoted this idea.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingAction(`upvote-${ideaId}`);

      // Create attestation for upvote
      await attestUpvote({ ideaAttestationUID: ideaId });

      // Update local state
      upvoteIdea(ideaId, userAddress);

      toast({
        title: "Upvoted!",
        description: "Your upvote has been attested to the blockchain.",
      });
    } catch (error) {
      console.error("Error upvoting:", error);
      toast({
        title: "Upvote Failed",
        description: "There was an error recording your upvote.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleClaim = async (ideaId: string) => {
    try {
      setLoadingAction(`claim-${ideaId}`);

      // Create attestation for claim
      await attestClaim({
        ideaAttestationUID: ideaId,
        builderAddress: userAddress,
        status: "claimed",
      });

      // Update local state
      claimIdea(ideaId, userAddress);

      toast({
        title: "Idea Claimed!",
        description: "You have successfully claimed this idea. Start building!",
      });
    } catch (error) {
      console.error("Error claiming:", error);
      toast({
        title: "Claim Failed",
        description: "There was an error claiming this idea.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemix = (ideaId: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
      setSelectedIdeaForRemix(idea);
      setRemixDialogOpen(true);
    }
  };

  if (ideas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No ideas submitted yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Ideas Board</h2>
        <Badge variant="outline">{ideas.length} ideas</Badge>
      </div>
      <div className="space-y-4">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onUpvote={handleUpvote}
            onClaim={handleClaim}
            onRemix={handleRemix}
            hasUpvoted={hasUserUpvoted(idea.id, userAddress)}
            canUpvote={loadingAction !== `upvote-${idea.id}`}
          />
        ))}
      </div>

      {selectedIdeaForRemix && (
        <RemixForm
          idea={selectedIdeaForRemix}
          open={remixDialogOpen}
          onOpenChange={(open) => {
            setRemixDialogOpen(open);
            if (!open) {
              setSelectedIdeaForRemix(null);
            }
          }}
        />
      )}
    </div>
  );
}