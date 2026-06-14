import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WebsitePage from "./pages/WebsitePage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";

function MarketingScrollShell({ children }) {
  useEffect(() => {
    document.body.classList.add("public-marketing-scroll");
    return () => document.body.classList.remove("public-marketing-scroll");
  }, []);

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <MarketingScrollShell>
        <Routes>
          <Route path="/" element={<WebsitePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </MarketingScrollShell>
    </BrowserRouter>
  );
}
