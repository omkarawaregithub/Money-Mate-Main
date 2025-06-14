// src/hooks/useTransactions.ts
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Transaction, Currency } from '@/types';
import useLocalStorage from './useLocalStorage';
// Removed useAppSettingsContext as globalAppCurrency is no longer used for filtering sums here

const TRANSACTIONS_STORAGE_KEY = 'moneyMate_transactions';

type AddTransactionData = Omit<Transaction, 'id' | 'date'> & { date: Date };

interface UseTransactionsReturn {
  transactions: Transaction[];
  addTransaction: (newTransactionData: AddTransactionData) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (updatedTransaction: Transaction) => void;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
}

export default function useTransactions(initialTransactionsFromProp: Transaction[] = []): UseTransactionsReturn {
  const [localStorageTransactions, setLocalStorageTransactions] = useLocalStorage<Transaction[]>(
    TRANSACTIONS_STORAGE_KEY,
    initialTransactionsFromProp
  );
  const [processedTransactions, setProcessedTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const defaultCurrencyForMigration: Currency = 'USD'; 
    
    const migrated = localStorageTransactions.map(tx => {
      if (typeof tx !== 'object' || tx === null || !tx.id) {
        return null; // Filter out malformed entries
      }
      // Ensure currency is valid, otherwise default it
      let currency = tx.currency;
      if (!currency || (typeof currency === 'string' && !['USD', 'INR'].includes(currency as Currency))) {
        currency = defaultCurrencyForMigration;
      }
      return { ...tx, currency: currency as Currency };
    }).filter(Boolean) as Transaction[]; // filter(Boolean) removes any null entries
    
    setProcessedTransactions(migrated);
  }, [localStorageTransactions]);

  const addTransaction = useCallback(
    (newTransactionData: AddTransactionData) => {
      const newTransaction: Transaction = {
        id: uuidv4(),
        type: newTransactionData.type,
        category: newTransactionData.category,
        amount: newTransactionData.amount,
        date: newTransactionData.date.toISOString().split('T')[0],
        description: newTransactionData.description,
        currency: newTransactionData.currency,
      };
      setLocalStorageTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
    },
    [setLocalStorageTransactions]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setLocalStorageTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id)
      );
    },
    [setLocalStorageTransactions]
  );

  const updateTransaction = useCallback(
    (updatedTransaction: Transaction) => {
      setLocalStorageTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === updatedTransaction.id ? updatedTransaction : transaction
        )
      );
    },
    [setLocalStorageTransactions]
  );

  // Calculate totals from ALL processed transactions, regardless of their individual currency
  const { totalIncome, totalExpenses } = processedTransactions.reduce(
    (acc, transaction) => {
      // No longer filtering by globalAppCurrency here
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += transaction.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );
  
  const balance = totalIncome - totalExpenses;
  
  return {
    transactions: processedTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    totalIncome,
    totalExpenses,
    balance,
    setTransactions: setLocalStorageTransactions, 
  };
}
