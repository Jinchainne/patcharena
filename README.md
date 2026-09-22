# PatchArena

### Consensus-reviewed bounties for software patches.

PatchArena is a GenLayer-native marketplace where maintainers fund an issue, contributors submit a patch and reproducible tests, and validators decide whether the change is merge-ready. The verdict is not decorative: it controls the payout, refund, and bonded challenge settlement on-chain.

[Live app](https://patcharena-three.vercel.app) · [GitHub](https://github.com/Jinchainne/patcharena) · [Bradbury contract](https://explorer-bradbury.genlayer.com/address/0xf2a588Dc1954e17AB83cBea58CFFdb4E8D9A38A8)

## Why GenLayer

Patch correctness is semantic. A deterministic hash cannot decide whether a change solves an issue under a repository policy, whether tests support the claim, or whether counterevidence defeats it. The contract therefore:

- retrieves bounded public sources with `gl.nondet.web.get`;
- evaluates them with `gl.nondet.exec_prompt`;
- reproduces the decision through `gl.vm.run_nondet_unsafe`;
- binds consensus to policy, issue, and complete evidence digests;
- routes the structured payout percentage into escrow settlement.

All source text is untrusted data. Prompts embedded in repositories, issues, patches, or tests are never treated as validator instructions.

## Bounty lifecycle

```text
MAINTAINER FUNDS
  → CONTRIBUTOR SUBMITS PATCH + TESTS
  → OPTIONAL BONDED COUNTEREVIDENCE
  → VALIDATOR CONSENSUS
  → ONE APPEAL OR EVIDENCE REPAIR
  → FINALIZE AFTER 24 HOURS
```

Verdicts are `MERGE_READY`, `NEEDS_WORK`, `REJECTED`, or `REPAIR_REQUIRED`. A bounty can be finalized only once; repair-required evidence cannot be paid out until it is repaired and reviewed.

## Production deployment

| Resource | Value |
| --- | --- |
| Network | GenLayer Bradbury Testnet |
| Chain ID | `4221` (`0x107D`) |
| Contract | [`0xf2a588Dc1954e17AB83cBea58CFFdb4E8D9A38A8`](https://explorer-bradbury.genlayer.com/address/0xf2a588Dc1954e17AB83cBea58CFFdb4E8D9A38A8) |
| Deployment tx | [`0xcb1fdf...db95b8`](https://explorer-bradbury.genlayer.com/transactions/0xcb1fdf49449ff362af77396aeee01246cc942dada363758f4a072122f8db95b8) |
| Web app | [patcharena-three.vercel.app](https://patcharena-three.vercel.app) |

## Run locally

Requirements: Node.js 20+, npm, a browser wallet, and Bradbury test GEN.

```bash
npm ci
copy .env.example .env.local       # Windows
# cp .env.example .env.local       # macOS / Linux
npm run dev
```

Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to the deployed address above. Never commit `.env.local` or wallet keys.

## Verification

```bash
npm run verify
python -m pytest -q
genvm-lint check contracts/patcharena.py
```

The verification suite covers client finality/readback handling, contract guards, evidence-digest binding, authorization boundaries, and exactly-once settlement assumptions.

## Repository map

```text
contracts/patcharena.py  Consensus contract and escrow state machine
lib/genlayer.ts          Wallet, Bradbury client, finality, canonical readback
app/page.tsx             Patch board, bounty room, and action flows
tests/                   TypeScript and Python verification
docs/                    Architecture and design notes
```

## Security notes

PatchArena is deployed on a public testnet. Review every URL before funding, use test GEN only, and inspect the contract before relying on it for valuable assets. The frontend reports success only after finalized execution and canonical state verification; it does not fabricate empty or pending bounty records.

## License

MIT
