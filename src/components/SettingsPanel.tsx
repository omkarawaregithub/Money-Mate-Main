// src/components/SettingsPanel.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SlidersHorizontalIcon } from 'lucide-react';
import { useState, type Dispatch, type SetStateAction, FormEvent } from 'react';

interface SettingsPanelProps {
  resetDay: number;
  setResetDay: Dispatch<SetStateAction<number>>;
  currentUsage: number;
  setCurrentUsage: Dispatch<SetStateAction<number>>;
  totalQuota: number;
  setTotalQuota: Dispatch<SetStateAction<number>>;
}

export default function SettingsPanel({
  resetDay,
  setResetDay,
  currentUsage,
  setCurrentUsage,
  totalQuota,
  setTotalQuota,
}: SettingsPanelProps) {
  const [localResetDay, setLocalResetDay] = useState(resetDay.toString());
  const [localCurrentUsage, setLocalCurrentUsage] = useState(currentUsage.toString());
  const [localTotalQuota, setLocalTotalQuota] = useState(totalQuota.toString());

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newResetDay = parseInt(localResetDay, 10);
    if (!isNaN(newResetDay) && newResetDay >= 1 && newResetDay <= 31) {
      setResetDay(newResetDay);
    }
    const newCurrentUsage = parseInt(localCurrentUsage, 10);
    if (!isNaN(newCurrentUsage) && newCurrentUsage >= 0) {
      setCurrentUsage(newCurrentUsage);
    }
    const newTotalQuota = parseInt(localTotalQuota, 10);
    if (!isNaN(newTotalQuota) && newTotalQuota > 0) {
      setTotalQuota(newTotalQuota);
    }
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <SlidersHorizontalIcon className="mr-2 h-6 w-6 text-primary" />
          Configuration
        </CardTitle>
        <CardDescription>
          Adjust your Copilot quota settings. Your reset day is saved automatically.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resetDay" className="font-medium">Quota Reset Day of Month</Label>
            <Input
              id="resetDay"
              type="number"
              min="1"
              max="31"
              value={localResetDay}
              onChange={(e) => setLocalResetDay(e.target.value)}
              className="transition-colors focus:border-primary"
              aria-describedby="resetDayHelp"
            />
            <p id="resetDayHelp" className="text-xs text-muted-foreground">
              Enter the day your quota typically resets (e.g., 1 for the 1st).
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentUsage" className="font-medium">Current Usage</Label>
            <Input
              id="currentUsage"
              type="number"
              min="0"
              value={localCurrentUsage}
              onChange={(e) => setLocalCurrentUsage(e.target.value)}
              className="transition-colors focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalQuota" className="font-medium">Total Quota</Label>
            <Input
              id="totalQuota"
              type="number"
              min="1"
              value={localTotalQuota}
              onChange={(e) => setLocalTotalQuota(e.target.value)}
              className="transition-colors focus:border-primary"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full sm:w-auto transition-transform hover:scale-105">Update Settings</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
