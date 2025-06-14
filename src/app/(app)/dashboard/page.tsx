
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
    <div className="space-y-8">
      <DashboardSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />
      {/* 
        The following sections have been removed as per the request:
        - Overview title and Add Transaction button
        - Recent Transactions list
        - Quick Report section
        
        These functionalities are available on other dedicated pages 
        (e.g., Transactions page for adding/viewing transactions, Reports page for reports).
      */}
    </div>
  );
}
