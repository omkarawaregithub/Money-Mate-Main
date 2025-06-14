// src/hooks/useTransactions.ts
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Transaction, Currency } from '@/types';
import useLocalStorage from './useLocalStorage';
import { useAppSettingsContext } from '@/context/AppSettingsContext';

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
  const { appSettings } = useAppSettingsContext();
  const globalAppCurrency = appSettings.currency;

  useEffect(() => {
    const defaultCurrencyForMigration: Currency = 'USD'; 
    
    const migrated = localStorageTransactions.map(tx => {
      if (typeof tx !== 'object' || tx === null || !tx.id) {
        // Return null for malformed entries so they can be filtered out
        return null;
      }
      if (!tx.currency || (typeof tx.currency === 'string' && !['USD', 'INR'].includes(tx.currency as Currency))) {
        return { ...tx, currency: defaultCurrencyForMigration };
      }
      return tx;
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

  const { totalIncome, totalExpenses } = processedTransactions.reduce(
    (acc, transaction) => {
      // Only sum transactions matching the global app currency for dashboard summary
      if (transaction.currency === globalAppCurrency) {
        if (transaction.type === 'income') {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpenses += transaction.amount;
        }
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
