import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { CookiePolicy } from "./pages/CookiePolicy";
import { Terms } from "./pages/Terms";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
      <Route path="/politica-de-cookies" element={<CookiePolicy />} />
      <Route path="/termos-e-condicoes" element={<Terms />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
