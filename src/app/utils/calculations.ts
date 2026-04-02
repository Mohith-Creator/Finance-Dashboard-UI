import { Transaction } from "../types";

export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateBalance(transactions: Transaction[]): number {
  return (
    calculateTotalIncome(transactions) - calculateTotalExpenses(transactions)
  );
}

export function getSpendingByCategory(transactions: Transaction[]) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const categoryMap = new Map<string, number>();

  expenses.forEach((t) => {
    const current = categoryMap.get(t.category) || 0;
    categoryMap.set(t.category, current + t.amount);
  });

  return Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getMonthlyTrend(transactions: Transaction[]) {
  const monthMap = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((t) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    const current = monthMap.get(monthKey) || { income: 0, expenses: 0 };

    if (t.type === "income") {
      current.income += t.amount;
    } else {
      current.expenses += t.amount;
    }

    monthMap.set(monthKey, current);
  });

  return Array.from(monthMap.entries())
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      balance: data.income - data.expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getHighestSpendingCategory(transactions: Transaction[]): {
  category: string;
  amount: number;
} | null {
  const spending = getSpendingByCategory(transactions);
  if (spending.length === 0) return null;
  return { category: spending[0].name, amount: spending[0].value };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
