import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/next"
import "./index.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CVBuilder from "./pages/CVBuilder";
import CertificatePage from "./pages/CertificatePage";
import PrintingPage from "./pages/PrintingPage";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import PhotoEditing from "./pages/PhotoEditing";
import DomicilePage from "./pages/DomicilePage";
import PaymentPage from "./pages/PaymentPage";
import LoginModal from "./components/LoginModal";
import Toast from "./components/Toast";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("mmk-theme") === "dark",
  );
  const [pendingPayment, setPendingPayment] = useState(null); // { service, price, label }

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light",
    );
    localStorage.setItem("mmk-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const navigate = (page, extra) => {
    if (page === "payment" && extra) setPendingPayment(extra);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showToast = (msg, type = "default") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
    showToast(`Welcome back, ${userData.name}!`, "success");
    if (userData.role === "admin") navigate("admin");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("home");
    showToast("Logged out successfully.");
  };

  const noFooterPages = ["admin"];

  const pageProps = { navigate, user, showToast, darkMode };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home {...pageProps} />;
      case "cv":
        return <CVBuilder {...pageProps} />;
      case "certificate":
        return <CertificatePage {...pageProps} />;
      case "printing":
        return <PrintingPage {...pageProps} />;
      case "photo":
        return <PhotoEditing {...pageProps} />;
      case "domicile":
        return <DomicilePage {...pageProps} />;
      case "admin":
        return <AdminPanel {...pageProps} />;
      case "dashboard":
        return <Dashboard {...pageProps} />;
      case "payment":
        return <PaymentPage {...pageProps} paymentInfo={pendingPayment} />;
      default:
        return <Home {...pageProps} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar
        currentPage={currentPage}
        navigate={navigate}
        user={user}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDark={() => setDarkMode((d) => !d)}
      />
      <main className="page-wrapper">{renderPage()}</main>
      {!noFooterPages.includes(currentPage) && <Footer navigate={navigate} />}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          showToast={showToast}
        />
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
