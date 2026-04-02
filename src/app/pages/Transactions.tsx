import { useState, useMemo } from 'react';
import { Plus, Search, Filter, Edit, Trash2, ArrowUpDown, Download } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Transaction } from '../types';
import { TransactionForm } from '../components/TransactionForm';
import { formatCurrency, formatDate } from '../utils/calculations';

type SortField = 'date' | 'amount' | 'category';
type SortOrder = 'asc' | 'desc';

export function Transactions() {
  const { transactions, role, deleteTransaction, exportTransactions } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, searchQuery, filterType, filterCategory, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredAndSortedTransactions.length} transaction
            {filteredAndSortedTransactions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 top-12 z-20 bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#2d3548] rounded-lg shadow-xl py-2 w-40">
                  <button
                    onClick={() => {
                      exportTransactions('csv');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#252b42] text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      exportTransactions('json');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#252b42] text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    Export as JSON
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Add Transaction Button */}
          {role === 'admin' && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#2d3548] rounded-lg bg-white dark:bg-[#252b42] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-[#2d3548] rounded-lg bg-white dark:bg-[#252b42] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none appearance-none"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-[#2d3548] rounded-lg bg-white dark:bg-[#252b42] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortField(field as SortField);
                setSortOrder(order as SortOrder);
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-[#2d3548] rounded-lg bg-white dark:bg-[#252b42] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none appearance-none"
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
              <option value="category-asc">Category (A-Z)</option>
              <option value="category-desc">Category (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredAndSortedTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No transactions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filterType !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your filters'
                : role === 'admin'
                ? 'Get started by adding your first transaction'
                : 'No transactions available'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
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
                  {role === 'admin' && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          transaction.type === 'income'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        transaction.type === 'income'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </td>
                    {role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Edit transaction"
                          >
                            <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Delete transaction"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      {showForm && <TransactionForm onClose={handleCloseForm} transaction={editingTransaction} />}
    </div>
  );
}