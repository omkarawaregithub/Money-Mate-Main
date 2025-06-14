
// src/app/(app)/dashboard/page.tsx
"use client";

import useTransactions from '@/hooks/useTransactions';
import DashboardSummary from '@/components/moneymate/DashboardSummary';
import TransactionHistory from '@/components/moneymate/TransactionHistory';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import ReportsSection from '@/components/moneymate/ReportsSection'; // For a quick overview

export default function DashboardPage() {
  const { 
    transactions, 
    deleteTransaction, 
    updateTransaction, 
    totalIncome, 
    totalExpenses, 
    balance 
  } = useTransactions();

  // For "Recent Transactions" on dashboard, limit the number shown
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8">
      <DashboardSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <Button asChild size="lg">
          <Link href="/transactions">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Transaction
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
           {transactions.length > 0 ? (
            <TransactionHistory 
                transactions={recentTransactions} 
                onEditTransaction={(transaction) => {
                  // For dashboard, editing might redirect to full transactions page or open a modal
                  // For simplicity, let's assume it behaves like the main transactions page for now
                  // This would ideally be handled by navigating to /transactions with edit state
                  // Or by making AddTransactionDialog a global modal solution
                  console.log("Edit transaction from dashboard:", transaction.id);
                  // For a real app, you'd open the edit modal here, perhaps by pushing to /transactions?edit=id
                }}
                onDeleteTransaction={deleteTransaction}
            />
           ) : (
            <p className="text-muted-foreground p-4 text-center bg-card rounded-md shadow">No recent transactions. <Link href="/transactions" className="text-primary hover:underline">Add one now!</Link></p>
           )}
           {transactions.length > 5 && (
             <div className="mt-4 text-center">
               <Button variant="outline" asChild>
                 <Link href="/transactions">View All Transactions</Link>
               </Button>
             </div>
           )}
        </div>
        <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Quick Report</h3>
            <ReportsSection transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
