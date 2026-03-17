import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  Download,
  CheckCircle2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop,
} from "lucide-react";
import { waLink, WA_MESSAGES } from "../components/Footer";

const LAYOUTS = [
  {
    id: "passport_pk",
    label: "Pakistan Passport",
    size: "35×45 mm",
    bg: "white",
    desc: "Official 35x45mm white background",
  },
  {
    id: "passport_us",
    label: "US Visa / Passport",
    size: "2×2 inch",
    bg: "white",
    desc: "51x51mm white background",
  },
  {
    id: "cnic",
    label: "CNIC / ID Card",
    size: "35×45 mm",
    bg: "white",
    desc: "Standard ID card photo",
  },
  {
    id: "driving",
    label: "Driving License",
    size: "35×45 mm",
    bg: "white",
    desc: "For Pakistan driving license",
  },
  {
    id: "custom",
    label: "Custom Layout",
    size: "Custom",
    bg: "any",
    desc: "Owner designs the layout for you",
  },
];

const BG_COLORS = [
  { id: "white", label: "White", hex: "#FFFFFF" },
  { id: "blue", label: "Blue", hex: "#0057A8" },
  { id: "red", label: "Red", hex: "#CC0000" },
  { id: "gray", label: "Light Gray", hex: "#F0F0F0" },
  { id: "custom", label: "Custom", hex: null },
];

// Simple client-side cropper using canvas
function ImageCropper({ src, onDone, onCancel }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const CROP_SIZE = 300;

  useEffect(() => {
    drawCanvas();
  }, [src, zoom, offset]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
    const scaledW = img.naturalWidth * zoom;
    const scaledH = img.naturalHeight * zoom;
    ctx.drawImage(img, offset.x, offset.y, scaledW, scaledH);
    // Draw grid overlay
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo((i * CROP_SIZE) / 3, 0);
      ctx.lineTo((i * CROP_SIZE) / 3, CROP_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, (i * CROP_SIZE) / 3);
      ctx.lineTo(CROP_SIZE, (i * CROP_SIZE) / 3);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, CROP_SIZE, CROP_SIZE);
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

  const handleDone = () => {
    const canvas = canvasRef.current;
    canvas.toBlob(
      (blob) => {
        onDone(blob, canvas.toDataURL("image/jpeg", 0.92));
      },
      "image/jpeg",
      0.92,
    );
  };

  return (
    <div className="cropper-modal-overlay">
      <div className="cropper-modal-box">
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Syne,sans-serif",
              fontWeight: 700,
              fontSize: 17,
              color: "var(--text)",
            }}
          >
            <Crop
              size={16}
              style={{
                display: "inline",
                marginRight: 8,
                color: "var(--primary)",
              }}
            />
            Crop Your Photo
          </div>
          <button
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: 24 }}>
          <img
            ref={imgRef}
            src={src}
            alt=""
            style={{ display: "none" }}
            onLoad={drawCanvas}
          />
          <div
            style={{
              position: "relative",
              width: CROP_SIZE,
              height: CROP_SIZE,
              margin: "0 auto",
              borderRadius: 12,
              overflow: "hidden",
              cursor: dragging ? "grabbing" : "grab",
              border: "2px solid var(--primary)",
            }}
          >
            <canvas
              ref={canvasRef}
              width={CROP_SIZE}
              height={CROP_SIZE}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              style={{ display: "block", width: "100%", height: "100%" }}
            />
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 10,
            }}
          >
            Drag to reposition · Use zoom controls below
          </p>

          {/* Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginTop: 18,
            }}
          >
            <button
              onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}
              className="btn btn-ghost"
              style={{ padding: "8px 12px" }}
            >
              <ZoomOut size={16} />
            </button>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-muted)",
                minWidth: 50,
                textAlign: "center",
              }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              className="btn btn-ghost"
              style={{ padding: "8px 12px" }}
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
              className="btn btn-ghost"
              style={{ padding: "8px 12px" }}
            >
              <RotateCw size={16} />
            </button>
          </div>
        </div>
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onCancel}
            className="btn btn-outline"
            style={{ padding: "10px 20px" }}
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="btn btn-primary"
            style={{ padding: "10px 22px" }}
          >
            <CheckCircle2 size={16} /> Use This Crop
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PhotoEditing({ navigate, showToast }) {
  const [layout, setLayout] = useState("");
  const [bgColor, setBgColor] = useState("white");
  const [rawSrc, setRawSrc] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setCroppedPreview(dataUrl);
    setShowCropper(false);
    showToast("Photo cropped successfully!", "success");
  };

  const handleSubmit = async () => {
    if (!croppedPreview) {
      showToast("Please upload and crop your photo first.", "error");
      return;
    }
    if (!layout) {
      showToast("Please select a layout type.", "error");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);

    // Send WhatsApp message with details
    const msg = `Hi MMK Digital Solution!\n\nPhoto Editing Request:\n👤 Name: ${name || "Not provided"}\n📱 Phone: ${phone || "Not provided"}\n📋 Layout: ${LAYOUTS.find((l) => l.id === layout)?.label}\n🎨 Background: ${bgColor}\n📝 Notes: ${notes || "None"}\n\nPlease process my passport photo. Thank you!`;
    window.open(waLink(msg), "_blank");
    navigate("payment", {
      service: "Photo Editing",
      price: 300,
      label: "Passport Photo Editing / Layout",
    });
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 840 }}>
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 99,
              padding: "5px 14px",
              marginBottom: 16,
            }}
          >
            <Camera size={14} color="#7C3AED" />{" "}
            <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED" }}>
              NEW SERVICE
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: "clamp(26px,4vw,36px)",
              fontWeight: 800,
              marginBottom: 8,
              color: "var(--text)",
            }}
          >
            Photo Editing Service
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            Passport-size photo conversion, background change, and custom
            owner-designed layouts for any official document.
          </p>
        </div>

        {/* Upload */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <h3
            style={{
              fontFamily: "Syne",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 16,
              color: "var(--text)",
            }}
          >
            <Upload
              size={16}
              style={{
                display: "inline",
                marginRight: 8,
                color: "var(--primary)",
              }}
            />
            Upload Your Photo
          </h3>

          {croppedPreview ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <img
                src={croppedPreview}
                alt="Cropped"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "3px solid var(--primary)",
                }}
              />
              <div>
                <p
                  style={{
                    color: "var(--green)",
                    fontWeight: 600,
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14,
                  }}
                >
                  <CheckCircle2 size={15} /> Photo ready for processing
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      setShowCropper(true);
                    }}
                    className="btn btn-ghost"
                    style={{ padding: "8px 14px", fontSize: 13 }}
                  >
                    Re-crop
                  </button>
                  <label
                    className="btn btn-outline"
                    style={{
                      padding: "8px 14px",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Change Photo{" "}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files[0])
                          handleFileSelect(e.target.files[0]);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="upload-zone"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("drag-over");
              }}
              onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("drag-over");
                if (e.dataTransfer.files[0])
                  handleFileSelect(e.dataTransfer.files[0]);
              }}
              onClick={() =>
                document.getElementById("photo-edit-input").click()
              }
            >
              <Camera
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
                Click or drag to upload your photo
              </p>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                JPG, PNG — clear face photo, good lighting preferred
              </p>
              <input
                id="photo-edit-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files[0]) handleFileSelect(e.target.files[0]);
                }}
              />
            </div>
          )}
        </div>

        {/* Layout selector */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <h3
            style={{
              fontFamily: "Syne",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 16,
              color: "var(--text)",
            }}
          >
            Select Layout Type
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: 12,
            }}
          >
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLayout(l.id)}
                style={{
                  padding: "14px 12px",
                  borderRadius: 12,
                  cursor: "pointer",
                  textAlign: "left",
                  border:
                    layout === l.id
                      ? "2px solid var(--primary)"
                      : "2px solid var(--border)",
                  background:
                    layout === l.id ? "var(--primary-light)" : "var(--card-bg)",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: layout === l.id ? "var(--primary)" : "var(--text)",
                  }}
                >
                  {l.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  {l.size}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {l.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Background color */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <h3
            style={{
              fontFamily: "Syne",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 16,
              color: "var(--text)",
            }}
          >
            Background Color
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {BG_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setBgColor(c.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  borderRadius: 10,
                  cursor: "pointer",
                  border:
                    bgColor === c.id
                      ? "2px solid var(--primary)"
                      : "2px solid var(--border)",
                  background:
                    bgColor === c.id
                      ? "var(--primary-light)"
                      : "var(--card-bg)",
                  fontFamily: "DM Sans",
                  fontWeight: 600,
                  fontSize: 13,
                  color: bgColor === c.id ? "var(--primary)" : "var(--text)",
                  transition: "all 0.2s",
                }}
              >
                {c.hex && (
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: c.hex,
                      border: "1px solid rgba(0,0,0,0.15)",
                      display: "inline-block",
                    }}
                  />
                )}
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Personal info */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <h3
            style={{
              fontFamily: "Syne",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 16,
              color: "var(--text)",
            }}
          >
            Your Contact Info
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 16,
            }}
          >
            <div>
              <label className="form-label">Your Name</label>
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Muhammad Ali"
              />
            </div>
            <div>
              <label className="form-label">WhatsApp / Phone</label>
              <input
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 0000000"
              />
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label className="form-label">
              Special Instructions (Optional)
            </label>
            <textarea
              className="form-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific requirements — e.g. remove glasses, fix lighting, print 4 copies on one sheet..."
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        {/* Pricing note */}
        <div
          style={{
            padding: "16px 20px",
            background: "var(--accent-light)",
            borderRadius: 12,
            border: "1px solid rgba(0,123,255,0.15)",
            marginBottom: 24,
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "var(--accent)",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            💡 How it works:
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.65,
            }}
          >
            Upload your photo → we crop, resize, enhance background, and prepare
            the final layout. Turnaround: same-day for standard layouts. You'll
            be redirected to payment (Rs. 300) after submission.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ padding: "14px 32px", fontSize: 15 }}
        >
          {loading ? (
            <>
              <span className="loader" /> Processing...
            </>
          ) : (
            <>
              <CheckCircle2 size={17} /> Submit Photo Order
            </>
          )}
        </button>

        {showCropper && rawSrc && (
          <ImageCropper
            src={rawSrc}
            onDone={handleCropDone}
            onCancel={() => setShowCropper(false)}
          />
        )}
      </div>
    </div>
  );
}
