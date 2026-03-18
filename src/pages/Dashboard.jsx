import { useState } from "react";
import {
  FileText,Award,Briefcase,Printer,Download,
  Clock,CheckCircle2,Loader,Plus,
} from "lucide-react";
// import OrderStatusCard from "../components/OrderStatusCard";
import Toast from "../components/Toast";

const DEMO_ORDERS = [
  {
    id: "MMK-001",
    title: "Professional CV — Software Engineer",
    type: "cv",
    status: "completed",
    date: "Mar 8, 2026",
    downloadUrl: "#",
  },
  {
    id: "MMK-002",
    title: "Experience Certificate — TechCorp",
    type: "certificate",
    status: "processing",
    date: "Mar 10, 2026",
    downloadUrl: null,
  },
  {
    id: "MMK-003",
    title: "Online Job Apply — 5 Applications",
    type: "apply",
    status: "pending",
    date: "Mar 11, 2026",
    downloadUrl: null,
  },
  {
    id: "MMK-004",
    title: "Color Printing — 10 Pages, A4",
    type: "printing",
    status: "completed",
    date: "Mar 6, 2026",
    downloadUrl: null,
  },
];

const SERVICE_ICONS = {
  cv: <FileText size={16} />,
  certificate: <Award size={16} />,
  apply: <Briefcase size={16} />,
  printing: <Printer size={16} />,
};

export default function Dashboard({ navigate, user }) {
  const [filter, setFilter] = useState("all");

  if (!user) {
    return (
      <div className="section">
        <div
          className="container"
          style={{ textAlign: "center", maxWidth: 480 }}
        >
          <FileText
            size={48}
            color="#007BFF"
            style={{ marginBottom: 20, opacity: 0.5 }}
          />
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            Login Required
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 24 }}>
            Please login to view your orders and dashboard.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("home")}
            style={{ padding: "12px 24px" }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const filteredOrders =
    filter === "all"
      ? DEMO_ORDERS
      : DEMO_ORDERS.filter((o) => o.status === filter || o.type === filter);

  const stats = {
    total: DEMO_ORDERS.length,
    completed: DEMO_ORDERS.filter((o) => o.status === "completed").length,
    processing: DEMO_ORDERS.filter((o) => o.status === "processing").length,
    pending: DEMO_ORDERS.filter((o) => o.status === "pending").length,
  };

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 36,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(24px, 3.5vw, 34px)",
                fontWeight: 800,
                marginBottom: 6,
              }}
            >
              Welcome back, {user.name.split(" ")[0]}! 👋
            </h1>
            <p style={{ color: "#6b7280", fontSize: 15 }}>
              Track your orders and download completed files from here.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("cv")}
            style={{ padding: "12px 22px" }}
          >
            <Plus size={16} /> New Order
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 36,
          }}
        >
          {[
            {
              label: "Total Orders",
              value: stats.total,
              color: "#007BFF",
              icon: <FileText size={20} />,
              key: "all",
            },
            {
              label: "Completed",
              value: stats.completed,
              color: "#28A745",
              icon: <CheckCircle2 size={20} />,
              key: "completed",
            },
            {
              label: "In Progress",
              value: stats.processing,
              color: "#007BFF",
              icon: <Loader size={20} />,
              key: "processing",
            },
            {
              label: "Pending",
              value: stats.pending,
              color: "#F59E0B",
              icon: <Clock size={20} />,
              key: "pending",
            },
          ].map((stat) => (
            <button
              key={stat.key}
              onClick={() => setFilter(stat.key)}
              className="card"
              style={{
                padding: "20px",
                cursor: "pointer",
                textAlign: "left",
                border:
                  filter === stat.key
                    ? `2px solid ${stat.color}`
                    : "1px solid #e5e7eb",
                background: filter === stat.key ? `${stat.color}08` : "white",
                width: "100%",
              }}
            >
              <div style={{ color: stat.color, marginBottom: 10 }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 800,
                  fontSize: 28,
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                {stat.label}
              </div>
            </button>
          ))}
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {["all", "pending", "processing", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 16px",
                borderRadius: 99,
                border: "none",
                background: filter === f ? "#007BFF" : "#f3f4f6",
                color: filter === f ? "white" : "#6b7280",
                fontFamily: "DM Sans",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.18s",
                textTransform: "capitalize",
              }}
            >
              {f === "all" ? "All Orders" : f}
            </button>
          ))}
        </div>

        {/* Orders grid */}
        {filteredOrders.length > 0 ? (
          <div className="grid-2">
            {filteredOrders.map((order) => (
              <OrderStatusCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <FileText size={40} color="#d1d5db" style={{ marginBottom: 14 }} />
            <p style={{ color: "#9ca3af", fontSize: 15 }}>
              No orders found for this filter.
            </p>
          </div>
        )}

        {/* Service shortcuts */}
        <div style={{ marginTop: 48 }}>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Order a New Service
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 14,
            }}
          >
            {[
              {
                label: "Build Your CV",
                page: "cv",
                icon: <FileText size={18} />,
                color: "#007BFF",
              },
              {
                label: "Design Certificate",
                page: "certificate",
                icon: <Award size={18} />,
                color: "#7C3AED",
              },
              {
                label: "Job Applications",
                page: "certificate",
                icon: <Briefcase size={18} />,
                color: "#F59E0B",
              },
              {
                label: "Print Documents",
                page: "printing",
                icon: <Printer size={18} />,
                color: "#28A745",
              },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => navigate(s.page)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 18px",
                  borderRadius: 12,
                  border: `1.5px solid ${s.color}25`,
                  background: `${s.color}08`,
                  cursor: "pointer",
                  fontFamily: "DM Sans",
                  fontWeight: 600,
                  fontSize: 14,
                  color: s.color,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${s.color}14`;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${s.color}08`;
                  e.currentTarget.style.transform = "none";
                }}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
