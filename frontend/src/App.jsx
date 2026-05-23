import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import WeeklyRecap from "./pages/WeeklyRecap";
import InstallPrompt from "./components/InstallPrompt";

function SavedRecapRoute() {
  const saved = sessionStorage.getItem("weekly_recap");
  const recap = saved ? JSON.parse(saved) : null;
  return recap ? <WeeklyRecap recap={recap} /> : <Dashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recap" element={<SavedRecapRoute />} />
        <Route path="/recap/:id" element={<SavedRecapRoute />} />
        <Route path="/history" element={<History />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <InstallPrompt />
    </BrowserRouter>
  );
}
