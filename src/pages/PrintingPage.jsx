import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Printer,
  Package,
  Truck,
  CheckCircle2,
  FileText,
  X,
  Palette,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop,
} from "lucide-react";
import { waLink } from "../components/Footer";

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const PAPER_SIZES = [
  "A4 (Standard)",
  "A3",
  "A5",
  "Letter (8.5×11)",
  "Legal (8.5×14)",
  "Custom Size",
];

const BINDING_OPTIONS = [
  { value: "none", label: "No Binding" },
  { value: "staple", label: "Staple" },
  { value: "spiral", label: "Spiral Binding" },
  { value: "tape", label: "Tape Binding" },
  { value: "laminate", label: "Lamination" },
];

/* ─────────────────────────────────────────────────────────
   PHOTO CROPPER  (for image files before upload)
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
            <Crop size={15} color="var(--primary)" /> Frame Your Image
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
            <CheckCircle2 size={15} /> Use This Frame
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function PrintingPage({ navigate, showToast }) {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [options, setOptions] = useState({
    colorMode: "color",
    paperSize: "A4 (Standard)",
    sides: "single",
    copies: 1,
    binding: "none",
    delivery: "pickup",
    address: "",
    notes: "",
  });

  const setOpt = (key, val) => setOptions((o) => ({ ...o, [key]: val }));

  /* ── File handling (images → cropper, others → direct) ── */
  const handleFileUpload = (fileList) => {
    Array.from(fileList).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCropSrc(e.target.result);
          setShowCropper(true);
        };
        reader.readAsDataURL(file);
      } else {
        setFiles((prev) => [...prev, file]);
      }
    });
  };

  const handleCropDone = (blob) => {
    const croppedFile = new File([blob], "cropped_image.jpg", {
      type: "image/jpeg",
    });
    setFiles((prev) => [...prev, croppedFile]);
    setShowCropper(false);
    showToast("Image added successfully!", "success");
  };

  const removeFile = (i) => setFiles((f) => f.filter((_, idx) => idx !== i));

  /* ── Price estimator ── */
  const estimatedPrice = () => {
    const perPage = options.colorMode === "color" ? 15 : 7;
    const copies = Math.max(1, Number(options.copies) || 1);
    const deliveryFee = options.delivery === "delivery" ? 100 : 0;
    const bindingFee =
      { none: 0, staple: 20, spiral: 80, tape: 30, laminate: 50 }[
        options.binding
      ] || 0;
    return perPage * copies + deliveryFee + bindingFee;
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (files.length === 0) {
      showToast("Please upload at least one document.", "error");
      return;
    }
    if (options.delivery === "delivery" && !options.address.trim()) {
      showToast("Please enter your delivery address.", "error");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);

    const msg = `*Printing Order — MMK Digital Solution*
━━━━━━━━━━━━━━━━━━
🖨️ *Files (${files.length}):* ${files.map((f) => f.name).join(", ")}

🎨 *Color Mode:* ${options.colorMode === "color" ? "Full Color (Rs. 15/page)" : "Black & White (Rs. 7/page)"}
📄 *Paper Size:* ${options.paperSize}
📋 *Sides:* ${options.sides === "single" ? "Single-Sided" : "Double-Sided"}
📦 *Binding:* ${BINDING_OPTIONS.find((b) => b.value === options.binding)?.label}
🔢 *Copies:* ${options.copies}
🚚 *Delivery:* ${options.delivery === "pickup" ? "Self-Pickup (Free)" : "Home Delivery (+Rs. 100)"}
${options.delivery === "delivery" ? `📍 *Address:* ${options.address}` : ""}
${options.notes ? `📝 *Notes:* ${options.notes}` : ""}

💰 *Estimated Total:* Rs. ${estimatedPrice()}

Please process my print order. Thank you!`;

    window.open(waLink(msg), "_blank");
    navigate("payment", {
      service: "Printing Services",
      price: estimatedPrice(),
      label: `Printing — ${files.length} file${files.length !== 1 ? "s" : ""}, ${options.colorMode === "color" ? "Color" : "B&W"}, ${options.copies} cop${options.copies > 1 ? "ies" : "y"}`,
    });
  };

  /* ─── RENDER ─── */
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 960 }}>
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
            Printing Services
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            Upload your documents, choose your preferences, and we handle the
            rest — pickup or home delivery available.
          </p>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 300px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ── LEFT: Main form ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Upload */}
            <div className="card" style={{ padding: 28 }}>
              <h3 style={SH}>
                <Upload
                  size={17}
                  color="var(--primary)"
                  style={{ display: "inline", marginRight: 8 }}
                />
                Upload Documents
              </h3>
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
                onClick={() => document.getElementById("print-files").click()}
              >
                <Printer
                  size={32}
                  color="var(--primary)"
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
                  Drop files here or click to upload
                </p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  PDF, DOC, DOCX, JPG, PNG — up to 50 MB per file · Images will
                  open the cropper
                </p>
                <input
                  id="print-files"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>

              {files.length > 0 && (
                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {files.map((file, i) => (
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
                      <FileText size={15} color="var(--accent)" />
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
                      <button
                        onClick={() => removeFile(i)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-muted)",
                          display: "flex",
                          padding: 2,
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

            {/* Print options */}
            <div className="card" style={{ padding: 28 }}>
              <h3 style={SH}>
                <Palette
                  size={17}
                  color="var(--accent)"
                  style={{ display: "inline", marginRight: 8 }}
                />
                Print Options
              </h3>

              {/* Color mode */}
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Color Mode</label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {[
                    {
                      id: "color",
                      label: "🎨 Full Color",
                      desc: "Rs. 15 / page",
                    },
                    {
                      id: "bw",
                      label: "⚫ Black & White",
                      desc: "Rs. 7 / page",
                    },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setOpt("colorMode", mode.id)}
                      style={{
                        padding: "14px 12px",
                        borderRadius: 12,
                        cursor: "pointer",
                        textAlign: "center",
                        border:
                          options.colorMode === mode.id
                            ? "2px solid var(--primary)"
                            : "2px solid var(--border)",
                        background:
                          options.colorMode === mode.id
                            ? "var(--primary-light)"
                            : "var(--card-bg)",
                        transition: "all 0.2s",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          marginBottom: 4,
                          color:
                            options.colorMode === mode.id
                              ? "var(--primary)"
                              : "var(--text)",
                        }}
                      >
                        {mode.label}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {mode.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paper size */}
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Paper Size</label>
                <select
                  className="form-select"
                  value={options.paperSize}
                  onChange={(e) => setOpt("paperSize", e.target.value)}
                >
                  {PAPER_SIZES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Sides */}
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Printing Sides</label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {[
                    { id: "single", label: "Single-Sided" },
                    { id: "double", label: "Double-Sided" },
                  ].map((side) => (
                    <button
                      key={side.id}
                      onClick={() => setOpt("sides", side.id)}
                      style={{
                        padding: "11px",
                        borderRadius: 10,
                        cursor: "pointer",
                        border:
                          options.sides === side.id
                            ? "2px solid var(--accent)"
                            : "2px solid var(--border)",
                        background:
                          options.sides === side.id
                            ? "var(--accent-light)"
                            : "var(--card-bg)",
                        fontFamily: "DM Sans,sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        color:
                          options.sides === side.id
                            ? "var(--accent)"
                            : "var(--text)",
                        transition: "all 0.2s",
                      }}
                    >
                      {side.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Binding */}
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Binding / Finishing</label>
                <select
                  className="form-select"
                  value={options.binding}
                  onChange={(e) => setOpt("binding", e.target.value)}
                >
                  {BINDING_OPTIONS.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Copies */}
              <div>
                <label className="form-label">Number of Copies</label>
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  max="999"
                  value={options.copies}
                  onChange={(e) =>
                    setOpt("copies", Math.max(1, parseInt(e.target.value) || 1))
                  }
                  style={{ width: 130 }}
                />
              </div>
            </div>

            {/* Delivery */}
            <div className="card" style={{ padding: 28 }}>
              <h3 style={SH}>
                <Truck
                  size={17}
                  color="var(--accent)"
                  style={{ display: "inline", marginRight: 8 }}
                />
                Delivery Option
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                {[
                  {
                    id: "pickup",
                    label: "🏪 Self-Pickup",
                    desc: "Free · Ready in 24 hours",
                    icon: <Package size={18} />,
                  },
                  {
                    id: "delivery",
                    label: "🚚 Home Delivery",
                    desc: "+Rs. 100 delivery fee",
                    icon: <Truck size={18} />,
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setOpt("delivery", opt.id)}
                    style={{
                      padding: "16px",
                      borderRadius: 12,
                      cursor: "pointer",
                      textAlign: "center",
                      border:
                        options.delivery === opt.id
                          ? "2px solid var(--accent)"
                          : "2px solid var(--border)",
                      background:
                        options.delivery === opt.id
                          ? "var(--accent-light)"
                          : "var(--card-bg)",
                      transition: "all 0.2s",
                      fontFamily: "DM Sans,sans-serif",
                    }}
                  >
                    <div
                      style={{
                        color:
                          options.delivery === opt.id
                            ? "var(--accent)"
                            : "var(--text-muted)",
                        marginBottom: 6,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {opt.icon}
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color:
                          options.delivery === opt.id
                            ? "var(--accent)"
                            : "var(--text)",
                        marginBottom: 4,
                      }}
                    >
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>

              {options.delivery === "delivery" && (
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">Delivery Address *</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={options.address}
                    onChange={(e) => setOpt("address", e.target.value)}
                    placeholder="House #, Street, Area, City, Postal Code"
                    style={{ resize: "vertical" }}
                  />
                </div>
              )}

              <div>
                <label className="form-label">
                  Special Instructions (Optional)
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={options.notes}
                  onChange={(e) => setOpt("notes", e.target.value)}
                  placeholder="Any specific requirements or notes…"
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div style={{ position: "sticky", top: 90 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 18,
                  color: "var(--text)",
                }}
              >
                Order Summary
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 11,
                  marginBottom: 18,
                }}
              >
                <SummaryRow
                  label="Files"
                  value={`${files.length} document${files.length !== 1 ? "s" : ""}`}
                />
                <SummaryRow
                  label="Color Mode"
                  value={
                    options.colorMode === "color"
                      ? "Full Color"
                      : "Black & White"
                  }
                />
                <SummaryRow label="Paper Size" value={options.paperSize} />
                <SummaryRow
                  label="Sides"
                  value={
                    options.sides === "single" ? "Single-Sided" : "Double-Sided"
                  }
                />
                <SummaryRow
                  label="Binding"
                  value={
                    BINDING_OPTIONS.find((b) => b.value === options.binding)
                      ?.label || "None"
                  }
                />
                <SummaryRow label="Copies" value={options.copies} />
                <SummaryRow
                  label="Delivery"
                  value={
                    options.delivery === "pickup"
                      ? "Self-Pickup"
                      : "Home Delivery"
                  }
                />
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: 14,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: "var(--text)",
                    }}
                  >
                    Estimated Total
                  </span>
                  <span
                    style={{
                      fontFamily: "Syne,sans-serif",
                      fontWeight: 800,
                      fontSize: 22,
                      color: "var(--primary)",
                    }}
                  >
                    Rs. {estimatedPrice()}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 6,
                  }}
                >
                  * Actual price may vary by document page count.
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: "100%", justifyContent: "center", padding: 14 }}
              >
                {loading ? (
                  <>
                    <span className="loader" /> Placing Order…
                  </>
                ) : (
                  <>
                    <Printer size={17} /> Place Print Order
                  </>
                )}
              </button>
            </div>

            {/* Quick tip */}
            <div
              style={{
                marginTop: 14,
                padding: "14px 16px",
                background: "var(--section-alt)",
                borderRadius: 12,
                border: "1px solid var(--border)",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.65,
                }}
              >
                💡 <strong style={{ color: "var(--text)" }}>Tip:</strong> PDF
                files give the best print quality. Convert Word/PowerPoint files
                to PDF before uploading for perfect results.
              </p>
            </div>
          </div>
        </div>

        {/* Responsive override */}
        <style>{`@media (max-width:768px) { .container > div[style*="grid-template-columns"] { grid-template-columns:1fr !important; } }`}</style>
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
  fontSize: 16,
  fontWeight: 700,
  marginBottom: 18,
  color: "var(--text)",
  display: "flex",
  alignItems: "center",
};

function SummaryRow({ label, value }) {
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}
    >
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span
        style={{
          fontWeight: 600,
          color: "var(--text)",
          textAlign: "right",
          maxWidth: "55%",
        }}
      >
        {value}
      </span>
    </div>
  );
}
