
// src/app/(app)/dashboard/page.tsx
"use client";

import useTransactions from '@/hooks/useTransactions';
import DashboardSummary from '@/components/moneymate/DashboardSummary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const { 
    totalIncome, 
    totalExpenses, 
    balance 
  } = useTransactions();

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-semibold">Dashboard Overview</CardTitle>
              <CardDescription>A quick glance at your financial health.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Here's a summary of your total income, expenses, and current balance. 
            Use the sidebar to navigate to other sections like adding transactions or viewing detailed reports.
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
