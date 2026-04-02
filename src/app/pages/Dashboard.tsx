import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { SummaryCard } from '../components/SummaryCard';
import {
  calculateBalance,
  calculateTotalIncome,
  calculateTotalExpenses,
  getSpendingByCategory,
  getMonthlyTrend,
  formatCurrency,
} from '../utils/calculations';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#6366f1',
  '#f97316',
  '#14b8a6',
];

export function Dashboard() {
  const { transactions, darkMode } = useApp();

  const balance = calculateBalance(transactions);
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  const spendingByCategory = getSpendingByCategory(transactions);
  const monthlyTrend = getMonthlyTrend(transactions);

  // Calculate trends
  const lastTwoMonths = monthlyTrend.slice(-2);
  const incomeChange =
    lastTwoMonths.length === 2
      ? ((lastTwoMonths[1].income - lastTwoMonths[0].income) / lastTwoMonths[0].income) * 100
      : 0;
  const expenseChange =
    lastTwoMonths.length === 2
      ? ((lastTwoMonths[1].expenses - lastTwoMonths[0].expenses) / lastTwoMonths[0].expenses) * 100
      : 0;

  const chartColors = {
    text: darkMode ? '#9ca3af' : '#6b7280',
    grid: darkMode ? '#2d3548' : '#e5e7eb',
    tooltip: darkMode ? '#1a1f2e' : '#ffffff',
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(balance)}
          icon={Wallet}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        />
        <SummaryCard
          title="Total Income"
          value={formatCurrency(income)}
          icon={TrendingUp}
          trend={{
            value: `${incomeChange > 0 ? '+' : ''}${incomeChange.toFixed(1)}% from last month`,
            isPositive: incomeChange >= 0,
          }}
          iconColor="text-green-600 dark:text-green-400"
          iconBgColor="bg-green-100 dark:bg-green-900/30"
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(expenses)}
          icon={TrendingDown}
          trend={{
            value: `${expenseChange > 0 ? '+' : ''}${expenseChange.toFixed(1)}% from last month`,
            isPositive: expenseChange < 0,
          }}
          iconColor="text-red-600 dark:text-red-400"
          iconBgColor="bg-red-100 dark:bg-red-900/30"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Monthly Balance Trend
          </h3>
          {monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis
                  dataKey="month"
                  stroke={chartColors.text}
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-');
                    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
                      month: 'short',
                    });
                  }}
                />
                <YAxis stroke={chartColors.text} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartColors.tooltip,
                    border: `1px solid ${chartColors.grid}`,
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Spending by Category */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h3>
          {spendingByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {spendingByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              No expense data available
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown Bar Chart */}
      <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Category Breakdown
        </h3>
        {spendingByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  backgroundColor: chartColors.tooltip,
                  border: `1px solid ${chartColors.grid}`,
                  borderRadius: '8px',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            No expense data available
          </div>
        )}
      </div>
    </div>
  );
}
