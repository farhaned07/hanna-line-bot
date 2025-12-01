# Rich Menu Design Guide (Hybrid Strategy)

## Layout Overview
The Rich Menu is the primary entry point for the "Hybrid Smart" experience. It must balance quick actions (Native) with the premium voice experience (LIFF).

**Grid Structure (2 Rows, 3 Columns or 2x2)**
We recommend a **Large** Rich Menu (2500x1686px).

### Proposed Layout (2x2 Balanced)

```
┌──────────────────────────────┬──────────────────────────────┐
│                              │                              │
│      📞 Call Hanna           │      📝 Log Vitals           │
│    (Voice Experience)        │      (Text/Form)             │
│                              │                              │
├──────────────────────────────┼──────────────────────────────┤
│                              │                              │
│      💊 Medication           │      📊 My Health            │
│       (Reminders)            │      (History/Profile)       │
│                              │                              │
└──────────────────────────────┴──────────────────────────────┘
```

## Button Specifications

| Button | Label | Action Type | Payload / URL | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Top Left** | **Call Hanna** | **URI (LIFF)** | `line://app/{liffId}` | Opens the Hanna Live voice experience. **Primary Call to Action.** |
| **Top Right** | **Log Vitals** | Message | "Log Vitals" | Triggers the native quick reply flow for data entry. |
| **Bottom Left** | **Medication** | Message | "Medication" | Shows current medication status or checklist. |
| **Bottom Right** | **My Health** | Message | "Summary" | Shows the daily/weekly health summary Flex Message. |

## Design Guidelines

1.  **"Call Hanna" Prominence**:
    *   Use a distinct icon (Microphone or Headset).
    *   Consider a "pulse" visual effect or brighter background color to draw attention.
    *   Label should imply "Talk" or "Voice".

2.  **Color Palette**:
    *   **Primary**: LINE Green (#06C755) for positive actions.
    *   **Secondary**: White/Gray for background.
    *   **Icons**: Simple, bold outlines or filled icons.

3.  **Typography**:
    *   Large, readable Thai font (e.g., Kanit or Prompt).
    *   Keep labels short (2-3 words max).

## Implementation Notes
*   The `liffId` for "Call Hanna" will be generated after we deploy the `hanna-web` project.
*   The other buttons trigger keywords that the `hanna-line-bot` backend already listens for (or will listen for).
