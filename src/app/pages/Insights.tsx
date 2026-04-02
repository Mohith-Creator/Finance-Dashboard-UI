import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import {
  getHighestSpendingCategory,
  getMonthlyTrend,
  getSpendingByCategory,
  formatCurrency,
  calculateTotalExpenses,
  calculateTotalIncome,
} from '../utils/calculations';

export function Insights() {
  const { transactions } = useApp();

  const monthlyTrend = getMonthlyTrend(transactions);
  const spendingByCategory = getSpendingByCategory(transactions);
  const highestSpending = getHighestSpendingCategory(transactions);

  // Calculate insights
  const lastTwoMonths = monthlyTrend.slice(-2);
  const currentMonth = lastTwoMonths[1] || { income: 0, expenses: 0, balance: 0 };
  const previousMonth = lastTwoMonths[0] || { income: 0, expenses: 0, balance: 0 };

  const incomeChange =
    previousMonth.income > 0
      ? ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100
      : 0;

  const expenseChange =
    previousMonth.expenses > 0
      ? ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100
      : 0;

  const averageMonthlyExpense =
    monthlyTrend.length > 0
      ? monthlyTrend.reduce((sum, m) => sum + m.expenses, 0) / monthlyTrend.length
      : 0;

  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Find biggest expense
  const biggestExpense = transactions
    .filter((t) => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)[0];

  // Calculate daily average
  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No insights available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add some transactions to see your financial insights
          </p>
        </div>
      </div>
    );
  }

  const dates = transactions.map((t) => new Date(t.date).getTime());
  const daysDiff = Math.ceil((Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24)) || 1;
  const dailyAverageExpense = totalExpenses / daysDiff;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Insights</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Key observations from your financial data
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Savings Rate</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {savingsRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {savingsRate > 20 ? 'Excellent savings!' : savingsRate > 10 ? 'Good progress' : 'Consider saving more'}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Avg. Daily Expense</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(dailyAverageExpense)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Over {daysDiff} days</p>
        </div>

        <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Income Change</h3>
          </div>
          <p
            className={`text-2xl font-bold mb-1 ${
              incomeChange >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {incomeChange >= 0 ? '+' : ''}
            {incomeChange.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">vs. previous month</p>
        </div>

        <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Expense Change</h3>
          </div>
          <p
            className={`text-2xl font-bold mb-1 ${
              expenseChange <= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {expenseChange >= 0 ? '+' : ''}
            {expenseChange.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">vs. previous month</p>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Spending Category */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Highest Spending Category
          </h3>
          {highestSpending ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {highestSpending.category}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Total spent in this category
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(highestSpending.amount)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {((highestSpending.amount / totalExpenses) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {spendingByCategory.slice(0, 5).map((category, index) => (
                  <div key={category.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(category.value)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0
                            ? 'bg-red-500'
                            : index === 1
                            ? 'bg-orange-500'
                            : index === 2
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${(category.value / highestSpending.amount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
          )}
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Monthly Comparison
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Month</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {lastTwoMonths[1]?.month || 'N/A'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Income</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(currentMonth.income)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Expenses</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(currentMonth.expenses)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Balance</span>
                  <span
                    className={`font-bold ${
                      currentMonth.balance >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatCurrency(currentMonth.balance)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Previous Month</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {lastTwoMonths[0]?.month || 'N/A'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Income</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(previousMonth.income)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Expenses</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(previousMonth.expenses)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Balance</span>
                  <span
                    className={`font-bold ${
                      previousMonth.balance >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatCurrency(previousMonth.balance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key Observations</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <p className="text-gray-900 dark:text-white font-medium">Average Monthly Expense</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Your average monthly expense is {formatCurrency(averageMonthlyExpense)} across{' '}
                {monthlyTrend.length} month{monthlyTrend.length !== 1 ? 's' : ''}.
              </p>
            </div>
          </div>

          {biggestExpense && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Largest Single Expense</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {formatCurrency(biggestExpense.amount)} spent on "{biggestExpense.description}" in{' '}
                  {biggestExpense.category} category.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
            <div>
              <p className="text-gray-900 dark:text-white font-medium">Savings Goal Progress</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {savingsRate >= 20
                  ? 'Excellent! You are saving more than 20% of your income.'
                  : savingsRate >= 10
                  ? 'Good job! You are saving between 10-20% of your income.'
                  : savingsRate >= 0
                  ? 'Consider reducing expenses to increase your savings rate.'
                  : 'Warning: Your expenses exceed your income. Review your budget.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
            <div>
              <p className="text-gray-900 dark:text-white font-medium">Spending Pattern</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {expenseChange > 10
                  ? 'Your expenses have increased significantly this month. Review discretionary spending.'
                  : expenseChange > 0
                  ? 'Your expenses have slightly increased this month.'
                  : expenseChange === 0
                  ? 'Your expenses remained stable this month.'
                  : 'Great! Your expenses decreased compared to last month.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}