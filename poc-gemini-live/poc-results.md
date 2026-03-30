# POC Results: Gemini 3.1 Flash Live Preview

**Tested by:** [name]
**Date:** [date]
**SDK:** @google/genai [version installed]
**Old model:** gemini-2.5-flash-native-audio-preview-12-2025
**New model:** gemini-3.1-flash-live-preview

---

## Scenario A — Baseline (old model)
Overall: Pass / Fail
Notes:

## Scenario B — New model, sendClientContent
Overall: Pass / Fail

| Check | Pass/Fail | Console error (if any) |
|---|---|---|
| WebSocket connects | | |
| NOVA speaks intro (T1 auto-start) | | |
| Conversation works (back-and-forth) | | |
| Termination signal fires end_session (T2) | | |
| end_session args valid (scores + reason) | | |
| Session ends cleanly | | |

## Scenario C — New model, sendRealtimeInput
Overall: Pass / Fail

| Check | Pass/Fail | Console error (if any) |
|---|---|---|
| WebSocket connects | | |
| NOVA speaks intro (T1 auto-start) | | |
| Conversation works (back-and-forth) | | |
| Termination signal fires end_session (T2) | | |
| end_session args valid (scores + reason) | | |
| Session ends cleanly | | |

## Scenario D — Reconnect (if tested)
Overall: Pass / Fail / Skipped
Notes:

---

## Key Finding: sendClientContent

- Works in 3.1 for mid-session text turns: Yes / No / Partially
- sendRealtimeInput({text}) works as replacement: Yes / No / Partially
- Evidence: [paste exact console error or "no errors observed"]

---

## Console Errors Log

[List every unexpected error with the scenario step where it occurred]

---

## Recommendation

Pick one:

- [ ] Safe to migrate — one-line model string change, no code fixes needed
- [ ] Safe to migrate with one targeted fix:
      Replace `sendClientContent` with `sendRealtimeInput` in `sendTextMessage()` function
      (3 call sites in `useNovaClient.ts`)
- [ ] Needs further investigation — describe:
- [ ] Not ready — critical failures:

---

## Additional Notes

[Anything unexpected or worth flagging to senior dev]
