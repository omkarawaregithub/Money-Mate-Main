// src/app/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { calculateNextResetDate, calculateTimeRemaining, type TimeRemaining } from '@/lib/dateUtils';
import CountdownDisplay from '@/components/CountdownDisplay';
import UsageVisualizer from '@/components/UsageVisualizer';
import EncouragementEngine from '@/components/EncouragementEngine';
import SettingsPanel from '@/components/SettingsPanel';
import { Separator } from '@/components/ui/separator';
import { BotIcon } from 'lucide-react'; // MoneyMate logo icon

const OPTIMAL_USAGE_SUGGESTIONS = "Try to make the most of each Copilot interaction. Explore batching similar queries or refining prompts for more precise answers. Remember, every query is a step towards mastery!";

export default function MoneyMatePage() {
  const [resetDay, setResetDay] = useLocalStorage<number>('moneyMate_resetDay', 1);
  const [currentUsage, setCurrentUsage] = useState<number>(0);
  const [totalQuota, setTotalQuota] = useState<number>(100);

  const [nextResetDate, setNextResetDate] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [daysUntilReset, setDaysUntilReset] = useState<number>(0);

  const [encouragementMessage, setEncouragementMessage] = useState<string | null>(null);
  const [isLoadingEncouragement, setIsLoadingEncouragement] = useState<boolean>(true);
  
  // Calculate next reset date whenever resetDay changes
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure this runs client-side
        const date = calculateNextResetDate(resetDay);
        setNextResetDate(date);
    }
  }, [resetDay]);

  // Update countdown timer every second
  useEffect(() => {
    if (!nextResetDate || typeof window === 'undefined') return;

    const updateTimer = () => {
      const remaining = calculateTimeRemaining(nextResetDate);
      setTimeRemaining(remaining);
      if (remaining) {
        setDaysUntilReset(remaining.days);
         if (remaining.totalMilliseconds <= 0) {
           // Quota has reset, recalculate next reset date for the new cycle
           const newNextResetDate = calculateNextResetDate(resetDay);
           setNextResetDate(newNextResetDate);
         }
      }
    };
    
    updateTimer(); // Initial call
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [nextResetDate, resetDay]);

  const remainingAllowances = useMemo(() => Math.max(0, totalQuota - currentUsage), [totalQuota, currentUsage]);

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="py-6 px-4 sm:px-6 lg:px-8 shadow-md bg-card">
        <div className="max-w-6xl mx-auto flex items-center space-x-3">
          <BotIcon className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold font-headline text-primary">MoneyMate</h1>
          <span className="text-sm text-muted-foreground pt-1">Your Copilot Quota Companion</span>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel - takes up 1/3 on large screens */}
          <div className="lg:col-span-1 space-y-6">
            <SettingsPanel
              resetDay={resetDay}
              setResetDay={setResetDay}
              currentUsage={currentUsage}
              setCurrentUsage={setCurrentUsage}
              totalQuota={totalQuota}
              setTotalQuota={setTotalQuota}
            />
          </div>

          {/* Main Info Panels - takes up 2/3 on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <CountdownDisplay timeRemaining={timeRemaining} daysUntilReset={daysUntilReset} />
            <UsageVisualizer currentUsage={currentUsage} totalQuota={totalQuota} />
            <EncouragementEngine
              remainingAllowances={remainingAllowances}
              optimalUsageSuggestions={OPTIMAL_USAGE_SUGGESTIONS}
              isLoading={isLoadingEncouragement}
              setIsLoading={setIsLoadingEncouragement}
              message={encouragementMessage}
              setMessage={setEncouragementMessage}
            />
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-muted-foreground text-sm bg-card border-t">
        <p>&copy; {new Date().getFullYear()} MoneyMate. Stay productive!</p>
      </footer>
    </div>
  );
}
