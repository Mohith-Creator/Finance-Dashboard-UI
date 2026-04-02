# Finance Dashboard UI

A comprehensive and interactive finance dashboard built with React, TypeScript, and Tailwind CSS. This application helps users track and understand their financial activity through intuitive visualizations and insights.

## 🚀 Features

### Core Functionality

#### 1. Dashboard Overview
- **Summary Cards**: Display Total Balance, Total Income, and Total Expenses with trend indicators
- **Monthly Balance Trend**: Interactive line chart showing income, expenses, and balance over time
- **Spending by Category**: Pie chart visualizing expense distribution across categories
- **Category Breakdown**: Bar chart for detailed category-wise analysis

#### 2. Transactions Management
- **Complete Transaction List**: View all transactions with detailed information (date, amount, category, type, description)
- **Advanced Filtering**: Filter by transaction type (income/expense) and category
- **Smart Search**: Search transactions by description or category
- **Flexible Sorting**: Sort by date, amount, or category in ascending/descending order
- **CRUD Operations** (Admin only):
  - Add new transactions
  - Edit existing transactions
  - Delete transactions
- **Empty State Handling**: Graceful display when no transactions match filters

#### 3. Role-Based Access Control (RBAC)
- **Viewer Role**: Can only view data - no add, edit, or delete permissions
- **Admin Role**: Full access to add, edit, and delete transactions
- **Easy Role Switching**: Toggle between roles via dropdown in header
- **UI Adaptation**: Interface dynamically adjusts based on current role

#### 4. Financial Insights
- **Key Metrics**:
  - Savings Rate calculation
  - Average daily expenses
  - Month-over-month income change
  - Month-over-month expense change
- **Top Spending Analysis**: Identifies highest spending category with visual breakdown
- **Monthly Comparison**: Side-by-side comparison of current vs. previous month
- **Smart Observations**: AI-like insights about spending patterns and savings goals

#### 5. State Management
- **React Context API**: Centralized state management for transactions, user role, and theme
- **Local Storage Persistence**: All data persists across browser sessions
- **Efficient Updates**: Optimized re-renders using useMemo and proper React patterns

### Additional Enhancements

#### Dark Mode
- Full dark mode support with smooth transitions
- Persists user preference in local storage
- Toggle button in header for easy switching

#### Responsive Design
- Mobile-first approach
- Adapts seamlessly to all screen sizes (mobile, tablet, desktop)
- Touch-friendly interface elements
- Responsive tables and charts

#### Data Visualization
- **Recharts Library**: Professional-looking, interactive charts
- **Multiple Chart Types**: Line, Bar, and Pie charts
- **Dark Mode Compatible**: Charts adapt to light/dark theme
- **Tooltips**: Hover for detailed information

#### User Experience
- Clean, modern interface
- Intuitive navigation
- Loading states and transitions
- Form validation
- Confirmation dialogs for destructive actions
- Color-coded transaction types (green for income, red for expenses)

## 🛠️ Technology Stack

- **React 18.3.1**: UI library with hooks
- **TypeScript**: Type-safe code
- **React Router 7**: Client-side routing with Data mode pattern
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **Recharts**: Charting library for data visualization
- **Lucide React**: Icon library
- **Vite**: Fast build tool and dev server

## 📁 Project Structure

```
src/
├── app/
│   ├── components/         # Reusable UI components
│   │   ├── Header.tsx      # App header with role switcher and dark mode
│   │   ├── Navigation.tsx  # Main navigation tabs
│   │   ├── Layout.tsx      # App layout wrapper
│   │   ├── SummaryCard.tsx # Dashboard summary card component
│   │   └── TransactionForm.tsx # Modal form for add/edit transactions
│   ├── contexts/           # React Context providers
│   │   └── AppContext.tsx  # Global state management
│   ├── data/               # Mock data
│   │   └── mockTransactions.ts # Sample transaction data
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Main dashboard with charts
│   │   ├── Transactions.tsx # Transaction list with filters
│   │   └── Insights.tsx    # Financial insights and analysis
|   |   └── DeletedTransaction.tsx
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Shared types
│   ├── utils/              # Utility functions
│   │   └── calculations.ts # Financial calculations and formatting
│   ├── App.tsx             # Root app component
│   └── routes.tsx          # Route configuration
└── styles/                 # Global styles
```

## 🎯 Design Decisions

### State Management
- **React Context API** was chosen for its simplicity and sufficiency for this app's size
- All state is centralized in `AppContext` for easy access across components
- Local storage integration ensures data persistence without a backend

### Role-Based UI
- Frontend-only role simulation using context state
- No backend authentication required
- Easy to extend to real authentication system
- UI elements conditionally rendered based on role

### Data Structure
- Simple, flat transaction structure for easy manipulation
- String-based IDs for simplicity (timestamp-based)
- ISO date format for consistent date handling
- Strongly typed with TypeScript for reliability

### User Experience
- Confirmation dialogs prevent accidental deletions
- Form validation ensures data quality
- Empty states guide users when no data exists
- Responsive design ensures usability on all devices

### Styling Approach
- Tailwind CSS for rapid development and consistency
- Dark mode classes for theme support
- Custom color palette for financial context (green/red for income/expense)
- Responsive utilities for mobile-first design

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

### Development
Run the development server:
```bash
npm run dev
# or
pnpm dev
```

### Build
Build for production:
```bash
npm run build
# or
pnpm build
```

## 💾 Data Persistence

The application uses browser localStorage to persist:
- Transaction data
- User role preference
- Dark mode preference

All data is stored locally and never leaves the browser.

## 🔐 Role-Based Access Control

### Viewer Role
- ✅ View dashboard
- ✅ View transactions
- ✅ View insights
- ✅ Use filters and search
- ❌ Add transactions
- ❌ Edit transactions
- ❌ Delete transactions

### Admin Role
- ✅ All Viewer permissions
- ✅ Add new transactions
- ✅ Edit existing transactions
- ✅ Delete transactions

Switch roles using the dropdown in the header to see the UI adapt accordingly.

## 📊 Mock Data

The app comes pre-loaded with 30 sample transactions spanning 3 months, including:
- Various income sources (Salary, Freelance, Investment)
- Diverse expense categories (Food, Transport, Bills, Entertainment, etc.)
- Realistic amounts and descriptions
- Data distributed across multiple months for meaningful trend analysis

You can add, edit, or delete transactions as needed. To reset to original data, clear browser localStorage.

## 🎨 Customization

### Adding Categories
Edit `TransactionCategory` type in `/src/app/types/index.ts` and update the categories array in `TransactionForm.tsx`.

### Changing Colors
Modify Tailwind classes in components or update the theme in `/src/styles/theme.css`.

### Adding New Insights
Extend calculation functions in `/src/app/utils/calculations.ts` and add new sections to `Insights.tsx`.

## 🧪 Testing Scenarios

### Test Role-Based UI
1. Switch to Viewer role - notice "Add Transaction" button disappears
2. In transaction list, notice action buttons (Edit/Delete) are hidden
3. Switch to Admin role - all controls reappear

### Test Filtering & Sorting
1. Go to Transactions page
2. Use search to find specific transactions
3. Filter by type (Income/Expense)
4. Filter by category
5. Try different sort options

### Test Data Persistence
1. Add a new transaction
2. Refresh the page
3. Verify transaction persists
4. Test with role and dark mode preferences

## 🌟 Future Enhancements

Potential features for production version:
- Backend API integration
- User authentication and authorization
- Multi-user support with separate accounts
- Budget planning and goals
- Recurring transactions
- Export to CSV/PDF
- Receipt upload and attachment
- Multiple currency support
- Bank account integration
- Email notifications
- Advanced analytics and forecasting

## 📝 Notes

- This is a frontend-only demonstration project
- No real backend or authentication is implemented
- Data is stored only in browser localStorage
- Not intended for production use with sensitive financial data
- Mock data is provided for demonstration purposes

## 🙏 Acknowledgments

Built as an assignment to demonstrate frontend development skills with focus on:
- Clean, maintainable code structure
- Thoughtful UI/UX design
- Proper state management
- Responsive design
- TypeScript best practices
- React patterns and hooks
