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
const INITIALIZED_KEY = "minipad_initialized";

const INITIAL_IDEAS: Omit<Idea, 'id' | 'timestamp' | 'upvotes' | 'claimed'>[] = [
  {
    title: "Token Investment Mini App",
    description: "Mini app to invest tokens I receive as tips in my wallet to ETH/BTC/xyz tokens I want to hold long-term",
    submitter: "hellno.eth",
  },
  {
    title: "Karaoke Mini App",
    description: "Karaoke mini app for singing and sharing performances",
    submitter: "dummie.eth",
  },
  {
    title: "Most Engaged Cast",
    description: "A mini app that shows your most engaged cast",
    submitter: "bombaymalayali",
  },
  {
    title: "Mini App Recognition Quiz",
    description: "A mini app quizzing people on how many mini apps they recognize",
    submitter: "patriciaxlee.eth",
  },
  {
    title: "Sudoku Mini App",
    description: "Sudoku mini app for puzzle solving",
    submitter: "kimmy",
  },
  {
    title: "Onchain Notifications",
    description: "Onchain notifications mini app: subscribe to a contract event, get a notification on Farcaster",
    submitter: "horsefacts.eth",
  },
  {
    title: "Farcaster Passport",
    description: "Your Life as a Map mini app",
    submitter: "elvi",
  },
  {
    title: "Space-themed Deck Builder",
    description: "Deck building mini app game. Magic the Gathering but with a space theme",
    submitter: "dwr.eth",
  },
  {
    title: "Civ Style Mini App",
    description: "Civilization style strategy mini app",
    submitter: "dwr.eth",
  },
  {
    title: "Subcast Mini App",
    description: "Subcast mini app for managing subscriptions",
    submitter: "esteez.eth",
  },
  {
    title: "Dating Mini App",
    description: "Dating mini app for connecting people",
    submitter: "rish, linda",
  },
  {
    title: "Top 9 Banner Generator",
    description: "Top 9 banner generator mini app",
    submitter: "horsefacts.eth",
  },
  {
    title: "Strudel Music Creator",
    description: "strudel.cc as a mini-app to create and share music on farcaster",
    submitter: "alvesjtiago.eth",
  },
  {
    title: "Goodreads Mini App",
    description: "Goodreads-style book tracking and recommendations mini app",
    submitter: "patriciaxlee.eth",
  },
  {
    title: "Trollbox Mini App",
    description: "Trollbox mini app for anonymous chat",
    submitter: "horsefacts.eth",
  },
  {
    title: "Friends Birthday Calendar",
    description: "Calendar with the birthday of your friends mini app",
    submitter: "cryptowenmoon.eth",
  },
  {
    title: "Tokenized Stocks",
    description: "Tokenized stocks mini app for trading",
    submitter: "0xcaso",
  },
  {
    title: "Operation Game with Haptics",
    description: "Operation mini app game with haptics",
    submitter: "linda",
  },
  {
    title: "Backgammon Mini App",
    description: "Backgammon mini app for playing the classic board game",
    submitter: "northchop",
  },
  {
    title: "Minecraft Mini App",
    description: "Minecraft as a mini app",
    submitter: "dwr.eth",
  },
  {
    title: "Cast Activity Tracker",
    description: "Mini app that shows a breakdown of who's sending the most casts in the last 24h from people you follow",
    submitter: "pugson",
  },
  {
    title: "Weather Mini App",
    description: "Weather mini app for checking forecasts",
    submitter: "dwr.eth",
  },
  {
    title: "Tower Defense",
    description: "Farcaster tower defense mini app",
    submitter: "stevedv.eth",
  },
  {
    title: "Community Storefront",
    description: "A cute little mini app / virtual storefront linking to all the physical products made by the Farcaster community",
    submitter: "patriciaxlee.eth",
  },
  {
    title: "Master Calendar",
    description: "Master calendar where interesting events are aggregated",
    submitter: "alinaferry",
  },
  {
    title: "Tax Software",
    description: "Tax software mini app",
    submitter: "dwr.eth",
  },
  {
    title: "Habbo Hotel / Gather Town",
    description: "Habbo Hotel / Gather dot town mini app",
    submitter: "dwr.eth, matthew",
  },
  {
    title: "No Man's Sky LoFi",
    description: "No Man's Sky LoFi mini app",
    submitter: "dwr.eth",
  },
  {
    title: "Luma Event Wrapper",
    description: "Wrap any Luma event with a mini app",
    submitter: "dwr.eth",
  },
  {
    title: "Feature Request Voting",
    description: "Mini app with the top feature requests and let users rank choice vote",
    submitter: "jacy",
  },
  {
    title: "Omegle Mini App",
    description: "Omegle-style random chat mini app",
    submitter: "kaito",
  },
  {
    title: "Creator Earnings Analytics",
    description: "Miniapp that shows analytics about my creator earnings across coins on @zora, posts on @rodeodotclub, etc",
    submitter: "jessepollak",
  },
];

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
      const isInitialized = localStorage.getItem(INITIALIZED_KEY);

      if (storedIdeas) {
        setIdeas(JSON.parse(storedIdeas));
      } else if (!isInitialized) {
        // Initialize with predefined ideas on first run
        const initialIdeas = INITIAL_IDEAS.map((idea, index) => ({
          ...idea,
          id: `initial-${index}`,
          timestamp: Date.now() - (INITIAL_IDEAS.length - index) * 1000 * 60 * 5, // Stagger timestamps by 5 minutes each
          upvotes: 0,
          claimed: false,
        }));
        setIdeas(initialIdeas);
        localStorage.setItem(INITIALIZED_KEY, 'true');
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