import { BrowserRouter, Route, Routes, Navigate } from "react-router";

import MainLayout from "./components/layouts/main-layout";
import HistoryPage from "./app/history-page";
import ComparePage from "./app/compare-page";
import FavoritesPage from "./app/favorites-page";
import LogPage from "./app/log-page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to={`history?base=usd&quote=idr`} />} />
        <Route element={<MainLayout />}>
          <Route path="history" element={<HistoryPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="log" element={<LogPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
