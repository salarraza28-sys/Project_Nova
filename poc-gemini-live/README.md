# poc-gemini-live

Standalone test harness for the **Gemini 3.1 Flash Live Preview migration POC**.

Tests whether `gemini-3.1-flash-live-preview` is a drop-in replacement for
`gemini-2.5-flash-native-audio-preview-12-2025` in a real-time audio session.

---

## Project Structure

```
poc-gemini-live/
├── index.html          ← Browser test page (all scenarios, audio, results)
├── audio-processor.js  ← AudioWorklet: captures mic PCM for Gemini Live
├── serve.mjs           ← Local HTTP server (required — AudioWorklet needs HTTP)
├── package.json
├── .env.example        ← Copy to .env and add your API key
├── poc-results.md      ← Report template to fill in after testing
└── .gitignore
```

---

## Quick Start

### 1. Get a free Gemini API key

Go to https://aistudio.google.com/apikey and create a key.

### 2. Install dependencies

```bash
cd poc-gemini-live
npm install
```

### 3. Start the local server

```bash
npm start
```

This starts a static file server at **http://localhost:3000**.

> ⚠️ You **must** use the server URL — `audio-processor.js` is an AudioWorklet
> and browsers block it when loaded via `file://`.

### 4. Open the test page

Open **http://localhost:3000** in Chrome or Edge.

### 5. Enter your API key

Paste your `GEMINI_API_KEY` into the key field in the sidebar.

---

## Running the Scenarios

Select a scenario in the left sidebar, then click **▶ Start Scenario**.

| Scenario | Model | Send Method | Purpose |
|---|---|---|---|
| **A** | gemini-2.5-flash (old) | sendClientContent | Baseline — verify harness works |
| **B** | gemini-3.1-flash (new) | sendClientContent | Does old method still work? |
| **C** | gemini-3.1-flash (new) | sendRealtimeInput | Does new method fix any breakage? |

### What happens automatically

- **T1** (~1 s after connect): sends `"The student is ready. Introduce yourself and begin."`
- **T2** (after your timer): sends `"Please wrap up the session now and call end_session."`
- When `end_session` fires: scores overlay appears → session closes cleanly

Allow microphone access when prompted — the AI will speak back through your speakers.

---

## Tabs

| Tab | Content |
|---|---|
| **Event Log** | Real-time stream of every WebSocket event, audio chunk, and tool call |
| **Results** | Pass/Fail matrix for all three scenarios |
| **Report** | Auto-generated Markdown report — copy and paste into `poc-results.md` |

---

## Filling in the Report

After running all scenarios, go to the **Report** tab, click **📋 Copy Markdown**,
and paste it into `poc-results.md`. Add any manual notes, then hand it to the
senior dev.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `AudioWorklet` error in console | Make sure you're on `http://localhost:3000`, not `file://` |
| SDK import fails | Check your internet connection (loads from esm.run CDN) |
| No audio output | Check system volume; AudioContext may need a user gesture first |
| `end_session` never fires | Extend the T2 timer; the model needs more time for 2 questions |
| CORS / 400 error | Check your API key is valid and has Gemini Live access |

---

## Key Files in the Production Codebase (for reference)

The file to modify if migration requires code changes:
- `src/hooks/useNovaClient.ts` — 3 call sites of `sendClientContent` for text turns

---
