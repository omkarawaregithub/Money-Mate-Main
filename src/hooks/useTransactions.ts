// src/hooks/useTransactions.ts
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Transaction, Currency } from '@/types'; // Currency type needed
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
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
}

export default function useTransactions(initialTransactions: Transaction[] = []): UseTransactionsReturn {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    TRANSACTIONS_STORAGE_KEY,
    initialTransactions
  );
  const { appSettings } = useAppSettingsContext();
  const globalAppCurrency = appSettings.currency;

  const addTransaction = useCallback(
    (newTransactionData: AddTransactionData) => {
      const newTransaction: Transaction = {
        id: uuidv4(),
        type: newTransactionData.type,
        category: newTransactionData.category,
        amount: newTransactionData.amount,
        date: newTransactionData.date.toISOString().split('T')[0], // Store date as YYYY-MM-DD
        description: newTransactionData.description,
        currency: newTransactionData.currency, // Store the transaction's specific currency
      };
      setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
    },
    [setTransactions]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id)
      );
    },
    [setTransactions]
  );

  const updateTransaction = useCallback(
    (updatedTransaction: Transaction) => {
      // Ensure the updatedTransaction has its date in YYYY-MM-DD string format if it's coming from the form as a Date object
      // The form in AddTransactionDialog already handles this conversion before calling updateTransaction
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === updatedTransaction.id ? updatedTransaction : transaction
        )
      );
    },
    [setTransactions]
  );

  const { totalIncome, totalExpenses, balance } = transactions.reduce(
    (acc, transaction) => {
      // Only include transactions that match the global app currency in summary totals
      if (transaction.currency === globalAppCurrency) {
        if (transaction.type === 'income') {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpenses += transaction.amount;
        }
      }
      // Balance is calculated based on the summed income and expenses of the global currency
      acc.balance = acc.totalIncome - acc.totalExpenses;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, balance: 0 }
  );
  
  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    totalIncome,
    totalExpenses,
    balance,
    setTransactions,
  };
}
