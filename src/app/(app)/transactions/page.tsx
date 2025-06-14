
// src/app/(app)/transactions/page.tsx
"use client";

import { useState } from 'react';
import useTransactions from '@/hooks/useTransactions';
import AddTransactionDialog from '@/components/moneymate/AddTransactionDialog';
import TransactionHistory from '@/components/moneymate/TransactionHistory';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Transaction } from '@/types';

export default function TransactionsPage() {
  const { 
    transactions, 
    addTransaction, 
    deleteTransaction, 
    updateTransaction 
  } = useTransactions();

  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleOpenAddTransactionDialog = (transaction?: Transaction) => {
    if (transaction && transaction.id) { // Ensure transaction object is valid
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Transactions</h2>
        <Button onClick={() => handleOpenAddTransactionDialog()} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Transaction
        </Button>
      </div>

      <AddTransactionDialog
        isOpen={isAddTransactionOpen}
        onClose={handleCloseAddTransactionDialog}
        addTransaction={addTransaction}
        updateTransaction={updateTransaction}
        existingTransaction={editingTransaction}
      />
      
      <TransactionHistory 
        transactions={transactions} 
        onEditTransaction={handleOpenAddTransactionDialog}
        onDeleteTransaction={deleteTransaction}
      />
    </div>
  );
}
