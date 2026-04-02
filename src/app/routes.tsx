import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';
import { DeletedTransactions } from './pages/DeletedTransactions';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: 'transactions',
        Component: Transactions,
      },
      {
        path: 'insights',
        Component: Insights,
      },
      {
        path: 'deleted',
        Component: DeletedTransactions,
      },
    ],
  },
]);