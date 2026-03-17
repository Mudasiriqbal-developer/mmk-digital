import { useState } from "react";
import { FileText, Upload, CheckCircle2, X, AlertCircle } from "lucide-react";
import { waLink } from "../components/Footer";

const WHATSAPP = "923001234567";

function DocUploadField({
  label,
  hint,
  fieldId,
  files,
  onUpload,
  onRemove,
  accept = "image/*,.pdf",
  multiple = false,
}) {
  return (
    <div>
      <label className="form-label">{label} *</label>
      {hint && (
        <p
          style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}
        >
          {hint}
        </p>
      )}
      {files.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {files.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 14px",
                background: "var(--green-light)",
                borderRadius: 10,
                border: "1px solid rgba(40,167,69,0.2)",
              }}
            >
              <CheckCircle2 size={15} color="var(--green)" />
              <span style={{ fontSize: 13, flex: 1, color: "var(--text)" }}>
                {f.name}
              </span>
              <button
                onClick={() => onRemove(fieldId, i)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <label
            className="btn btn-ghost"
            style={{
              padding: "8px 14px",
              fontSize: 13,
              cursor: "pointer",
              width: "fit-content",
            }}
          >
            {multiple ? "Add More" : "Replace"}
            <input
              type="file"
              accept={accept}
              multiple={multiple}
              style={{ display: "none" }}
              onChange={(e) => onUpload(fieldId, e.target.files)}
            />
          </label>
        </div>
      ) : (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 18px",
            border: "2px dashed var(--border)",
            borderRadius: 12,
            cursor: "pointer",
            transition: "all 0.2s",
            background: "var(--bg)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.background = "var(--primary-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.background = "var(--bg)";
          }}
        >
          <Upload size={18} color="var(--primary)" />
          <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
            Click to upload {multiple ? "files" : "file"} (
            {accept.includes("image") ? "JPG/PNG" : "PDF/JPG"})
          </span>
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            style={{ display: "none" }}
            onChange={(e) => onUpload(fieldId, e.target.files)}
          />
        </label>
      )}
    </div>
  );
}

export default function DomicilePage({ navigate, showToast }) {
  const [form, setForm] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    cnicNo: "",
    religion: "",
    occupation: "",
    address: "",
    district: "",
    tehsil: "",
    union: "",
    village: "",
    phone: "",
    email: "",
  });

  const [docs, setDocs] = useState({
    photo: [],
    cnicFront: [],
    cnicBack: [],
    formB: [],
    fatherCnicFront: [],
    fatherCnicBack: [],
    utilityBill: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = (field, fileList) => {
    setDocs((d) => ({ ...d, [field]: [...d[field], ...Array.from(fileList)] }));
  };
  const handleRemove = (field, idx) => {
    setDocs((d) => ({ ...d, [field]: d[field].filter((_, i) => i !== idx) }));
  };

  const missingDocs = () => {
    const required = ["photo", "cnicFront", "cnicBack", "formB"];
    return required.filter((k) => docs[k].length === 0);
  };

  const handleSubmit = async () => {
    if (
      !form.fullName ||
      !form.fatherName ||
      !form.cnicNo ||
      !form.dob ||
      !form.address
    ) {
      showToast("Please fill all required personal fields.", "error");
      return;
    }
    const missing = missingDocs();
    if (missing.length > 0) {
      showToast(`Please upload: ${missing.join(", ")}`, "error");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);

    // WhatsApp message with structured data
    const msg = `*Domicile Certificate Request*
━━━━━━━━━━━━━━━━━━
👤 *Full Name:* ${form.fullName}
👨 *Father Name:* ${form.fatherName}
👩 *Mother Name:* ${form.motherName || "N/A"}
🎂 *Date of Birth:* ${form.dob}
🪪 *CNIC No:* ${form.cnicNo}
🕌 *Religion:* ${form.religion || "N/A"}
💼 *Occupation:* ${form.occupation || "N/A"}

📍 *Address:* ${form.address}
🏛️ *District:* ${form.district} | *Tehsil:* ${form.tehsil}
🏘️ *Union Council:* ${form.union} | *Village:* ${form.village}

📱 *Phone:* ${form.phone || "N/A"}
📧 *Email:* ${form.email || "N/A"}

📎 Documents uploaded via form.`;

    window.open(waLink(msg), "_blank");
    navigate("payment", {
      service: "Domicile Certificate",
      price: 500,
      label: "Domicile Certificate Processing",
    });
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: "clamp(24px,4vw,34px)",
              fontWeight: 800,
              marginBottom: 8,
              color: "var(--text)",
            }}
          >
            Domicile Certificate
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            Fill in all required details and upload supporting documents. We
            will prepare and process your domicile certificate application.
          </p>
        </div>

        {/* Warning banner */}
        <div
          style={{
            padding: "14px 18px",
            background: "rgba(245,158,11,0.08)",
            border: "1.5px solid rgba(245,158,11,0.25)",
            borderRadius: 12,
            marginBottom: 28,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <AlertCircle
            size={18}
            color="#F59E0B"
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.65,
            }}
          >
            <strong style={{ color: "var(--text)" }}>Important:</strong> All
            fields marked with * are mandatory. Ensure CNIC photos are clear and
            readable. Processing time: 3–5 working days after document
            submission.
          </p>
        </div>

        {/* ─ SECTION 1: Personal Details ─ */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <h3
            style={{
              fontFamily: "Syne",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 20,
              color: "var(--primary)",
            }}
          >
            1. Personal Information
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 16,
            }}
          >
            <div>
              <label className="form-label">Full Name (as per CNIC) *</label>
              <input
                className="form-input"
                value={form.fullName}
                onChange={(e) => setF("fullName", e.target.value)}
                placeholder="Muhammad Ali Hassan"
              />
            </div>
            <div>
              <label className="form-label">Father's Name *</label>
              <input
                className="form-input"
                value={form.fatherName}
                onChange={(e) => setF("fatherName", e.target.value)}
                placeholder="Muhammad Hassan"
              />
            </div>
            <div>
              <label className="form-label">Mother's Name</label>
              <input
                className="form-input"
                value={form.motherName}
                onChange={(e) => setF("motherName", e.target.value)}
                placeholder="Khadija Begum"
              />
            </div>
            <div>
              <label className="form-label">Date of Birth *</label>
              <input
                className="form-input"
                type="date"
                value={form.dob}
                onChange={(e) => setF("dob", e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">CNIC Number *</label>
              <input
                className="form-input"
                value={form.cnicNo}
                onChange={(e) => setF("cnicNo", e.target.value)}
                placeholder="XXXXX-XXXXXXX-X"
              />
            </div>
            <div>
              <label className="form-label">Religion</label>
              <select
                className="form-select"
                value={form.religion}
                onChange={(e) => setF("religion", e.target.value)}
              >
                <option value="">Select Religion</option>
                <option>Islam</option>
                <option>Christianity</option>
                <option>Hinduism</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="form-label">Occupation</label>
              <input
                className="form-input"
                value={form.occupation}
                onChange={(e) => setF("occupation", e.target.value)}
                placeholder="Student / Employed / Business..."
              />
            </div>
            <div>
              <label className="form-label">Phone / WhatsApp *</label>
              <input
                className="form-input"
                value={form.phone}
                onChange={(e) => setF("phone", e.target.value)}
                placeholder="+92 300 0000000"
              />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                value={form.email}
                onChange={(e) => setF("email", e.target.value)}
                placeholder="you@email.com"
              />
            </div>
          </div>
        </div>

        {/* ─ SECTION 2: Address ─ */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <h3
            style={{
              fontFamily: "Syne",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 20,
              color: "var(--primary)",
            }}
          >
            2. Residential Address
          </h3>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Complete Address *</label>
            <textarea
              className="form-input"
              rows={3}
              value={form.address}
              onChange={(e) => setF("address", e.target.value)}
              placeholder="House No., Street, Mohalla / Colony"
              style={{ resize: "vertical" }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 16,
            }}
          >
            <div>
              <label className="form-label">District *</label>
              <input
                className="form-input"
                value={form.district}
                onChange={(e) => setF("district", e.target.value)}
                placeholder="e.g. Karachi"
              />
            </div>
            <div>
              <label className="form-label">Tehsil *</label>
              <input
                className="form-input"
                value={form.tehsil}
                onChange={(e) => setF("tehsil", e.target.value)}
                placeholder="e.g. Kemari"
              />
            </div>
            <div>
              <label className="form-label">Union Council</label>
              <input
                className="form-input"
                value={form.union}
                onChange={(e) => setF("union", e.target.value)}
                placeholder="UC Number or Name"
              />
            </div>
            <div>
              <label className="form-label">Village / Ward</label>
              <input
                className="form-input"
                value={form.village}
                onChange={(e) => setF("village", e.target.value)}
                placeholder="Village or Ward name"
              />
            </div>
          </div>
        </div>

        {/* ─ SECTION 3: Documents ─ */}
        <div className="card" style={{ padding: 28, marginBottom: 24 }}>
          <h3
            style={{
              fontFamily: "Syne",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 8,
              color: "var(--primary)",
            }}
          >
            3. Required Documents
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 22,
            }}
          >
            Upload clear, well-lit photos or scans. All 4 starred documents are
            mandatory.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 20,
            }}
          >
            <DocUploadField
              label="Passport-Size Photo"
              hint="Recent photograph with white/blue background"
              fieldId="photo"
              files={docs.photo}
              onUpload={handleUpload}
              onRemove={handleRemove}
              accept="image/*"
            />
            <DocUploadField
              label="CNIC — Front Side"
              hint="Clear photo of the front of your CNIC"
              fieldId="cnicFront"
              files={docs.cnicFront}
              onUpload={handleUpload}
              onRemove={handleRemove}
              accept="image/*,.pdf"
            />
            <DocUploadField
              label="CNIC — Back Side"
              hint="Clear photo of the back of your CNIC"
              fieldId="cnicBack"
              files={docs.cnicBack}
              onUpload={handleUpload}
              onRemove={handleRemove}
              accept="image/*,.pdf"
            />
            <DocUploadField
              label="Form B / Bay Form"
              hint="B-form or Family Registration Certificate"
              fieldId="formB"
              files={docs.formB}
              onUpload={handleUpload}
              onRemove={handleRemove}
              accept="image/*,.pdf"
              multiple
            />
            <DocUploadField
              label="Father's CNIC — Front"
              hint="Optional but recommended"
              fieldId="fatherCnicFront"
              files={docs.fatherCnicFront}
              onUpload={handleUpload}
              onRemove={handleRemove}
              accept="image/*,.pdf"
            />
            <DocUploadField
              label="Father's CNIC — Back"
              hint="Optional but recommended"
              fieldId="fatherCnicBack"
              files={docs.fatherCnicBack}
              onUpload={handleUpload}
              onRemove={handleRemove}
              accept="image/*,.pdf"
            />
            <DocUploadField
              label="Utility Bill / Proof of Residence"
              hint="Electricity / Gas / Water bill"
              fieldId="utilityBill"
              files={docs.utilityBill}
              onUpload={handleUpload}
              onRemove={handleRemove}
              accept="image/*,.pdf"
            />
          </div>

          {/* Doc checklist */}
          <div
            style={{
              marginTop: 24,
              padding: "14px 18px",
              background: "var(--section-alt)",
              borderRadius: 12,
              border: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "var(--text)",
                marginBottom: 10,
              }}
            >
              Document Checklist:
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 8,
              }}
            >
              {[
                { key: "photo", label: "Passport Photo" },
                { key: "cnicFront", label: "CNIC Front" },
                { key: "cnicBack", label: "CNIC Back" },
                { key: "formB", label: "Form B / Bay Form" },
                { key: "fatherCnicFront", label: "Father's CNIC (opt)" },
                { key: "utilityBill", label: "Utility Bill (opt)" },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                  }}
                >
                  {docs[item.key].length > 0 ? (
                    <CheckCircle2 size={14} color="var(--green)" />
                  ) : (
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: "2px solid var(--border)",
                      }}
                    />
                  )}
                  <span
                    style={{
                      color:
                        docs[item.key].length > 0
                          ? "var(--green)"
                          : "var(--text-muted)",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ padding: "14px 32px", fontSize: 15 }}
        >
          {loading ? (
            <>
              <span className="loader" /> Submitting...
            </>
          ) : (
            <>
              <FileText size={17} /> Submit Application
            </>
          )}
        </button>
      </div>
    </div>
  );
}
