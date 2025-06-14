// src/components/UsageVisualizer.tsx
"use client";

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityIcon } from 'lucide-react'; // Using ActivityIcon as a generic usage icon

interface UsageVisualizerProps {
  currentUsage: number;
  totalQuota: number;
}

export default function UsageVisualizer({ currentUsage, totalQuota }: UsageVisualizerProps) {
  const percentage = totalQuota > 0 ? Math.min(100, Math.max(0,(currentUsage / totalQuota) * 100)) : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <ActivityIcon className="mr-2 h-6 w-6 text-primary" />
          Copilot Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex justify-between items-baseline">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{currentUsage.toLocaleString()}</span> used of <span className="font-semibold text-foreground">{totalQuota.toLocaleString()}</span>
          </p>
          <p className="text-lg font-semibold text-primary">{percentage.toFixed(1)}%</p>
        </div>
        <Progress value={percentage} aria-label={`Copilot usage: ${percentage.toFixed(1)}%`} className="h-3 transition-all duration-500 ease-out" />
         {percentage >= 90 && percentage < 100 && (
          <p className="mt-2 text-sm text-yellow-600">Nearing quota limit. Use remaining allowances wisely.</p>
        )}
        {percentage >= 100 && (
          <p className="mt-2 text-sm text-destructive">Quota limit reached.</p>
        )}
      </CardContent>
    </Card>
  );
}
