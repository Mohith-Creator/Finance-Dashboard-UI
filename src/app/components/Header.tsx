import { Moon, Sun, User, TrendingUp } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { UserRole } from "../types";
import { useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

export function Header() {
  const { role, setRole, darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard if viewer tries to access deleted transactions
  useEffect(() => {
    if (role === "viewer" && location.pathname === "/deleted") {
      navigate("/");
    }
  }, [role, location.pathname, navigate]);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    // If switching to viewer and currently on deleted page, redirect
    if (newRole === "viewer" && location.pathname === "/deleted") {
      navigate("/");
    }
  };

  return (
    <header className="border-b border-gray-200 dark:border-[#2d3548] bg-gradient-to-r from-slate-50 to-blue-50 dark:from-[#0f1419] dark:to-[#13182b] shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20">
                <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white dark:border-[#13182b]"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                FinanceFlow
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Smart Financial Management
              </p>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {/* Role Switcher */}
            <div className="relative group">
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-[#1a1f2e] rounded-xl border-2 border-gray-200 dark:border-[#2d3548] shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div className="relative min-w-[120px]">
                  <Select
                    value={role}
                    onValueChange={(newValue) =>
                      handleRoleChange(newValue as UserRole)
                    }
                  >
                    <SelectTrigger
                      className="bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#2d3548] text-gray-900 dark:text-gray-100 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200"
                      size="sm"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Role Badge */}
              <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {role === "admin" ? "👑" : "👤"}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative p-2.5 rounded-xl bg-white dark:bg-[#1a1f2e] border-2 border-gray-200 dark:border-[#2d3548] shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200 group"
              aria-label="Toggle dark mode"
            >
              <div className="relative w-6 h-6">
                {darkMode ? (
                  <Sun
                    className="w-6 h-6 text-amber-500 group-hover:rotate-90 transition-transform duration-300"
                    strokeWidth={2.5}
                  />
                ) : (
                  <Moon
                    className="w-6 h-6 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300"
                    strokeWidth={2.5}
                  />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
