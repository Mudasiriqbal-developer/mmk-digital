import { useState, useRef, useEffect } from "react";
import {User,GraduationCap,Briefcase,Star,
  Camera,CheckCircle2,Plus,Trash2,Upload,
  ZoomIn,ZoomOut,RotateCw,Crop,X,
} from "lucide-react";
import { waLink } from "../components/Footer";

/* ─────────────────────────────────────────────────────────
   PHOTO CROPPER  (canvas-based, no external lib)
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
    // rule-of-thirds grid
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

  const onMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUp = () => setDragging(false);

  // touch support
  const onTouchStart = (e) => {
    const t = e.touches[0];
    setDragging(true);
    setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
  };
  const onTouchMove = (e) => {
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
        {/* header */}
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
            <Crop size={15} color="var(--primary)" /> Crop Your Photo
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

        {/* canvas */}
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
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onMouseUp}
            />
          </div>
          <p
            style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}
          >
            Drag to reposition · Use zoom controls below
          </p>

          {/* zoom controls */}
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

        {/* footer */}
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
   STEP CONFIG
───────────────────────────────────────────────────────── */
const STEPS = [
  { id: "personal", label: "Personal", icon: <User size={15} /> },
  { id: "education", label: "Education", icon: <GraduationCap size={15} /> },
  { id: "experience", label: "Experience", icon: <Briefcase size={15} /> },
  { id: "skills", label: "Skills", icon: <Star size={15} /> },
  { id: "photo", label: "Photo", icon: <Camera size={15} /> },
];

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function CVBuilder({ navigate, showToast }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [rawSrc, setRawSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [personal, setPersonal] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    linkedin: "",
    objective: "",
  });

  const [education, setEducation] = useState([
    { degree: "", institution: "", year: "", grade: "" },
  ]);

  const [experience, setExperience] = useState([
    {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ]);

  const [skills, setSkills] = useState({
    technical: "",
    soft: "",
    languages: "",
    certifications: "",
  });

  /* ── Education helpers ── */
  const addEdu = () =>
    setEducation((e) => [
      ...e,
      { degree: "", institution: "", year: "", grade: "" },
    ]);
  const removeEdu = (i) => setEducation((e) => e.filter((_, idx) => idx !== i));
  const updateEdu = (i, k, v) =>
    setEducation((e) =>
      e.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)),
    );

  /* ── Experience helpers ── */
  const addExp = () =>
    setExperience((e) => [
      ...e,
      {
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  const removeExp = (i) =>
    setExperience((e) => e.filter((_, idx) => idx !== i));
  const updateExp = (i, k, v) =>
    setExperience((e) =>
      e.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)),
    );

  /* ── Photo / Cropper ── */
  const handleFileSelect = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setRawSrc(e.target.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropDone = (blob, dataUrl) => {
    setPhotoBlob(blob);
    setPhotoPreview(dataUrl);
    setShowCropper(false);
    showToast("Photo cropped successfully!", "success");
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!personal.fullName || !personal.email) {
      showToast("Please fill in at least your name and email.", "error");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);

    const msg = `*CV Order — MMK Digital Solution*
━━━━━━━━━━━━━━━━━━
👤 *Name:* ${personal.fullName}
📧 *Email:* ${personal.email}
📱 *Phone:* ${personal.phone || "N/A"}
📍 *City:* ${personal.city || "N/A"}
🔗 *LinkedIn:* ${personal.linkedin || "N/A"}

🎓 *Education:* ${education.map((e) => `${e.degree} — ${e.institution}`).join(" | ") || "N/A"}
💼 *Experience:* ${experience.map((e) => `${e.title} at ${e.company}`).join(" | ") || "N/A"}
🛠️ *Skills:* ${skills.technical || "N/A"}

📝 *Objective:* ${personal.objective || "N/A"}

Please process my CV order. Thank you!`;

    window.open(waLink(msg), "_blank");
    navigate("payment", {
      service: "CV Creation",
      price: 500,
      label: "Professional CV Creation",
    });
  };

  /* ── Step content definitions ── */
  const stepContents = [
    /* ── STEP 0 · Personal ── */
    <div key="personal">
      <h3 style={sh}>Personal Details</h3>
      <div style={grid2}>
        <Field label="Full Name *">
          <input
            className="form-input"
            value={personal.fullName}
            onChange={(e) =>
              setPersonal((p) => ({ ...p, fullName: e.target.value }))
            }
            placeholder="Muhammad Ali Hassan"
          />
        </Field>
        <Field label="Email Address *">
          <input
            className="form-input"
            type="email"
            value={personal.email}
            onChange={(e) =>
              setPersonal((p) => ({ ...p, email: e.target.value }))
            }
            placeholder="you@email.com"
          />
        </Field>
        <Field label="Phone / WhatsApp">
          <input
            className="form-input"
            value={personal.phone}
            onChange={(e) =>
              setPersonal((p) => ({ ...p, phone: e.target.value }))
            }
            placeholder="+92 300 0000000"
          />
        </Field>
        <Field label="City">
          <input
            className="form-input"
            value={personal.city}
            onChange={(e) =>
              setPersonal((p) => ({ ...p, city: e.target.value }))
            }
            placeholder="Karachi, Lahore…"
          />
        </Field>
        <Field label="LinkedIn Profile URL" style={{ gridColumn: "span 2" }}>
          <input
            className="form-input"
            value={personal.linkedin}
            onChange={(e) =>
              setPersonal((p) => ({ ...p, linkedin: e.target.value }))
            }
            placeholder="https://linkedin.com/in/username"
          />
        </Field>
        <Field
          label="Professional Objective / Summary"
          style={{ gridColumn: "span 2" }}
        >
          <textarea
            className="form-input"
            rows={4}
            value={personal.objective}
            onChange={(e) =>
              setPersonal((p) => ({ ...p, objective: e.target.value }))
            }
            placeholder="Brief professional summary — 2 to 3 sentences about your goals and strengths…"
            style={{ resize: "vertical" }}
          />
        </Field>
      </div>
    </div>,

    /* ── STEP 1 · Education ── */
    <div key="education">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h3 style={sh}>Education</h3>
        <button
          className="btn btn-ghost"
          style={{ padding: "8px 14px", fontSize: 13 }}
          onClick={addEdu}
        >
          <Plus size={14} /> Add Entry
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {education.map((edu, i) => (
          <div
            key={i}
            style={{
              padding: 20,
              background: "var(--section-alt)",
              borderRadius: 12,
              border: "1px solid var(--border)",
              position: "relative",
            }}
          >
            {education.length > 1 && (
              <button
                onClick={() => removeEdu(i)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#dc3545",
                  display: "flex",
                }}
              >
                <Trash2 size={15} />
              </button>
            )}
            <div style={grid2}>
              <Field label="Degree / Qualification">
                <input
                  className="form-input"
                  value={edu.degree}
                  onChange={(e) => updateEdu(i, "degree", e.target.value)}
                  placeholder="Bachelor of Computer Science"
                />
              </Field>
              <Field label="Institution / University">
                <input
                  className="form-input"
                  value={edu.institution}
                  onChange={(e) => updateEdu(i, "institution", e.target.value)}
                  placeholder="University of Karachi"
                />
              </Field>
              <Field label="Passing Year">
                <input
                  className="form-input"
                  type="number"
                  min="1990"
                  max="2030"
                  value={edu.year}
                  onChange={(e) => updateEdu(i, "year", e.target.value)}
                  placeholder="2024"
                />
              </Field>
              <Field label="Grade / CGPA / Percentage">
                <input
                  className="form-input"
                  value={edu.grade}
                  onChange={(e) => updateEdu(i, "grade", e.target.value)}
                  placeholder="3.8 / 4.0  or  85%"
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </div>,

    /* ── STEP 2 · Experience ── */
    <div key="experience">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h3 style={sh}>Work Experience</h3>
        <button
          className="btn btn-ghost"
          style={{ padding: "8px 14px", fontSize: 13 }}
          onClick={addExp}
        >
          <Plus size={14} /> Add Entry
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {experience.map((exp, i) => (
          <div
            key={i}
            style={{
              padding: 20,
              background: "var(--section-alt)",
              borderRadius: 12,
              border: "1px solid var(--border)",
              position: "relative",
            }}
          >
            {experience.length > 1 && (
              <button
                onClick={() => removeExp(i)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#dc3545",
                  display: "flex",
                }}
              >
                <Trash2 size={15} />
              </button>
            )}
            <div style={grid2}>
              <Field label="Job Title">
                <input
                  className="form-input"
                  value={exp.title}
                  onChange={(e) => updateExp(i, "title", e.target.value)}
                  placeholder="Frontend Developer"
                />
              </Field>
              <Field label="Company / Organization">
                <input
                  className="form-input"
                  value={exp.company}
                  onChange={(e) => updateExp(i, "company", e.target.value)}
                  placeholder="Tech Solutions Pvt. Ltd."
                />
              </Field>
              <Field label="Start Date">
                <input
                  className="form-input"
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => updateExp(i, "startDate", e.target.value)}
                />
              </Field>
              <Field label="End Date">
                <input
                  className="form-input"
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => updateExp(i, "endDate", e.target.value)}
                  disabled={exp.current}
                />
              </Field>
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                margin: "12px 0",
                fontSize: 14,
                cursor: "pointer",
                color: "var(--text)",
              }}
            >
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExp(i, "current", e.target.checked)}
                style={{ accentColor: "var(--primary)", width: 15, height: 15 }}
              />
              I currently work here
            </label>
            <Field label="Responsibilities / Description">
              <textarea
                className="form-input"
                rows={3}
                value={exp.description}
                onChange={(e) => updateExp(i, "description", e.target.value)}
                placeholder="Key responsibilities and achievements…"
                style={{ resize: "vertical" }}
              />
            </Field>
          </div>
        ))}
      </div>
    </div>,

    /* ── STEP 3 · Skills ── */
    <div key="skills">
      <h3 style={sh}>Skills & Certifications</h3>
      <div style={grid2}>
        <Field
          label="Technical Skills"
          hint="Separate with commas"
          style={{ gridColumn: "span 2" }}
        >
          <textarea
            className="form-input"
            rows={3}
            value={skills.technical}
            onChange={(e) =>
              setSkills((s) => ({ ...s, technical: e.target.value }))
            }
            placeholder="React, Node.js, Python, Figma, Photoshop…"
            style={{ resize: "none" }}
          />
        </Field>
        <Field label="Soft Skills" hint="Separate with commas">
          <textarea
            className="form-input"
            rows={3}
            value={skills.soft}
            onChange={(e) => setSkills((s) => ({ ...s, soft: e.target.value }))}
            placeholder="Leadership, Communication, Problem Solving…"
            style={{ resize: "none" }}
          />
        </Field>
        <Field label="Languages Known">
          <input
            className="form-input"
            value={skills.languages}
            onChange={(e) =>
              setSkills((s) => ({ ...s, languages: e.target.value }))
            }
            placeholder="Urdu (Native), English (Fluent)"
          />
        </Field>
        <Field
          label="Certifications / Courses"
          style={{ gridColumn: "span 2" }}
        >
          <input
            className="form-input"
            value={skills.certifications}
            onChange={(e) =>
              setSkills((s) => ({ ...s, certifications: e.target.value }))
            }
            placeholder="AWS Cloud Practitioner, Google Analytics…"
          />
        </Field>
      </div>
    </div>,

    /* ── STEP 4 · Photo ── */
    <div key="photo">
      <h3 style={sh}>Profile Photo</h3>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
        A professional headshot makes your CV stand out. Use a clear,
        front-facing photo with good lighting.
      </p>

      {photoPreview ? (
        <div style={{ textAlign: "center" }}>
          <img
            src={photoPreview}
            alt="Preview"
            style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid var(--primary)",
              marginBottom: 20,
              boxShadow: "var(--shadow)",
            }}
          />
          <div>
            <p
              style={{
                color: "var(--green)",
                fontWeight: 600,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: 14,
              }}
            >
              <CheckCircle2 size={16} /> Photo ready — looks great!
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                className="btn btn-ghost"
                style={{ padding: "9px 18px", fontSize: 13 }}
                onClick={() => setShowCropper(true)}
              >
                Re-crop
              </button>
              <label
                className="btn btn-outline"
                style={{ padding: "9px 18px", fontSize: 13, cursor: "pointer" }}
              >
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files[0]) handleFileSelect(e.target.files[0]);
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      ) : (
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
            if (e.dataTransfer.files[0])
              handleFileSelect(e.dataTransfer.files[0]);
          }}
          onClick={() => document.getElementById("cv-photo-input").click()}
        >
          <Upload
            size={36}
            color="var(--primary)"
            style={{ marginBottom: 14, opacity: 0.7 }}
          />
          <p
            style={{
              fontWeight: 600,
              fontSize: 15,
              marginBottom: 6,
              color: "var(--text)",
            }}
          >
            Drag & drop or click to upload
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            PNG or JPG · up to 5 MB · passport-size recommended
          </p>
          <input
            id="cv-photo-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files[0]) handleFileSelect(e.target.files[0]);
            }}
          />
        </div>
      )}

      <div
        style={{
          marginTop: 28,
          padding: "18px 20px",
          background: "var(--accent-light)",
          borderRadius: 12,
          border: "1px solid rgba(0,123,255,0.15)",
        }}
      >
        <p
          style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65 }}
        >
          <strong style={{ color: "var(--accent)" }}>What happens next?</strong>
          <br />
          After submitting, you'll confirm payment and our team will craft your
          professional CV. The final PDF will be ready in your dashboard within
          24 hours.
        </p>
      </div>
    </div>,
  ];

  /* ─── RENDER ─── */
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 820 }}>
        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: "clamp(26px,4vw,36px)",
              fontWeight: 800,
              marginBottom: 8,
              color: "var(--text)",
            }}
          >
            Build Your Professional CV
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            Fill out the form below — we handle all the design and formatting
            for you.
          </p>
        </div>

        {/* Step indicator */}
        <div className="step-bar">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`step-item${i === step ? " active" : ""}${i < step ? " done" : ""}`}
            >
              <div className="step-circle">
                {i < step ? <CheckCircle2 size={16} /> : s.icon}
              </div>
              <div className="step-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div
          className="card"
          style={{ padding: "36px 32px", marginBottom: 24 }}
        >
          {stepContents[step]}
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            className="btn btn-outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.35 : 1, padding: "12px 24px" }}
          >
            ← Back
          </button>

          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Step {step + 1} of {STEPS.length}
          </span>

          {step < STEPS.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setStep((s) => s + 1)}
              style={{ padding: "12px 28px" }}
            >
              Next Step →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "12px 28px",
                background: "var(--green)",
                boxShadow: "0 4px 16px rgba(40,167,69,0.3)",
              }}
            >
              {loading ? (
                <>
                  <span className="loader" /> Submitting…
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} /> Submit CV
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Cropper modal */}
      {showCropper && rawSrc && (
        <PhotoCropper
          src={rawSrc}
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
const sh = {
  fontFamily: "Syne,sans-serif",
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 20,
  color: "var(--text)",
};
const grid2 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
  gap: 16,
};

function Field({ label, hint, children, style }) {
  return (
    <div style={style}>
      <label className="form-label">
        {label}
        {hint && (
          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginLeft: 6,
              fontWeight: 400,
            }}
          >
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
