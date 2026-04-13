"use client";

type Props = {
  onReset: () => void;
};

export default function Header({ onReset }: Props) {
  return (
    <header
      style={{
        height: 52,
        borderBottom: "1px solid #2a2a3a",
        background: "#12121a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          ✦
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}>
          Agent Builder
        </span>
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            background: "#1a1a26",
            border: "1px solid #2a2a3a",
            borderRadius: 20,
            color: "#a855f7",
            fontWeight: 500,
          }}
        >
          beta
        </span>
      </div>

      <button
        onClick={onReset}
        style={{
          padding: "6px 14px",
          background: "transparent",
          border: "1px solid #2a2a3a",
          borderRadius: 8,
          color: "#94a3b8",
          fontSize: 13,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#7c3aed";
          e.currentTarget.style.color = "#e2e8f0";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#2a2a3a";
          e.currentTarget.style.color = "#94a3b8";
        }}
      >
        New Session
      </button>
    </header>
  );
}
