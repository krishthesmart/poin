"use client";

import { useEffect, useRef, useState } from "react";
import type { Message, BuildStatus } from "@/app/page";
import MessageBubble from "./MessageBubble";

type Props = {
  messages: Message[];
  status: BuildStatus;
  onSend: (prompt: string) => void;
  onStop: () => void;
};

const EXAMPLES = [
  "Build a beautiful todo app with drag-and-drop",
  "Create a real-time countdown timer with themes",
  "Make a markdown editor with live preview",
  "Build a calculator with history log",
  "Create a color palette generator",
  "Make an interactive quiz game",
];

export default function ChatPanel({ messages, status, onSend, onStop }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isBuilding = status === "building";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submit = () => {
    if (isBuilding || !input.trim()) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#0d0d16",
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 24,
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #7c3aed22, #a855f722)",
                border: "1px solid #7c3aed44",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              ✦
            </div>
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "#e2e8f0",
                }}
              >
                What do you want to build?
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                Describe your app and the AI agent will generate and run it
                instantly.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                width: "100%",
              }}
            >
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    setInput(ex);
                    textareaRef.current?.focus();
                  }}
                  style={{
                    padding: "8px 12px",
                    background: "#12121a",
                    border: "1px solid #2a2a3a",
                    borderRadius: 10,
                    color: "#94a3b8",
                    fontSize: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    lineHeight: 1.4,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#7c3aed55";
                    e.currentTarget.style.color = "#e2e8f0";
                    e.currentTarget.style.background = "#1a1a26";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a3a";
                    e.currentTarget.style.color = "#94a3b8";
                    e.currentTarget.style.background = "#12121a";
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}

        {isBuilding && messages.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              background: "#12121a",
              border: "1px solid #2a2a3a",
              borderRadius: 10,
              width: "fit-content",
            }}
          >
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="pulse-dot"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#a855f7",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: 12, color: "#64748b" }}>Building...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #2a2a3a",
          background: "#12121a",
        }}
      >
        <div
          style={{
            background: "#1a1a26",
            border: "1px solid #2a2a3a",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "10px 12px",
            transition: "border-color 0.15s",
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "#7c3aed55";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = "#2a2a3a";
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Describe what you want to build…"
            rows={1}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e2e8f0",
              fontSize: 14,
              lineHeight: 1.6,
              resize: "none",
              fontFamily: "inherit",
              width: "100%",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 11, color: "#374151" }}>
              {isBuilding ? "" : "Enter to send · Shift+Enter for newline"}
            </span>
            {isBuilding ? (
              <button
                onClick={onStop}
                style={{
                  padding: "6px 16px",
                  background: "#ef444422",
                  border: "1px solid #ef444455",
                  borderRadius: 8,
                  color: "#ef4444",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Stop
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!input.trim()}
                style={{
                  padding: "6px 16px",
                  background: input.trim()
                    ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                    : "#1a1a26",
                  border: "1px solid",
                  borderColor: input.trim() ? "transparent" : "#2a2a3a",
                  borderRadius: 8,
                  color: input.trim() ? "#fff" : "#374151",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.15s",
                }}
              >
                Build ✦
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
