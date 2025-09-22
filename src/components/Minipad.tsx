"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import IdeaSubmissionForm from "~/components/IdeaSubmissionForm";
import IdeasBoard from "~/components/IdeasBoard";
import { useIdeas } from "~/hooks/useIdeas";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";
import { useEAS } from "~/hooks/useEAS";

export default function Minipad() {
  const [activeTab, setActiveTab] = useState("ideas");
  const { addIdea } = useIdeas();
  const { context } = useMiniAppSdk();
  const { transactionHash } = useEAS();

  const handleIdeaSubmitted = () => {
    // Switch to ideas board after successful submission
    setActiveTab("ideas");
  };

  const userAddress = context?.user?.fid?.toString() || "user-" + Math.random().toString(16).slice(2, 8);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Minipad</h1>
        <p className="text-muted-foreground">
          Submit ideas for miniapps, vote on favorites, and claim projects to build
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ideas">Ideas Board</TabsTrigger>
          <TabsTrigger value="submit">Submit Idea</TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="mt-6">
          <IdeasBoard />
        </TabsContent>

        <TabsContent value="submit" className="mt-6">
          <div className="flex justify-center">
            <IdeaSubmissionForm onSuccess={handleIdeaSubmitted} />
          </div>
        </TabsContent>
      </Tabs>

      {transactionHash && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Latest Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs font-mono break-all text-muted-foreground">
              {transactionHash}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}