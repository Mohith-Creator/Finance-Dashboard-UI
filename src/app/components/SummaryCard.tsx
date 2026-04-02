import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconColor: string;
  iconBgColor: string;
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  trend,
  iconColor,
  iconBgColor,
}: SummaryCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-200 dark:border-[#2d3548] p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </p>
          {trend && (
            <p
              className={`text-sm ${
                trend.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trend.value}
            </p>
          )}
        </div>
        <div
          className={`${iconBgColor} p-3 rounded-lg`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}