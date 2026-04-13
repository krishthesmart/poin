"use client";

import type { Message } from "@/app/page";

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div
        className="fade-in"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <div
          style={{
            maxWidth: "80%",
            padding: "10px 14px",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            borderRadius: "14px 14px 4px 14px",
            fontSize: 14,
            lineHeight: 1.6,
            color: "#fff",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  // Parse assistant message to show text parts cleanly (strip code blocks for display)
  const textContent = message.content
    .replace(/```(?:html|HTML|css|CSS|js|javascript)[\s\S]*?```/g, "")
    .trim();

  const hasCode = Boolean(message.code);

  return (
    <div className="fade-in" style={{ display: "flex", gap: 10 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "linear-gradient(135deg, #7c3aed22, #a855f722)",
          border: "1px solid #7c3aed44",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        ✦
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {textContent && (
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "#cbd5e1",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {textContent}
          </div>
        )}
        {hasCode && (
          <div
            style={{
              marginTop: 8,
              padding: "6px 12px",
              background: "#10b98122",
              border: "1px solid #10b98144",
              borderRadius: 8,
              fontSize: 12,
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>✓</span>
            <span>App generated — see the preview on the right</span>
          </div>
        )}
        <div style={{ fontSize: 11, color: "#374151", marginTop: 4 }}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
