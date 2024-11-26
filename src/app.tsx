import {
  HashRouter,
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { USE_BROWSER_ROUTER } from "./common/constants";
import GlobalHeader from "./components/global-header";
import DashboardPage from "./pages/dashboard/dashboard-page";
import ViewItemPage from "./pages/investment-calculator/view-item/view-item-page";
import AllItemsPage from "./pages/investment-calculator/all-items/all-items-page";
import AddItemPage from "./pages/investment-calculator/add-item/add-item-page";
import NotFound from "./pages/not-found";
import "./styles/app.scss";

export default function App() {
  const Router = USE_BROWSER_ROUTER ? BrowserRouter : HashRouter;

  return (
    <div style={{ height: "100%" }}>
      <Router>
        <GlobalHeader />
        <div style={{ height: "56px", backgroundColor: "#000716" }}>&nbsp;</div>
        <div>
          <Routes>
            <Route index path="/" element={<DashboardPage />} />
            <Route path="/investment-calculator" element={<Outlet />}>
              <Route path="" element={<AllItemsPage />} />
              <Route path="add" element={<AddItemPage />} />
              <Route path="items/:itemId" element={<ViewItemPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
