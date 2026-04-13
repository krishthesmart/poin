"use client";

import { useState, useRef, useEffect } from "react";
import ChatPanel from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";
import Header from "@/components/Header";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  code?: string;
  timestamp: Date;
};

export type BuildStatus = "idle" | "building" | "done" | "error";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [status, setStatus] = useState<BuildStatus>("idle");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const abortRef = useRef<AbortController | null>(null);

  const handleSend = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setStatus("building");

    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMsg]);

    abortRef.current = new AbortController();

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(await res.text());

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: fullText } : m
                  )
                );
              }
            } catch {}
          }
        }
      }

      // Extract code block from the response
      const codeMatch = fullText.match(/```(?:html|HTML)([\s\S]*?)```/);
      if (codeMatch) {
        const code = codeMatch[1].trim();
        setGeneratedCode(code);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, code } : m
          )
        );
        setActiveTab("preview");
      }

      setStatus("done");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setStatus("idle");
        return;
      }
      setStatus("error");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Something went wrong. Please try again." }
            : m
        )
      );
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setStatus("idle");
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setGeneratedCode("");
    setStatus("idle");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0a0a0f",
        color: "#e2e8f0",
      }}
    >
      <Header onReset={handleReset} />

      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left: Chat */}
        <div
          style={{
            width: "40%",
            minWidth: 340,
            borderRight: "1px solid #2a2a3a",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatPanel
            messages={messages}
            status={status}
            onSend={handleSend}
            onStop={handleStop}
          />
        </div>

        {/* Right: Preview / Code */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <PreviewPanel
            code={generatedCode}
            status={status}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
}
