"use client";

import Minipad from "~/components/Minipad";
import { Toaster } from "~/components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* TEMPLATE_CONTENT_START - Replace content below */}
      <Minipad />
      {/* TEMPLATE_CONTENT_END */}
      <Toaster />
    </div>
  );
}
