// src/lib/transactionUtils.ts
import type { Transaction, Currency } from '@/types';
import { format, parseISO } from 'date-fns';

export function formatCurrency(amount: number, currencyCode: Currency): string {
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
    return dateString; // fallback to original string if parsing fails
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
    const { incomeCategories, expenseCategories } = require('@/types'); // Use require for dynamic access if needed or import directly
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    const found = categories.find((cat: {value: string, label: string}) => cat.value === categoryValue);
    return found ? found.label : categoryValue;
}
