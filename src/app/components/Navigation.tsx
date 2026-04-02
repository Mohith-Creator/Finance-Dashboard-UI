import { useState } from "react";
import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Trash2,
  Menu,
  X,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";

export function Navigation() {
  const { role } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/transactions", label: "Transactions", icon: Receipt },
    { path: "/insights", label: "Insights", icon: TrendingUp },
    { path: "/deleted", label: "Deleted", icon: Trash2, adminOnly: true },
  ];

  return (
    <nav className="border-b border-gray-200 dark:border-[#2d3548] bg-white dark:bg-[#13182b]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => {
              const isRestricted = item.adminOnly && role !== "admin";
              const baseClasses =
                "flex items-center gap-2 px-5 py-3 border-b-2 transition-all duration-200";

              if (isRestricted) {
                return (
                  <div
                    key={item.path}
                    className={`${baseClasses} border-transparent text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-[#192033] opacity-70 cursor-not-allowed`}
                    title="Admin only"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `${baseClasses} ${
                      isActive
                        ? "border-emerald-500 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1f2e]"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#2d3548] shadow-sm hover:shadow-md transition-all duration-200"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 p-3 bg-white dark:bg-[#13182b] rounded-xl border border-gray-200 dark:border-[#2d3548] shadow-sm">
            {navItems.map((item) => {
              const isRestricted = item.adminOnly && role !== "admin";
              if (isRestricted) {
                return (
                  <div
                    key={item.path}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#192033] opacity-70"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-150 ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1a1f2e]"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
