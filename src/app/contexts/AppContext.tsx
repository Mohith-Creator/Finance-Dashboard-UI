import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Transaction, UserRole } from "../types";
import { mockTransactions } from "../data/mockTransactions";

interface AppContextType {
  transactions: Transaction[];
  deletedTransactions: Transaction[];
  role: UserRole;
  darkMode: boolean;
  setRole: (role: UserRole) => void;
  toggleDarkMode: () => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  restoreTransaction: (id: string) => void;
  permanentlyDeleteTransaction: (id: string) => void;
  exportTransactions: (format: "csv" | "json") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Load from localStorage or use defaults
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem("finance-transactions");
    return stored ? JSON.parse(stored) : mockTransactions;
  });

  const [deletedTransactions, setDeletedTransactions] = useState<Transaction[]>(
    () => {
      const stored = localStorage.getItem("finance-deletedTransactions");
      return stored ? JSON.parse(stored) : [];
    },
  );

  const [role, setRole] = useState<UserRole>(() => {
    const stored = localStorage.getItem("finance-role");
    return (stored as UserRole) || "admin";
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem("finance-darkMode");
    return stored ? JSON.parse(stored) : false;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("finance-transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(
      "finance-deletedTransactions",
      JSON.stringify(deletedTransactions),
    );
  }, [deletedTransactions]);

  useEffect(() => {
    localStorage.setItem("finance-role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("finance-darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  };

  const deleteTransaction = (id: string) => {
    const deleted = transactions.find((t) => t.id === id);
    if (deleted) {
      const withDeletedAt: Transaction = {
        ...deleted,
        deletedAt: new Date().toISOString(),
      };
      setDeletedTransactions([withDeletedAt, ...deletedTransactions]);
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const restoreTransaction = (id: string) => {
    const restored = deletedTransactions.find((t) => t.id === id);
    if (restored) {
      setTransactions([restored, ...transactions]);
      setDeletedTransactions(deletedTransactions.filter((t) => t.id !== id));
    }
  };

  const permanentlyDeleteTransaction = (id: string) => {
    setDeletedTransactions(deletedTransactions.filter((t) => t.id !== id));
  };

  const exportTransactions = (format: "csv" | "json") => {
    const data = transactions;
    if (format === "csv") {
      const headers = [
        "ID",
        "Date",
        "Amount",
        "Category",
        "Type",
        "Description",
      ];
      const csvData = [
        headers.join(","),
        ...data.map(
          (t) =>
            `${t.id},"${t.date}",${t.amount},"${t.category}","${t.type}","${t.description}"`,
        ),
      ].join("\n");
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        deletedTransactions,
        role,
        darkMode,
        setRole,
        toggleDarkMode,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        restoreTransaction,
        permanentlyDeleteTransaction,
        exportTransactions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
