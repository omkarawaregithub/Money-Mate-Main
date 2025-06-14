// src/lib/transactionUtils.ts
import type { Transaction, Currency } from '@/types';
import { format, parseISO } from 'date-fns';

export function formatCurrency(amount: number, currencyCode: Currency): string {
  // This check is a safeguard, but the primary fix is in useTransactions ensuring currencyCode is always valid.
  if (!currencyCode || (currencyCode !== 'USD' && currencyCode !== 'INR')) {
    console.warn(`Invalid or missing currencyCode ("${currencyCode}") in formatCurrency. Defaulting to USD display for amount: ${amount}.`);
    // Fallback to a default or throw error, depending on desired strictness.
    // For display, a non-crashing fallback might be preferable.
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Fallback currency
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string, dateFormat = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), dateFormat);
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; 
  }
}

export function groupTransactionsByCategory(transactions: Transaction[]): Record<string, number> {
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);
}

export function getCategoryLabel(categoryValue: string, type: 'income' | 'expense'): string {
    const { incomeCategories, expenseCategories } = require('@/types'); 
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    const found = categories.find((cat: {value: string, label: string}) => cat.value === categoryValue);
    return found ? found.label : categoryValue;
}
