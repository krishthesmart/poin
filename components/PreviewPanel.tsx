"use client";

import { useRef, useState } from "react";
import type { BuildStatus } from "@/app/page";

type Props = {
  code: string;
  status: BuildStatus;
  activeTab: "preview" | "code";
  onTabChange: (tab: "preview" | "code") => void;
};

export default function PreviewPanel({
  code,
  status,
  activeTab,
  onTabChange,
}: Props) {
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "app.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isEmpty = !code;
  const isBuilding = status === "building";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#0a0a0f",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          height: 48,
          borderBottom: "1px solid #2a2a3a",
          background: "#12121a",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
          flexShrink: 0,
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 2,
            background: "#0a0a0f",
            border: "1px solid #2a2a3a",
            borderRadius: 8,
            padding: 3,
          }}
        >
          {(["preview", "code"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              style={{
                padding: "4px 12px",
                background: activeTab === tab ? "#1a1a26" : "transparent",
                border: activeTab === tab ? "1px solid #2a2a3a" : "1px solid transparent",
                borderRadius: 6,
                color: activeTab === tab ? "#e2e8f0" : "#64748b",
                fontSize: 12,
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.15s",
              }}
            >
              {tab === "preview" ? "▶ Preview" : "</> Code"}
            </button>
          ))}
        </div>

        {/* Status */}
        {isBuilding && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#a855f7",
            }}
          >
            <div
              className="spinning"
              style={{
                width: 12,
                height: 12,
                border: "2px solid #a855f733",
                borderTopColor: "#a855f7",
                borderRadius: "50%",
              }}
            />
            Generating…
          </div>
        )}

        {/* Actions */}
        {code && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              onClick={handleCopy}
              style={{
                padding: "5px 12px",
                background: "transparent",
                border: "1px solid #2a2a3a",
                borderRadius: 7,
                color: copied ? "#10b981" : "#94a3b8",
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              style={{
                padding: "5px 12px",
                background: "transparent",
                border: "1px solid #2a2a3a",
                borderRadius: 7,
                color: "#94a3b8",
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#7c3aed55";
                e.currentTarget.style.color = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a2a3a";
                e.currentTarget.style.color = "#94a3b8";
              }}
            >
              ↓ Download
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {isEmpty && !isBuilding ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 16,
              color: "#374151",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, opacity: 0.3 }}>⬡</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "#4b5563" }}>
                No preview yet
              </div>
              <div style={{ fontSize: 13 }}>
                Prompt the AI to build something
              </div>
            </div>
          </div>
        ) : isBuilding && isEmpty ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 16,
            }}
          >
            <div
              className="spinning"
              style={{
                width: 36,
                height: 36,
                border: "3px solid #2a2a3a",
                borderTopColor: "#a855f7",
                borderRadius: "50%",
              }}
            />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>
                Building your app…
              </div>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                The AI agent is writing and running your code
              </div>
            </div>
          </div>
        ) : activeTab === "preview" ? (
          <iframe
            ref={iframeRef}
            srcDoc={code}
            sandbox="allow-scripts allow-same-origin allow-forms"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              background: "#fff",
            }}
            title="App Preview"
          />
        ) : (
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              padding: 20,
            }}
          >
            <pre
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                fontSize: 13,
                lineHeight: 1.7,
                color: "#94a3b8",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
              }}
            >
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
