import {
  FileText,
  Award,
  Briefcase,
  Printer,
  Star,
  Users,
  CheckCircle,
  Zap,
  ArrowRight,
  ChevronRight,
  Camera,
} from "lucide-react";
import ServiceCard from "../components/ServiceCard";

const SERVICES = [
  {
    icon: <FileText size={24} />,
    title: "CV Creation",
    description:
      "Get a professional, ATS-friendly CV in minutes. Our expert team crafts standout resumes that get you noticed.",
    tag: "Most Popular",
    color: "#E31E24",
    page: "cv",
  },
  {
    icon: <Award size={24} />,
    title: "Certificate Design",
    description:
      "Experience, Achievement & Custom Certificates. Beautifully designed for every occasion.",
    tag: "Premium",
    color: "#007BFF",
    page: "certificate",
  },
  {
    icon: <Briefcase size={24} />,
    title: "Online Job Applies",
    description:
      "We handle the paperwork, you get the interview. Submit your credentials and let us do the heavy lifting.",
    tag: "Time Saver",
    color: "#F59E0B",
    page: "certificate",
  },
  {
    icon: <Printer size={24} />,
    title: "Printing Services",
    description:
      "High-quality Online & Offline printing. Color or B&W, any paper size — delivered to your door or ready for pickup.",
    tag: "Fast & Reliable",
    color: "#28A745",
    page: "printing",
  },
  {
    icon: <Camera size={24} />,
    title: "Photo Editing",
    description:
      "Passport-size photo conversion, background removal, and custom owner-designed layouts for any official document.",
    tag: "New Service",
    color: "#7C3AED",
    page: "photo",
  },
];

const STATS = [
  { value: "2,400+", label: "CVs Delivered", icon: <FileText size={18} /> },
  { value: "98%", label: "Client Satisfaction", icon: <Star size={18} /> },
  { value: "1,800+", label: "Happy Clients", icon: <Users size={18} /> },
  { value: "24hr", label: "Avg. Delivery Time", icon: <Zap size={18} /> },
];

const STEPS = [
  {
    num: "01",
    title: "Choose a Service",
    desc: "Pick from CV creation, certificates, job applications, photo editing, or printing.",
  },
  {
    num: "02",
    title: "Submit Your Details",
    desc: "Fill in your information through our simple, guided forms.",
  },
  {
    num: "03",
    title: "We Get to Work",
    desc: "Our team processes your request with precision and care.",
  },
  {
    num: "04",
    title: "Download Your Result",
    desc: "Track your order and download the finished file from your dashboard.",
  },
];

const TESTIMONIALS = [
  {
    name: "Fatima K.",
    role: "Software Engineer",
    text: "Got my CV done in under 24 hours. Clean, professional, and it actually got me callbacks. Highly recommend!",
    rating: 5,
  },
  {
    name: "Usman R.",
    role: "Recent Graduate",
    text: "The online job apply service is a lifesaver. They handled 8 applications for me and I landed 3 interviews!",
    rating: 5,
  },
  {
    name: "Sara M.",
    role: "Business Owner",
    text: "Ordered 50 certificates for our company event. Perfect quality, on time, and great communication throughout.",
    rating: 5,
  },
];

export default function Home({ navigate }) {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────── */}
      <section
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg, var(--primary-light) 0%, var(--bg) 50%, var(--accent-light) 100%)",
          position: "relative",
          overflow: "hidden",
          paddingTop: 40,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(227,30,36,0.05)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(0,123,255,0.05)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage:
              "radial-gradient(circle,rgba(227,30,36,0.06) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 700 }}>
            <div
              className="animate-fadeUp"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(227,30,36,0.08)",
                border: "1px solid rgba(227,30,36,0.2)",
                borderRadius: 99,
                padding: "6px 16px",
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#28A745",
                  display: "inline-block",
                  animation: "pulse-ring 1.5s ease-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--primary)",
                }}
              >
                Available 24/7 — Fast Delivery
              </span>
            </div>

            {/* ── UPDATED HERO HEADLINE ── */}
            <h1
              className="animate-fadeUp anim-delay-1"
              style={{
                fontFamily: "Syne,sans-serif",
                fontSize: "clamp(38px,5.5vw,68px)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 24,
                color: "var(--text)",
              }}
            >
              <span style={{ color: "var(--primary)" }}>MMK</span>{" "}
              <span style={{ color: "var(--accent)" }}>Digital</span> Solution
            </h1>

            <p
              className="animate-fadeUp anim-delay-2"
              style={{
                fontSize: 18,
                color: "var(--text-muted)",
                lineHeight: 1.75,
                marginBottom: 36,
                maxWidth: 560,
              }}
            >
              CVs, certificates, job applications, photo editing, and printing —
              all handled by real professionals. Stop stressing about paperwork.
            </p>

            <div
              className="animate-fadeUp anim-delay-3"
              style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
            >
              <button
                className="btn btn-primary"
                onClick={() => navigate("cv")}
                style={{ padding: "15px 28px", fontSize: 16 }}
              >
                Build My CV <ArrowRight size={18} />
              </button>
              <button
                className="btn btn-accent"
                onClick={() => navigate("photo")}
                style={{ padding: "15px 28px", fontSize: 16 }}
              >
                Photo Editing
              </button>
            </div>

            <div
              className="animate-fadeUp anim-delay-4"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 36,
              }}
            >
              <div style={{ display: "flex" }}>
                {["#E31E24", "#007BFF", "#F59E0B", "#28A745"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: c,
                      border: "2px solid var(--card-bg)",
                      marginLeft: i > 0 ? -10 : 0,
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Trusted by{" "}
                <strong style={{ color: "var(--text)" }}>1,800+ clients</strong>{" "}
                across Pakistan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────── */}
      <section
        style={{
          background:
            "linear-gradient(90deg,var(--primary) 0%,var(--accent) 100%)",
          padding: "48px 0",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: 32,
            }}
          >
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: "center", color: "#fff" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 8,
                    opacity: 0.8,
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    fontFamily: "Syne,sans-serif",
                    fontSize: 36,
                    fontWeight: 800,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 14, opacity: 0.8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              style={{
                display: "inline-block",
                padding: "5px 16px",
                background: "var(--primary-light)",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 700,
                color: "var(--primary)",
                marginBottom: 14,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              What We Offer
            </div>
            <h2
              style={{
                fontFamily: "Syne,sans-serif",
                fontSize: "clamp(28px,4vw,42px)",
                fontWeight: 800,
                marginBottom: 14,
                color: "var(--text)",
              }}
            >
              Everything You Need, In One Place
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 16,
                maxWidth: 520,
                margin: "0 auto",
              }}
            >
              Professional digital services handled by real experts — fast,
              reliable, and affordable.
            </p>
          </div>
          <div
            className="grid-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            }}
          >
            {SERVICES.map((s, i) => (
              <ServiceCard key={i} {...s} onClick={() => navigate(s.page)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              style={{
                display: "inline-block",
                padding: "5px 16px",
                background: "var(--green-light)",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 700,
                color: "#28A745",
                marginBottom: 14,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Simple Process
            </div>
            <h2
              style={{
                fontFamily: "Syne,sans-serif",
                fontSize: "clamp(28px,4vw,42px)",
                fontWeight: 800,
                color: "var(--text)",
              }}
            >
              How It Works
            </h2>
          </div>
          <div className="grid-4">
            {STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  padding: "24px 16px",
                  position: "relative",
                }}
              >
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 28,
                      right: -12,
                      zIndex: 1,
                    }}
                    className="step-arrow"
                  >
                    <ChevronRight size={20} color="var(--border)" />
                  </div>
                )}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background:
                      "linear-gradient(135deg,var(--primary),var(--primary-dark))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 18px",
                    fontFamily: "Syne,sans-serif",
                    fontWeight: 800,
                    fontSize: 18,
                    color: "#fff",
                    boxShadow: "0 6px 20px rgba(227,30,36,0.25)",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    fontFamily: "Syne,sans-serif",
                    fontSize: 17,
                    fontWeight: 700,
                    marginBottom: 8,
                    color: "var(--text)",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-muted)",
                    lineHeight: 1.65,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: "Syne,sans-serif",
                fontSize: "clamp(26px,3.5vw,38px)",
                fontWeight: 800,
                color: "var(--text)",
              }}
            >
              What Our Clients Say
            </h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card" style={{ padding: "28px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-muted)",
                    lineHeight: 1.7,
                    marginBottom: 20,
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: `hsl(${i * 80 + 10},65%,50%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      color: "#fff",
                      fontSize: 14,
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "var(--text)",
                      }}
                    >
                      {t.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section
        style={{
          background:
            "linear-gradient(135deg,var(--primary) 0%,var(--accent) 100%)",
          padding: "80px 0",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: "clamp(28px,4vw,44px)",
              fontWeight: 800,
              color: "#fff",
              marginBottom: 18,
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 17,
              marginBottom: 36,
              maxWidth: 440,
              margin: "0 auto 36px",
            }}
          >
            Join 1,800+ clients who trust MMK Digital Solution for their
            professional needs.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("cv")}
              style={{
                background: "#fff",
                color: "var(--primary)",
                border: "none",
                borderRadius: 10,
                padding: "15px 30px",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "DM Sans,sans-serif",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <FileText size={18} /> Start with CV
            </button>
            <button
              onClick={() => navigate("photo")}
              style={{
                background: "transparent",
                color: "#fff",
                border: "2px solid rgba(255,255,255,0.5)",
                borderRadius: 10,
                padding: "15px 30px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                fontFamily: "DM Sans,sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.borderColor = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
              }}
            >
              Photo Editing
            </button>
          </div>
        </div>
      </section>

      <style>{`@media (max-width:640px) { .step-arrow { display:none !important; } }`}</style>
    </div>
  );
}
