# Agent Builder

An AI-powered app builder — describe what you want and the AI agent generates and runs it instantly.

## Features

- Prompt-to-app generation using Claude AI
- Live preview in sandboxed iframe
- Streaming responses (watch the AI build in real time)
- Code viewer with copy & download
- Conversation history for iterative refinement

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the env example and add your Anthropic API key:
   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Usage

Type what you want to build in the chat panel and hit **Build**. The AI agent will:
1. Generate a complete HTML/CSS/JS app
2. Render it live in the preview panel
3. Allow you to iterate by sending follow-up prompts

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI**: Claude claude-opus-4-6 via Anthropic SDK
- **Styling**: Tailwind CSS
- **Execution**: Sandboxed iframe
