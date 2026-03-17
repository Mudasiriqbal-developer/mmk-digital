// Geometric dot-network upward arrow logo
export default function Logo({
  size = 36,
  showText = true,
  textColor = "#0d1117",
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dots forming upward arrow network */}
        {/* Base dots */}
        <circle cx="8" cy="32" r="3" fill="#007BFF" opacity="0.4" />
        <circle cx="20" cy="32" r="3" fill="#007BFF" opacity="0.6" />
        <circle cx="32" cy="32" r="3" fill="#007BFF" opacity="0.4" />
        {/* Mid dots */}
        <circle cx="14" cy="22" r="3.5" fill="#007BFF" opacity="0.65" />
        <circle cx="26" cy="22" r="3.5" fill="#007BFF" opacity="0.65" />
        {/* Upper dot */}
        <circle cx="20" cy="12" r="4" fill="#007BFF" opacity="0.85" />
        {/* Apex dot */}
        <circle cx="20" cy="4" r="4.5" fill="#007BFF" />

        {/* Connecting lines */}
        <line
          x1="8"
          y1="32"
          x2="14"
          y2="22"
          stroke="#007BFF"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <line
          x1="20"
          y1="32"
          x2="14"
          y2="22"
          stroke="#007BFF"
          strokeWidth="1.5"
          opacity="0.45"
        />
        <line
          x1="20"
          y1="32"
          x2="26"
          y2="22"
          stroke="#007BFF"
          strokeWidth="1.5"
          opacity="0.45"
        />
        <line
          x1="32"
          y1="32"
          x2="26"
          y2="22"
          stroke="#007BFF"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <line
          x1="14"
          y1="22"
          x2="20"
          y2="12"
          stroke="#007BFF"
          strokeWidth="1.8"
          opacity="0.6"
        />
        <line
          x1="26"
          y1="22"
          x2="20"
          y2="12"
          stroke="#007BFF"
          strokeWidth="1.8"
          opacity="0.6"
        />
        <line
          x1="20"
          y1="12"
          x2="20"
          y2="4"
          stroke="#007BFF"
          strokeWidth="2"
          opacity="0.85"
        />

        {/* Subtle glow on apex */}
        <circle cx="20" cy="4" r="7" fill="#007BFF" opacity="0.12" />
      </svg>

      {showText && (
        <div style={{ lineHeight: 1 }}>
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: size * 0.42,
              color: "#007BFF",
              letterSpacing: "-0.5px",
            }}
          >
            MMK
          </div>
          <div
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              fontSize: size * 0.26,
              color: textColor,
              letterSpacing: "0.3px",
              marginTop: 1,
            }}
          >
            Digital Solution
          </div>
        </div>
      )}
    </div>
  );
}
