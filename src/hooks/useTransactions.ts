// src/hooks/useTransactions.ts
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Transaction, TransactionType } from '@/types';
import useLocalStorage from './useLocalStorage';

const TRANSACTIONS_STORAGE_KEY = 'moneyMate_transactions';

interface UseTransactionsReturn {
  transactions: Transaction[];
  addTransaction: (newTransactionData: Omit<Transaction, 'id' | 'date'> & { date: Date }) => void;
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

  const addTransaction = useCallback(
    (newTransactionData: Omit<Transaction, 'id' | 'date'> & { date: Date }) => {
      const newTransaction: Transaction = {
        ...newTransactionData,
        id: uuidv4(),
        date: newTransactionData.date.toISOString().split('T')[0], // Store date as YYYY-MM-DD
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
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += transaction.amount;
      }
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
