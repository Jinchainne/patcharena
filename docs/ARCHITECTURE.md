# Architecture

```text
Maintainer GEN ─┐
                ├─ PatchArena Intelligent Contract ── latest verdict ── payout
Challenger GEN ─┘                  ↑
                                   │ validator consensus
issue + policy + patch + tests + counterevidence
                 (bounded, untrusted public sources)
```

Policy and issue content are frozen at first review. Appeals reuse those snapshots while allowing one new evidence source. Unreachable or malformed sources produce `REPAIR_REQUIRED`, which cannot settle.

Finalization checks the latest status and verdict, marks settlement terminal, updates accounting, then schedules transfers on finalization. The browser independently requires successful execution and canonical state readback.
