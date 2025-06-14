// src/components/CountdownDisplay.tsx
"use client";

import type { TimeRemaining } from '@/lib/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimerIcon } from 'lucide-react';

interface CountdownDisplayProps {
  timeRemaining: TimeRemaining | null;
  daysUntilReset: number;
}

export default function CountdownDisplay({ timeRemaining, daysUntilReset }: CountdownDisplayProps) {
  if (!timeRemaining) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TimerIcon className="mr-2 h-6 w-6 text-primary" />
            Quota Reset Countdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Calculating reset date...</p>
        </CardContent>
      </Card>
    );
  }

  const { days, hours, minutes, seconds } = timeRemaining;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <TimerIcon className="mr-2 h-6 w-6 text-primary" />
          Quota Resets In
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timeRemaining.totalMilliseconds <= 0 ? (
           <p className="text-2xl font-semibold text-accent">Quota has reset!</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-4">
              <div>
                <p className="text-4xl font-bold text-primary">{String(days).padStart(2, '0')}</p>
                <p className="text-xs text-muted-foreground">Days</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">{String(hours).padStart(2, '0')}</p>
                <p className="text-xs text-muted-foreground">Hours</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">{String(minutes).padStart(2, '0')}</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">{String(seconds).padStart(2, '0')}</p>
                <p className="text-xs text-muted-foreground">Seconds</p>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Approximately <span className="font-semibold text-foreground">{daysUntilReset}</span> day(s) until your Copilot quota refreshes.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
