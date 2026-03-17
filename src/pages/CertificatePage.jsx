import { useState, useRef, useEffect } from "react";
import {
  Award,
  Briefcase,
  Upload,
  CheckCircle2,
  Link,
  FileText,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop,
  X,
} from "lucide-react";
import { waLink } from "../components/Footer";

/* ─────────────────────────────────────────────────────────
   CERTIFICATE TYPE DEFINITIONS
───────────────────────────────────────────────────────── */
const CERT_TYPES = {
  experience: {
    label: "Experience Certificate",
    color: "var(--primary)",
    fields: [
      {
        id: "employeeName",
        label: "Employee Full Name",
        type: "text",
        placeholder: "Muhammad Ali Hassan",
      },
      {
        id: "designation",
        label: "Designation / Job Title",
        type: "text",
        placeholder: "Senior Software Engineer",
      },
      {
        id: "company",
        label: "Company / Organization",
        type: "text",
        placeholder: "Tech Solutions Pvt. Ltd.",
      },
      { id: "startDate", label: "Start Date", type: "date" },
      { id: "endDate", label: "End Date", type: "date" },
      {
        id: "purpose",
        label: "Purpose / Note (Optional)",
        type: "textarea",
        placeholder:
          "This certificate is issued for visa application purposes…",
      },
    ],
  },
  achievement: {
    label: "Achievement Certificate",
    color: "var(--accent)",
    fields: [
      {
        id: "recipientName",
        label: "Recipient Full Name",
        type: "text",
        placeholder: "Sara Ahmed",
      },
      {
        id: "achievement",
        label: "Achievement Title",
        type: "text",
        placeholder: "Best Employee of the Year",
      },
      {
        id: "issuedBy",
        label: "Issued By / Organization",
        type: "text",
        placeholder: "MMK Solutions Ltd.",
      },
      { id: "issueDate", label: "Issue Date", type: "date" },
      {
        id: "description",
        label: "Achievement Description",
        type: "textarea",
        placeholder: "This certificate is awarded in recognition of…",
      },
    ],
  },
  training: {
    label: "Training / Course Completion",
    color: "#7C3AED",
    fields: [
      {
        id: "participantName",
        label: "Participant Name",
        type: "text",
        placeholder: "Usman Raza",
      },
      {
        id: "courseName",
        label: "Course / Training Title",
        type: "text",
        placeholder: "Advanced React Development",
      },
      {
        id: "institute",
        label: "Institute / Platform",
        type: "text",
        placeholder: "MMK Digital Academy",
      },
      {
        id: "duration",
        label: "Duration",
        type: "text",
        placeholder: "3 Months (Jan – Mar 2024)",
      },
      { id: "completionDate", label: "Completion Date", type: "date" },
    ],
  },
  custom: {
    label: "Custom Certificate",
    color: "var(--green)",
    fields: [
      {
        id: "recipientName",
        label: "Recipient Name",
        type: "text",
        placeholder: "Full name",
      },
      {
        id: "title",
        label: "Certificate Title",
        type: "text",
        placeholder: "e.g. Certificate of Participation",
      },
      {
        id: "issuedBy",
        label: "Issued By",
        type: "text",
        placeholder: "Organization name",
      },
      { id: "date", label: "Issue Date", type: "date" },
      {
        id: "details",
        label: "Additional Details / Instructions",
        type: "textarea",
        placeholder: "Specific requirements, design preferences, or content…",
      },
    ],
  },
};

/* ─────────────────────────────────────────────────────────
   PHOTO CROPPER  (reused for document photo uploads)
───────────────────────────────────────────────────────── */
function PhotoCropper({ src, onDone, onCancel }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const SIZE = 300;

  useEffect(() => {
    draw();
  }, [zoom, offset]);

  const draw = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    canvas.width = SIZE;
    canvas.height = SIZE;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.drawImage(
      img,
      offset.x,
      offset.y,
      img.naturalWidth * zoom,
      img.naturalHeight * zoom,
    );
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo((i * SIZE) / 3, 0);
      ctx.lineTo((i * SIZE) / 3, SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, (i * SIZE) / 3);
      ctx.lineTo(SIZE, (i * SIZE) / 3);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, SIZE, SIZE);
  };

  const onMD = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const onMM = (e) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMU = () => setDragging(false);
  const onTD = (e) => {
    const t = e.touches[0];
    setDragging(true);
    setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
  };
  const onTM = (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    setOffset({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };

  const handleDone = () =>
    canvasRef.current.toBlob(
      (blob) => onDone(blob, canvasRef.current.toDataURL("image/jpeg", 0.93)),
      "image/jpeg",
      0.93,
    );

  return (
    <div className="cropper-modal-overlay">
      <div className="cropper-modal-box">
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Syne,sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Crop size={15} color="var(--primary)" /> Crop Photo
          </span>
          <button
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 24, textAlign: "center" }}>
          <img
            ref={imgRef}
            src={src}
            alt=""
            style={{ display: "none" }}
            onLoad={draw}
          />
          <div
            style={{
              display: "inline-block",
              borderRadius: 12,
              overflow: "hidden",
              border: "2px solid var(--primary)",
              cursor: dragging ? "grabbing" : "grab",
            }}
          >
            <canvas
              ref={canvasRef}
              width={SIZE}
              height={SIZE}
              style={{ display: "block", width: SIZE, height: SIZE }}
              onMouseDown={onMD}
              onMouseMove={onMM}
              onMouseUp={onMU}
              onMouseLeave={onMU}
              onTouchStart={onTD}
              onTouchMove={onTM}
              onTouchEnd={onMU}
            />
          </div>
          <p
            style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}
          >
            Drag to reposition
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginTop: 14,
            }}
          >
            <button
              className="btn btn-ghost"
              style={{ padding: "7px 12px" }}
              onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))}
            >
              <ZoomOut size={15} />
            </button>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-muted)",
                minWidth: 48,
                textAlign: "center",
              }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              className="btn btn-ghost"
              style={{ padding: "7px 12px" }}
              onClick={() => setZoom((z) => Math.min(4, z + 0.1))}
            >
              <ZoomIn size={15} />
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: "7px 12px" }}
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
            >
              <RotateCw size={15} />
            </button>
          </div>
        </div>
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            className="btn btn-outline"
            style={{ padding: "10px 20px" }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            style={{ padding: "10px 22px" }}
            onClick={handleDone}
          >
            <CheckCircle2 size={15} /> Use This Crop
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function CertificatePage({ navigate, showToast }) {
  const [activeTab, setActiveTab] = useState("certificate");

  /* ── Certificate state ── */
  const [certType, setCertType] = useState("");
  const [certForm, setCertForm] = useState({});
  const [certLoading, setCertLoading] = useState(false);

  /* ── Apply state ── */
  const [applyForm, setApplyForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  });
  const [jobLinks, setJobLinks] = useState([{ url: "", notes: "" }]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [applyLoading, setApplyLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  /* ── Cropper state (for apply photo/doc upload) ── */
  const [cropSrc, setCropSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const certConfig = certType ? CERT_TYPES[certType] : null;

  /* ── Certificate submit ── */
  const handleCertSubmit = async () => {
    if (!certType) {
      showToast("Please select a certificate type.", "error");
      return;
    }
    const missing = certConfig.fields
      .filter(
        (f) =>
          f.type !== "textarea" && !f.id.toLowerCase().includes("optional"),
      )
      .find((f) => !certForm[f.id]);
    if (missing) {
      showToast(`Please fill in: ${missing.label}`, "error");
      return;
    }

    setCertLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setCertLoading(false);

    const details = Object.entries(certForm)
      .map(([k, v]) => `• ${k}: ${v}`)
      .join("\n");
    const msg = `*Certificate Request — MMK Digital Solution*
━━━━━━━━━━━━━━━━━━
📋 *Type:* ${CERT_TYPES[certType].label}

${details}

Please design and deliver this certificate. Thank you!`;

    window.open(waLink(msg), "_blank");
    navigate("payment", {
      service: "Certificate Design",
      price: 400,
      label: CERT_TYPES[certType].label,
    });
  };

  /* ── Apply file upload (images trigger cropper, others go straight in) ── */
  const handleFileUpload = (files) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCropSrc(e.target.result);
          setShowCropper(true);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadedFiles((prev) => [...prev, file]);
      }
    });
  };

  const handleCropDone = (blob, dataUrl) => {
    const croppedFile = new File([blob], "cropped_photo.jpg", {
      type: "image/jpeg",
    });
    setUploadedFiles((prev) => [...prev, croppedFile]);
    setShowCropper(false);
    showToast("Photo added successfully!", "success");
  };

  /* ── Apply submit ── */
  const handleApplySubmit = async () => {
    if (!applyForm.fullName || !applyForm.email) {
      showToast("Please fill in your name and email.", "error");
      return;
    }
    if (jobLinks.filter((j) => j.url.trim()).length === 0) {
      showToast("Please add at least one job application link.", "error");
      return;
    }
    setApplyLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setApplyLoading(false);

    const validJobs = jobLinks.filter((j) => j.url.trim());
    const msg = `*Online Job Apply Request — MMK Digital Solution*
━━━━━━━━━━━━━━━━━━
👤 *Name:* ${applyForm.fullName}
📧 *Email:* ${applyForm.email}
📱 *Phone:* ${applyForm.phone || "N/A"}

🔗 *Job Links (${validJobs.length}):*
${validJobs.map((j, i) => `${i + 1}. ${j.url}${j.notes ? " — " + j.notes : ""}`).join("\n")}

📝 *Notes:* ${applyForm.coverLetter || "None"}

Please apply on my behalf. Thank you!`;

    window.open(waLink(msg), "_blank");
    navigate("payment", {
      service: "Online Job Apply",
      price: 300,
      label: `Online Apply — ${validJobs.length} job${validJobs.length !== 1 ? "s" : ""}`,
    });
  };

  /* ─── RENDER ─── */
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Page header */}
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: "clamp(26px,4vw,36px)",
              fontWeight: 800,
              marginBottom: 8,
              color: "var(--text)",
            }}
          >
            Certificates & Job Applications
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            Custom certificate design or let us handle your online job
            applications — you focus on preparing, we handle the paperwork.
          </p>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "var(--section-alt)",
            borderRadius: 12,
            padding: 4,
            marginBottom: 36,
            width: "fit-content",
            border: "1px solid var(--border)",
          }}
        >
          {[
            {
              id: "certificate",
              label: "Certificate Design",
              icon: <Award size={16} />,
            },
            {
              id: "apply",
              label: "Online Job Apply",
              icon: <Briefcase size={16} />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 9,
                border: "none",
                fontFamily: "DM Sans,sans-serif",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
                background:
                  activeTab === tab.id ? "var(--card-bg)" : "transparent",
                color:
                  activeTab === tab.id ? "var(--primary)" : "var(--text-muted)",
                boxShadow: activeTab === tab.id ? "var(--shadow-sm)" : "none",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════
            TAB : CERTIFICATE DESIGN
        ════════════════════════════════ */}
        {activeTab === "certificate" && (
          <div>
            {/* Type selector */}
            <div className="card" style={{ padding: 28, marginBottom: 24 }}>
              <label
                className="form-label"
                style={{ fontSize: 15, marginBottom: 14 }}
              >
                Select Certificate Type
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(185px,1fr))",
                  gap: 12,
                }}
              >
                {Object.entries(CERT_TYPES).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCertType(key);
                      setCertForm({});
                    }}
                    style={{
                      padding: "18px 14px",
                      borderRadius: 12,
                      cursor: "pointer",
                      textAlign: "left",
                      border:
                        certType === key
                          ? `2px solid ${val.color}`
                          : "2px solid var(--border)",
                      background:
                        certType === key
                          ? `color-mix(in srgb, ${val.color} 8%, var(--card-bg))`
                          : "var(--card-bg)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Syne,sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        color: certType === key ? val.color : "var(--text)",
                        marginBottom: 5,
                      }}
                    >
                      {val.label}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {key === "experience" &&
                        "For employment / service records"}
                      {key === "achievement" && "Awards & recognition"}
                      {key === "training" && "Course or training completion"}
                      {key === "custom" &&
                        "Any other purpose — you describe it"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic form fields */}
            {certConfig && (
              <div className="card" style={{ padding: 28, marginBottom: 24 }}>
                <h3 style={SH}>{certConfig.label} — Details</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
                    gap: 16,
                  }}
                >
                  {certConfig.fields.map((field) => (
                    <div
                      key={field.id}
                      style={
                        field.type === "textarea"
                          ? { gridColumn: "span 2" }
                          : {}
                      }
                    >
                      <label className="form-label">{field.label}</label>
                      {field.type === "textarea" ? (
                        <textarea
                          className="form-input"
                          rows={3}
                          value={certForm[field.id] || ""}
                          onChange={(e) =>
                            setCertForm((f) => ({
                              ...f,
                              [field.id]: e.target.value,
                            }))
                          }
                          placeholder={field.placeholder}
                          style={{ resize: "vertical" }}
                        />
                      ) : field.type === "date" ? (
                        <input
                          className="form-input"
                          type="date"
                          value={certForm[field.id] || ""}
                          onChange={(e) =>
                            setCertForm((f) => ({
                              ...f,
                              [field.id]: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <input
                          className="form-input"
                          type="text"
                          value={certForm[field.id] || ""}
                          onChange={(e) =>
                            setCertForm((f) => ({
                              ...f,
                              [field.id]: e.target.value,
                            }))
                          }
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing note */}
            <div
              style={{
                padding: "14px 18px",
                background: "var(--primary-light)",
                borderRadius: 12,
                border: "1px solid rgba(227,30,36,0.15)",
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  lineHeight: 1.65,
                }}
              >
                <strong style={{ color: "var(--primary)" }}>
                  Rs. 400 per certificate.
                </strong>{" "}
                Delivered as a high-resolution PDF within 48 hours. You'll be
                redirected to the payment page after submitting.
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleCertSubmit}
              disabled={certLoading}
              style={{ padding: "14px 32px", fontSize: 15 }}
            >
              {certLoading ? (
                <>
                  <span className="loader" /> Submitting…
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} /> Submit Certificate Request
                </>
              )}
            </button>
          </div>
        )}

        {/* ════════════════════════════════
            TAB : ONLINE JOB APPLY
        ════════════════════════════════ */}
        {activeTab === "apply" && (
          <div>
            {/* Info banner */}
            <div
              style={{
                padding: "18px 20px",
                background: "rgba(245,158,11,0.07)",
                border: "1.5px solid rgba(245,158,11,0.22)",
                borderRadius: 14,
                marginBottom: 24,
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <Briefcase
                size={20}
                color="#F59E0B"
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#92400E",
                    marginBottom: 4,
                  }}
                >
                  How Online Apply Works
                </div>
                <p style={{ fontSize: 13, color: "#78350F", lineHeight: 1.65 }}>
                  Upload your credentials (CV, certificates, documents), paste
                  the job links, and our team will submit your applications
                  professionally and keep you updated.
                </p>
              </div>
            </div>

            {/* Your details */}
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <h3 style={SH}>Your Details</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
                  gap: 16,
                }}
              >
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    className="form-input"
                    value={applyForm.fullName}
                    onChange={(e) =>
                      setApplyForm((f) => ({ ...f, fullName: e.target.value }))
                    }
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input
                    className="form-input"
                    type="email"
                    value={applyForm.email}
                    onChange={(e) =>
                      setApplyForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="form-label">Phone / WhatsApp</label>
                  <input
                    className="form-input"
                    value={applyForm.phone}
                    onChange={(e) =>
                      setApplyForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+92 300 0000000"
                  />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label className="form-label">
                  Cover Letter / Special Instructions
                </label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={applyForm.coverLetter}
                  onChange={(e) =>
                    setApplyForm((f) => ({ ...f, coverLetter: e.target.value }))
                  }
                  placeholder="Your objective, any specific notes for our team…"
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>

            {/* Job links */}
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 18,
                }}
              >
                <h3 style={SH}>Job Application Links</h3>
                <button
                  className="btn btn-ghost"
                  style={{ padding: "7px 14px", fontSize: 13 }}
                  onClick={() =>
                    setJobLinks((j) => [...j, { url: "", notes: "" }])
                  }
                >
                  <Plus size={14} /> Add Link
                </button>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {jobLinks.map((job, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Link
                          size={14}
                          color="var(--accent)"
                          style={{ flexShrink: 0 }}
                        />
                        <input
                          className="form-input"
                          value={job.url}
                          onChange={(e) =>
                            setJobLinks((jobs) =>
                              jobs.map((j, idx) =>
                                idx === i ? { ...j, url: e.target.value } : j,
                              ),
                            )
                          }
                          placeholder="https://jobs.example.com/apply/12345"
                          style={{ padding: "10px 14px" }}
                        />
                      </div>
                      <input
                        className="form-input"
                        value={job.notes}
                        onChange={(e) =>
                          setJobLinks((jobs) =>
                            jobs.map((j, idx) =>
                              idx === i ? { ...j, notes: e.target.value } : j,
                            ),
                          )
                        }
                        placeholder="Position title or any notes (optional)"
                        style={{ padding: "10px 14px", fontSize: 13 }}
                      />
                    </div>
                    {jobLinks.length > 1 && (
                      <button
                        onClick={() =>
                          setJobLinks((jobs) =>
                            jobs.filter((_, idx) => idx !== i),
                          )
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#dc3545",
                          display: "flex",
                          marginTop: 8,
                          flexShrink: 0,
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Document upload */}
            <div className="card" style={{ padding: 28, marginBottom: 24 }}>
              <h3 style={SH}>Upload Your Documents</h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 16,
                }}
              >
                CV, certificates, CNIC copy, transcripts — images will open the
                cropper for framing before upload.
              </p>
              <div
                className={`upload-zone${dragOver ? " drag-over" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFileUpload(e.dataTransfer.files);
                }}
                onClick={() => document.getElementById("apply-files").click()}
              >
                <Upload
                  size={32}
                  color="var(--accent)"
                  style={{ marginBottom: 12, opacity: 0.7 }}
                />
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 4,
                    color: "var(--text)",
                  }}
                >
                  Drop files here or click to browse
                </p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  PDF, DOC, DOCX, JPG, PNG — up to 10 MB each
                </p>
                <input
                  id="apply-files"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {uploadedFiles.map((file, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        background: "var(--section-alt)",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                      }}
                    >
                      <FileText size={16} color="var(--accent)" />
                      <span
                        style={{
                          fontSize: 13,
                          flex: 1,
                          color: "var(--text)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.name}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          flexShrink: 0,
                        }}
                      >
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                      <CheckCircle2 size={15} color="var(--green)" />
                      <button
                        onClick={() =>
                          setUploadedFiles((f) =>
                            f.filter((_, idx) => idx !== i),
                          )
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-muted)",
                          display: "flex",
                          flexShrink: 0,
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing note */}
            <div
              style={{
                padding: "14px 18px",
                background: "var(--accent-light)",
                borderRadius: 12,
                border: "1px solid rgba(0,123,255,0.15)",
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  lineHeight: 1.65,
                }}
              >
                <strong style={{ color: "var(--accent)" }}>
                  Rs. 300 for up to 5 job applications.
                </strong>{" "}
                You'll be redirected to the payment page after submitting.
              </p>
            </div>

            <button
              className="btn btn-accent"
              onClick={handleApplySubmit}
              disabled={applyLoading}
              style={{ padding: "14px 32px", fontSize: 15 }}
            >
              {applyLoading ? (
                <>
                  <span className="loader" /> Submitting…
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} /> Submit Application Request
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Cropper modal */}
      {showCropper && cropSrc && (
        <PhotoCropper
          src={cropSrc}
          onDone={handleCropDone}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
const SH = {
  fontFamily: "Syne,sans-serif",
  fontSize: 17,
  fontWeight: 700,
  marginBottom: 18,
  color: "var(--text)",
};
