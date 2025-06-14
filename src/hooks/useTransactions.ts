// src/hooks/useTransactions.ts
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react'; // Added useEffect and useState
import { v4 as uuidv4 } from 'uuid';
import type { Transaction, Currency } from '@/types';
import useLocalStorage from './useLocalStorage';
import { useAppSettingsContext } from '@/context/AppSettingsContext';

const TRANSACTIONS_STORAGE_KEY = 'moneyMate_transactions';

// The data passed to addTransaction will now include currency
// Transaction type itself has currency, so Omit<Transaction, 'id' | 'date'> includes currency
type AddTransactionData = Omit<Transaction, 'id' | 'date'> & { date: Date };

interface UseTransactionsReturn {
  transactions: Transaction[];
  addTransaction: (newTransactionData: AddTransactionData) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (updatedTransaction: Transaction) => void;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  setTransactions: Dispatch<SetStateAction<Transaction[]>>; // This will update localStorageTransactions
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
    // Migrate transactions loaded from localStorage or initial props
    const defaultCurrencyForMigration: Currency = 'USD'; // Default for old transactions missing currency
    
    const migrated = localStorageTransactions.map(tx => {
      // Check if currency property exists and is valid, otherwise assign default
      if (!tx.currency || (tx.currency !== 'USD' && tx.currency !== 'INR')) {
        return { ...tx, currency: defaultCurrencyForMigration };
      }
      return tx;
    });
    setProcessedTransactions(migrated);
  }, [localStorageTransactions]); // Rerun migration if localStorageTransactions data changes

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
      // This updates localStorageTransactions, which then triggers the useEffect for processing
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

  const { totalIncome, totalExpenses, balance } = processedTransactions.reduce(
    (acc, transaction) => {
      if (transaction.currency === globalAppCurrency) {
        if (transaction.type === 'income') {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpenses += transaction.amount;
        }
      }
      acc.balance = acc.totalIncome - acc.totalExpenses;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, balance: 0 }
  );
  
  return {
    transactions: processedTransactions, // Return the migrated/processed transactions
    addTransaction,
    deleteTransaction,
    updateTransaction,
    totalIncome,
    totalExpenses,
    balance,
    setTransactions: setLocalStorageTransactions, // Expose setter for localStorage raw data
  };
}
