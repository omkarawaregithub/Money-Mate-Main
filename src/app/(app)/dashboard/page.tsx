// src/app/(app)/dashboard/page.tsx
"use client";

import useTransactions from '@/hooks/useTransactions';
import DashboardSummary from '@/components/moneymate/DashboardSummary';

export default function DashboardPage() {
  const { 
    totalIncome, 
    totalExpenses, 
    balance 
  } = useTransactions();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Dashboard
      </h1>
      <DashboardSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />
    </div>
  );
}
