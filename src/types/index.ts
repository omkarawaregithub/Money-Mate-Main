// src/types/index.ts

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string; // e.g., Salary, Groceries, Utilities
  amount: number;
  date: string; // ISO string for simplicity, e.g., "2024-07-28"
  description?: string;
}

export interface UserProfile { // Basic user profile for now
  name: string;
  email: string;
}

export const incomeCategories = [
  { value: "salary", label: "Salary" },
  { value: "bonus", label: "Bonus" },
  { value: "freelance", label: "Freelance" },
  { value: "investment", label: "Investment" },
  { value: "gift", label: "Gift" },
  { value: "other", label: "Other" },
] as const;

export const expenseCategories = [
  { value: "food", label: "Food & Dining" },
  { value: "groceries", label: "Groceries" },
  { value: "rent", label: "Rent/Mortgage" },
  { value: "utilities", label: "Utilities" },
  { value: "transportation", label: "Transportation" },
  { value: "health", label: "Health & Wellness" },
  { value: "entertainment", label: "Entertainment" },
  { value: "shopping", label: "Shopping" },
  { value: "education", label: "Education" },
  { value: "travel", label: "Travel" },
  { value: "other", label: "Other" },
] as const;

export type IncomeCategory = typeof incomeCategories[number]['value'];
export type ExpenseCategory = typeof expenseCategories[number]['value'];
