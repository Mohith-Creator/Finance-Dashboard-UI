export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Healthcare'
  | 'Education'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  description: string;
  deletedAt?: string;
}

export type UserRole = 'viewer' | 'admin';

export interface AppState {
  transactions: Transaction[];
  role: UserRole;
  darkMode: boolean;
}