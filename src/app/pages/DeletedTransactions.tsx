import { RotateCcw, Trash2, AlertCircle } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { formatCurrency, formatDate } from "../utils/calculations";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function DeletedTransactions() {
  const {
    deletedTransactions,
    restoreTransaction,
    permanentlyDeleteTransaction,
    role,
  } = useApp();
  const navigate = useNavigate();

  // Redirect viewers away from this page
  useEffect(() => {
    if (role === "viewer") {
      navigate("/");
    }
  }, [role, navigate]);

  // If user is viewer, don't render anything (will redirect)
  if (role === "viewer") {
    return null;
  }

  const handleRestore = (id: string) => {
    if (window.confirm("Do you want to restore this transaction?")) {
      restoreTransaction(id);
    }
  };

  const handlePermanentDelete = (id: string) => {
    if (
      window.confirm(
        "This will permanently delete the transaction and cannot be undone. Are you sure?",
      )
    ) {
      permanentlyDeleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Deleted Transactions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {deletedTransactions.length} deleted transaction
          {deletedTransactions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-amber-900 dark:text-amber-200">
              Transaction History
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Deleted transactions are stored here. You can restore them or
              permanently delete them. Restored transactions will appear back in
              your transaction list.
            </p>
          </div>
        </div>
      </div>

      {/* Deleted Transactions List */}
      <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] overflow-hidden">
        {deletedTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-[#252b42] rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No deleted transactions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Deleted transactions will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#252b42] border-b border-gray-200 dark:border-[#2d3548]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Deleted At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-[#2d3548]">
                {deletedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#1e2538] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-[#252b42] text-gray-700 dark:text-gray-300">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          transaction.type === "income"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {transaction.deletedAt
                        ? formatDate(transaction.deletedAt)
                        : "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRestore(transaction.id)}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#252b42] transition-colors"
                          aria-label="Restore transaction"
                          title="Restore transaction"
                        >
                          <RotateCcw className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(transaction.id)}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#252b42] transition-colors"
                          aria-label="Permanently delete"
                          title="Permanently delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
