import {
  CheckCircle2,
  Copy,
  MessageCircle,
  Home,
  Smartphone,
  QrCode,
  Shield,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { waLink } from "../components/Footer";

const EASYPAISA_NUMBER = "0300-1234567"; // Replace with actual number
const EASYPAISA_NAME = "MMK Digital Solution";

const SERVICE_PRICES = {
  "CV Creation": {
    price: 500,
    note: "Professional CV with ATS-friendly formatting",
  },
  "Certificate Design": {
    price: 400,
    note: "Custom certificate design and delivery",
  },
  "Online Job Apply": { price: 300, note: "Per 5 job applications processed" },
  "Printing Services": {
    price: null,
    note: "Price depends on pages & color — confirm via WhatsApp",
  },
  "Photo Editing": { price: 300, note: "Passport photo editing and layout" },
  "Domicile Certificate": {
    price: 500,
    note: "End-to-end domicile certificate processing",
  },
};

export default function PaymentPage({ navigate, showToast, paymentInfo }) {
  const [copied, setCopied] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const service = paymentInfo?.service || "Service";
  const label = paymentInfo?.label || service;
  const price = paymentInfo?.price || SERVICE_PRICES[service]?.price;
  const note = SERVICE_PRICES[service]?.note || "";

  const copyNumber = () => {
    navigator.clipboard
      .writeText(EASYPAISA_NUMBER.replace(/-/g, ""))
      .catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Number copied!", "success");
  };

  const handleConfirm = () => {
    const msg = `*Payment Confirmation*\n━━━━━━━━━━━━━\nService: ${label}\nAmount: Rs. ${price || "TBD"}\nEasyPaisa: ${EASYPAISA_NUMBER}\n\nI have sent the payment. Please confirm and proceed with my order. Thank you!`;
    window.open(waLink(msg), "_blank");
    setPaymentDone(true);
  };

  if (paymentDone) {
    return (
      <div className="section">
        <div
          className="container"
          style={{ maxWidth: 520, textAlign: "center" }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--green-light)",
              border: "2px solid var(--green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            <CheckCircle2 size={36} color="var(--green)" />
          </div>
          <h2
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 12,
              color: "var(--text)",
            }}
          >
            Payment Sent!
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              lineHeight: 1.7,
              marginBottom: 28,
              fontSize: 15,
            }}
          >
            Your payment confirmation has been sent to our WhatsApp. We will
            verify and begin processing your order within a few hours.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => navigate("dashboard")}
              style={{ padding: "12px 22px" }}
            >
              Track My Order
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate("home")}
              style={{ padding: "12px 22px" }}
            >
              <Home size={16} /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 700 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--green-light)",
              border: "1px solid rgba(40,167,69,0.2)",
              borderRadius: 99,
              padding: "5px 14px",
              marginBottom: 16,
            }}
          >
            <CheckCircle2 size={13} color="var(--green)" />
            <span
              style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}
            >
              ORDER SUBMITTED SUCCESSFULLY
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: "clamp(24px,3.5vw,32px)",
              fontWeight: 800,
              marginBottom: 8,
              color: "var(--text)",
            }}
          >
            Complete Your Payment
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            Send payment via EasyPaisa and confirm on WhatsApp to activate your
            order.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 280px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Left: Payment details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Order summary */}
            <div className="card" style={{ padding: 24 }}>
              <h3
                style={{
                  fontFamily: "Syne",
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 16,
                  color: "var(--text)",
                }}
              >
                Order Summary
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text)",
                    }}
                  >
                    {label}
                  </div>
                  {note && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginTop: 3,
                      }}
                    >
                      {note}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 800,
                    fontSize: 22,
                    color: "var(--primary)",
                  }}
                >
                  {price ? `Rs. ${price}` : "TBD"}
                </div>
              </div>
              {price && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 12,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: "var(--text)",
                    }}
                  >
                    Total Amount
                  </span>
                  <span
                    style={{
                      fontFamily: "Syne",
                      fontWeight: 800,
                      fontSize: 24,
                      color: "var(--primary)",
                    }}
                  >
                    Rs. {price}
                  </span>
                </div>
              )}
            </div>

            {/* EasyPaisa details */}
            <div
              style={{
                background: "linear-gradient(135deg,#007f37 0%,#00a849 100%)",
                borderRadius: "var(--radius)",
                padding: 28,
                color: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <Smartphone size={22} />
                <h3
                  style={{ fontFamily: "Syne", fontSize: 17, fontWeight: 700 }}
                >
                  EasyPaisa Payment
                </h3>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  padding: "16px 18px",
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
                  Account Name
                </div>
                <div
                  style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18 }}
                >
                  {EASYPAISA_NAME}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  padding: "16px 18px",
                  marginBottom: 20,
                }}
              >
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
                  Mobile Number
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Syne",
                      fontWeight: 800,
                      fontSize: 22,
                      letterSpacing: "1px",
                    }}
                  >
                    {EASYPAISA_NUMBER}
                  </span>
                  <button
                    onClick={copyNumber}
                    style={{
                      background: copied
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(255,255,255,0.2)",
                      border: "none",
                      borderRadius: 8,
                      padding: "7px 12px",
                      cursor: "pointer",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "DM Sans",
                      transition: "all 0.2s",
                    }}
                  >
                    <Copy size={14} /> {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {price && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 12,
                    padding: "14px 18px",
                    marginBottom: 20,
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
                    Amount to Send
                  </div>
                  <div
                    style={{
                      fontFamily: "Syne",
                      fontWeight: 800,
                      fontSize: 26,
                    }}
                  >
                    Rs. {price}
                  </div>
                </div>
              )}

              <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.6 }}>
                📌 <strong>Steps:</strong> Open EasyPaisa app → Send Money →
                Enter number above → Send Rs. {price || "amount"} → Screenshot
                the receipt → Send to our WhatsApp
              </div>
            </div>

            {/* QR placeholder */}
            <div className="card" style={{ padding: 24, textAlign: "center" }}>
              <QrCode
                size={36}
                color="var(--primary)"
                style={{ margin: "0 auto 12px" }}
              />
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                EasyPaisa QR Code
              </p>
              <div
                style={{
                  width: 160,
                  height: 160,
                  background: "var(--bg)",
                  borderRadius: 12,
                  border: "2px dashed var(--border)",
                  margin: "0 auto 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: 12,
                }}
              >
                QR Code
                <br />
                Placeholder
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Scan with any banking or EasyPaisa app
              </p>
            </div>
          </div>

          {/* Right: Confirm & info */}
          <div style={{ position: "sticky", top: 90 }}>
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <h3
                style={{
                  fontFamily: "Syne",
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 16,
                  color: "var(--text)",
                }}
              >
                After Payment
              </h3>
              {[
                {
                  icon: "1",
                  text: "Send the payment receipt screenshot on WhatsApp",
                },
                {
                  icon: "2",
                  text: "We will verify your payment within 1–2 hours",
                },
                {
                  icon: "3",
                  text: "Your order will start processing immediately after",
                },
                {
                  icon: "4",
                  text: "Download the finished work from your dashboard",
                },
              ].map((step) => (
                <div
                  key={step.icon}
                  style={{ display: "flex", gap: 12, marginBottom: 14 }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "var(--primary)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "14px",
                marginBottom: 12,
                fontSize: 15,
              }}
            >
              <MessageCircle size={18} /> Confirm on WhatsApp
            </button>

            <div
              style={{
                padding: "12px 14px",
                background: "var(--section-alt)",
                borderRadius: 10,
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <Shield size={14} color="var(--accent)" />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Secure & Trusted
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                }}
              >
                All transactions verified manually. No payment is released until
                work is delivered.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 14,
                padding: "10px 14px",
                background: "var(--accent-light)",
                borderRadius: 10,
              }}
            >
              <Clock size={14} color="var(--accent)" />
              <span
                style={{
                  fontSize: 12,
                  color: "var(--accent)",
                  fontWeight: 600,
                }}
              >
                Delivery: 24–48 hours after payment
              </span>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width:768px) {
            .container > div[style*='grid-template-columns'] { grid-template-columns:1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
