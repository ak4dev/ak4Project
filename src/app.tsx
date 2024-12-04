import { HashRouter, BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { USE_BROWSER_ROUTER } from './common/constants';
// import GlobalHeader from "./components/global-header";
import DashboardPage from './pages/dashboard/dashboard-page';
import NotFound from './pages/not-found';
import './styles/app.scss';
import { StorageHelper } from './common/helpers/storage-helper';
import { Mode } from '@cloudscape-design/global-styles';
import InvestmentCalculatorLayout from './pages/investment-calculator/investment-calc-layout';

export default function App() {
  const Router = USE_BROWSER_ROUTER ? BrowserRouter : HashRouter;
  StorageHelper.applyTheme(Mode.Dark);
  return (
    <div style={{ height: '100%' }}>
      <Router>
        {/* <GlobalHeader /> */}
        {/* <div style={{ height: "56px", backgroundColor: "#000716" }}>&nbsp;</div> */}
        <div>
          <Routes>
            <Route index path="/" element={<DashboardPage />} />
            <Route path="/investment-calculator" element={<Outlet />}>
              <Route path="" element={<InvestmentCalculatorLayout />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
