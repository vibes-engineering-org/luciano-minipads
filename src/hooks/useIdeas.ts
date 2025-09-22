"use client";

import { useState, useEffect } from "react";

export interface Idea {
  id: string;
  title: string;
  description: string;
  attestationUID?: string;
  submitter: string;
  timestamp: number;
  upvotes: number;
  claimed: boolean;
  claimedBy?: string;
  remixes?: Remix[];
}

export interface Remix {
  id: string;
  originalIdeaId: string;
  title: string;
  description: string;
  changes: string;
  attestationUID?: string;
  submitter: string;
  timestamp: number;
}

export interface Upvote {
  ideaId: string;
  voter: string;
  attestationUID?: string;
  timestamp: number;
}

const STORAGE_KEY = "minipad_ideas";
const UPVOTES_KEY = "minipad_upvotes";
const REMIXES_KEY = "minipad_remixes";

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [upvotes, setUpvotes] = useState<Upvote[]>([]);
  const [remixes, setRemixes] = useState<Remix[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedIdeas = localStorage.getItem(STORAGE_KEY);
      const storedUpvotes = localStorage.getItem(UPVOTES_KEY);
      const storedRemixes = localStorage.getItem(REMIXES_KEY);

      if (storedIdeas) {
        setIdeas(JSON.parse(storedIdeas));
      }
      if (storedUpvotes) {
        setUpvotes(JSON.parse(storedUpvotes));
      }
      if (storedRemixes) {
        setRemixes(JSON.parse(storedRemixes));
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
    }
  }, [ideas]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(UPVOTES_KEY, JSON.stringify(upvotes));
    }
  }, [upvotes]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(REMIXES_KEY, JSON.stringify(remixes));
    }
  }, [remixes]);

  const addIdea = (title: string, description: string, submitter: string, attestationUID?: string) => {
    const newIdea: Idea = {
      id: Date.now().toString(),
      title,
      description,
      submitter,
      timestamp: Date.now(),
      upvotes: 0,
      claimed: false,
      attestationUID,
    };

    setIdeas(prev => [newIdea, ...prev]);
    return newIdea.id;
  };

  const upvoteIdea = (ideaId: string, voter: string, attestationUID?: string) => {
    // Check if user already upvoted this idea
    const existingUpvote = upvotes.find(u => u.ideaId === ideaId && u.voter === voter);
    if (existingUpvote) {
      return false; // Already upvoted
    }

    const newUpvote: Upvote = {
      ideaId,
      voter,
      attestationUID,
      timestamp: Date.now(),
    };

    setUpvotes(prev => [...prev, newUpvote]);

    // Update idea upvote count
    setIdeas(prev => prev.map(idea =>
      idea.id === ideaId
        ? { ...idea, upvotes: idea.upvotes + 1 }
        : idea
    ));

    return true;
  };

  const claimIdea = (ideaId: string, claimedBy: string) => {
    setIdeas(prev => prev.map(idea =>
      idea.id === ideaId
        ? { ...idea, claimed: true, claimedBy }
        : idea
    ));
  };

  const addRemix = (originalIdeaId: string, title: string, description: string, changes: string, submitter: string, attestationUID?: string) => {
    const newRemix: Remix = {
      id: Date.now().toString(),
      originalIdeaId,
      title,
      description,
      changes,
      submitter,
      timestamp: Date.now(),
      attestationUID,
    };

    setRemixes(prev => [...prev, newRemix]);
    return newRemix.id;
  };

  // Get ideas sorted by upvotes (ProductHunt style)
  const getSortedIdeas = () => {
    return [...ideas].sort((a, b) => b.upvotes - a.upvotes);
  };

  // Get remixes for a specific idea
  const getRemixesForIdea = (ideaId: string) => {
    return remixes.filter(remix => remix.originalIdeaId === ideaId);
  };

  // Check if user has upvoted an idea
  const hasUserUpvoted = (ideaId: string, voter: string) => {
    return upvotes.some(u => u.ideaId === ideaId && u.voter === voter);
  };

  return {
    ideas: getSortedIdeas(),
    upvotes,
    remixes,
    addIdea,
    upvoteIdea,
    claimIdea,
    addRemix,
    getRemixesForIdea,
    hasUserUpvoted,
  };
}