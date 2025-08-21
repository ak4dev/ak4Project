import { HashRouter, BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Mode } from '@cloudscape-design/global-styles';

import { USE_BROWSER_ROUTER } from './common/constants';
import { StorageHelper } from './common/helpers/storage-helper';
import DashboardPage from './pages/dashboard/dashboard-page';
import NotFound from './pages/not-found';
import InvestmentCalculatorLayout from './pages/investment-calculator/investment-calc-layout';
import './styles/app.scss';

/**
 * Main Application Component
 * 
 * Handles routing configuration and theme management for the entire application.
 * Uses either HashRouter or BrowserRouter based on configuration.
 * 
 * Routes:
 * - "/" - Dashboard page with investment calculator
 * - "/investment-calculator" - Dedicated investment calculator layout
 * - "*" - 404 Not Found page
 */
export default function App() {
  // Select router type based on configuration
  const Router = USE_BROWSER_ROUTER ? BrowserRouter : HashRouter;
  
  // Force dark mode theme application
  StorageHelper.applyTheme(Mode.Dark);

  return (
    <div style={{ height: '100%' }}>
      <Router>
        <Routes>
          {/* Main dashboard route */}
          <Route index path="/" element={<DashboardPage />} />
          
          {/* Investment calculator nested routes */}
          <Route path="/investment-calculator" element={<Outlet />}>
            <Route path="" element={<InvestmentCalculatorLayout />} />
          </Route>
          
          {/* Catch-all route for 404 pages */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}
