
// src/app/(app)/dashboard/page.tsx
"use client";

import useTransactions from '@/hooks/useTransactions';
import DashboardSummary from '@/components/moneymate/DashboardSummary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';
import { useAppSettingsContext } from '@/context/AppSettingsContext';

export default function DashboardPage() {
  const { 
    totalIncome, 
    totalExpenses, 
    balance 
  } = useTransactions();
  const { appSettings } = useAppSettingsContext();

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-semibold">Dashboard Overview</CardTitle>
              <CardDescription>
                A quick glance at your financial health. Figures are shown in your selected global currency ({appSettings.currency}).
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This summary reflects totals for transactions matching your global currency setting ({appSettings.currency}). 
            Change your global currency in Settings to see summaries for a different currency.
          </p>
        </CardContent>
      </Card>

      <DashboardSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />
    </div>
  );
}
