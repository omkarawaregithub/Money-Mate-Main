// src/app/page.tsx
"use client";

import { useState } from 'react';
import useTransactions from '@/hooks/useTransactions';
import AppHeader from '@/components/moneymate/AppHeader';
import DashboardSummary from '@/components/moneymate/DashboardSummary';
import AddTransactionDialog from '@/components/moneymate/AddTransactionDialog';
import TransactionHistory from '@/components/moneymate/TransactionHistory';
import ReportsSection from '@/components/moneymate/ReportsSection';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Transaction } from '@/types';


export default function MoneyMatePage() {
  const { 
    transactions, 
    addTransaction, 
    deleteTransaction, 
    updateTransaction, 
    totalIncome, 
    totalExpenses, 
    balance 
  } = useTransactions();

  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleOpenAddTransactionDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
    } else {
      setEditingTransaction(null);
    }
    setIsAddTransactionOpen(true);
  };

  const handleCloseAddTransactionDialog = () => {
    setIsAddTransactionOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <AppHeader />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <DashboardSummary
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        <div className="mt-8 mb-6 flex justify-end">
          <Button onClick={() => handleOpenAddTransactionDialog()} size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Transaction
          </Button>
        </div>

        <AddTransactionDialog
          isOpen={isAddTransactionOpen}
          onClose={handleCloseAddTransactionDialog}
          addTransaction={addTransaction}
          updateTransaction={updateTransaction}
          existingTransaction={editingTransaction}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2">
            <TransactionHistory 
              transactions={transactions} 
              onEditTransaction={handleOpenAddTransactionDialog}
              onDeleteTransaction={deleteTransaction}
            />
          </div>
          <div className="md:col-span-1">
             <ReportsSection transactions={transactions} />
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-muted-foreground text-sm bg-card border-t">
        <p>&copy; {new Date().getFullYear()} MoneyMate. Your smart expense tracker.</p>
      </footer>
    </div>
  );
}
