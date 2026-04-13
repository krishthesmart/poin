import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are an expert full-stack developer and AI agent specializing in building complete, self-contained web applications. When given a request, you will:

1. Think through the requirements carefully
2. Generate a SINGLE, complete HTML file that includes all HTML, CSS (inline <style>), and JavaScript (inline <script>) needed to run the app
3. The app must be fully functional, visually polished, and work without any external dependencies (except CDN links for libraries if absolutely needed)
4. Use modern design: dark themes preferred, smooth animations, responsive layouts
5. Always wrap your final code in a \`\`\`html code block

Design guidelines:
- Use CSS variables for theming
- Add smooth transitions and micro-animations
- Make it visually impressive and professional
- Handle edge cases gracefully
- Add helpful placeholder content or sample data to demonstrate functionality

After the code block, briefly explain what was built and key features (2-3 sentences max).`;

type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  const { prompt, history = [] } = await req.json();

  if (!prompt?.trim()) {
    return new Response("Prompt is required", { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("ANTHROPIC_API_KEY not configured", { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  // Build message history (filter to keep context clean)
  const historyMessages: Anthropic.MessageParam[] = history
    .slice(-10) // Keep last 10 messages for context
    .map((m: HistoryMessage) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  // Append the new user message
  historyMessages.push({ role: "user", content: prompt });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: "claude-opus-4-6",
          max_tokens: 8096,
          system: SYSTEM_PROMPT,
          messages: historyMessages,
          stream: true,
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const data = JSON.stringify({ text: event.delta.text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
