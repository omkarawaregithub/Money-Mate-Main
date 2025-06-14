// src/components/EncouragementEngine.tsx
"use client";

import { useEffect, useState } from 'react';
import { generateEncouragementMessage, type GenerateEncouragementMessageInput } from '@/ai/flows/generate-encouragement-message';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LightbulbIcon, AlertTriangleIcon } from 'lucide-react'; // Using LightbulbIcon for encouragement

interface EncouragementEngineProps {
  remainingAllowances: number;
  optimalUsageSuggestions: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  message: string | null;
  setMessage: (message: string | null) => void;
}

export default function EncouragementEngine({
  remainingAllowances,
  optimalUsageSuggestions,
  isLoading,
  setIsLoading,
  message,
  setMessage,
}: EncouragementEngineProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEncouragement() {
      if (remainingAllowances < 0) { // Don't fetch if remaining allowances is negative (e.g. usage > quota)
        setMessage("You've exceeded your quota. The next cycle will bring new opportunities!");
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const input: GenerateEncouragementMessageInput = {
          remainingAllowances,
          optimalUsageSuggestions,
        };
        const result = await generateEncouragementMessage(input);
        setMessage(result.encouragementMessage);
      } catch (err) {
        console.error("Error generating encouragement message:", err);
        setError("Oops! Couldn't fetch an encouraging message right now. Try again later.");
        setMessage(null);
      } finally {
        setIsLoading(false);
      }
    }

    // Debounce or control refetch frequency if needed, for now fetches on relevant prop changes
    fetchEncouragement();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingAllowances, optimalUsageSuggestions]); // Dependencies explicitly set

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <LightbulbIcon className="mr-2 h-6 w-6 text-primary" />
          Your Daily Dose of Motivation
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[100px]">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <div className="flex items-center text-destructive">
            <AlertTriangleIcon className="mr-2 h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : (
          <p className="text-sm text-foreground leading-relaxed">{message}</p>
        )}
      </CardContent>
    </Card>
  );
}
