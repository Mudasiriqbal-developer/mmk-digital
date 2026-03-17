import { useState } from "react";
import { X, Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react";
import Logo from "./Logo";

// Demo accounts for prototype
const DEMO_ACCOUNTS = {
  "admin@mmk.com": { password: "admin123", name: "Admin Owner", role: "admin" },
  "user@mmk.com": { password: "user123", name: "Ali Hassan", role: "user" },
};

export default function LoginModal({ onClose, onLogin, showToast  }) {
  const [isSignup, setIsSignup] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900)); // Simulate API

    if (isSignup) {
      if (!form.name) {
        setError("Please enter your name.");
        setLoading(false);
        return;
      }
      onLogin({ name: form.name, email: form.email, role: "user" });
    } else {
      const account = DEMO_ACCOUNTS[form.email];
      if (!account || account.password !== form.password) {
        setError(
          "Invalid email or password.\n\nDemo: user@mmk.com / user123\nAdmin: admin@mmk.com / admin123",
        );
        setLoading(false);
        return;
      }
      onLogin({ name: account.name, email: form.email, role: account.role });
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: "40px",
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
          animation: "fadeUp 0.3s ease",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "#f3f4f6",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size={40} />
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              marginTop: 20,
              color: "#0d1117",
            }}
          >
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginTop: 6 }}>
            {isSignup
              ? "Start using MMK Digital Solution today."
              : "Sign in to access your dashboard and orders."}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {isSignup && (
            <div>
              <label className="form-label">
                <User size={13} style={{ display: "inline", marginRight: 5 }} />
                Full Name
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
          )}

          <div>
            <label className="form-label">
              <Mail size={13} style={{ display: "inline", marginRight: 5 }} />
              Email Address
            </label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="form-label">
              <Lock size={13} style={{ display: "inline", marginRight: 5 }} />
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type={showPass ? "text" : "password"}
                placeholder="Your password"
                style={{ paddingRight: 44 }}
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "#fff5f5",
                border: "1.5px solid #fecaca",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 13,
                color: "#dc2626",
                whiteSpace: "pre-line",
                lineHeight: 1.6,
              }}
            >
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "14px",
              marginTop: 4,
            }}
            disabled={loading}
          >
            {loading ? (
              <span className="loader" />
            ) : isSignup ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        {/* Demo hint */}
        {!isSignup && (
          <div
            style={{
              marginTop: 18,
              padding: "12px 14px",
              background: "rgba(0,123,255,0.05)",
              borderRadius: 10,
              border: "1px solid rgba(0,123,255,0.1)",
              fontSize: 12,
              color: "#6b7280",
              lineHeight: 1.6,
            }}
          >
            <Shield
              size={12}
              style={{ display: "inline", marginRight: 4, color: "#007BFF" }}
            />
            <strong style={{ color: "#007BFF" }}>Demo:</strong> user@mmk.com /
            user123 &nbsp;|&nbsp; admin@mmk.com / admin123
          </div>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: 22,
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#007BFF",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {isSignup ? "Sign in" : "Sign up free"}
          </button>
        </p>
      </div>
    </div>
  );
}
