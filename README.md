# PatchArena

PatchArena is a bonded software-bounty marketplace where GenLayer validators decide whether a patch actually solves an issue under the maintainer's acceptance policy.

## Why GenLayer

A patch cannot be judged fairly from a hash or a deterministic condition. The contract must interpret an issue, repository policy, patch, test report and adversarial counterevidence. `contracts/patcharena.py` retrieves those public sources with `gl.nondet.web.get`, reasons with `gl.nondet.exec_prompt`, and requires independent validator reproduction through `gl.vm.run_nondet_unsafe`.

The structured consensus result is not decorative: `payout_bps` controls the contributor payout, maintainer refund and challenge-bond winner.

## Lifecycle

1. Maintainer creates a funded bounty and fixes the challenge bond.
2. An independent contributor submits patch and test URLs.
3. A third party may lock the exact bond with counterevidence.
4. Validators review bounded untrusted sources; issue and policy snapshots are frozen.
5. A party may use one evidence-backed appeal.
6. After 24 hours, only the latest non-repair verdict can settle exactly once.

## Run

```bash
npm ci
copy .env.example .env.local
npm run dev
```

## Live deployment

- Network: GenLayer Bradbury testnet (`chainId 4221`)
- Contract: `0xDe9546aC8425A2c8E1578e30AAA8B1d2c6E9781E`
- Deployment transaction: `0xeb4d199ddc709bd09a41daa733d93d0ed7a3467737b3672dfd84dd8665c9a9c6`

Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to that address for local or hosted builds.

## Verify

```bash
npm run verify
python -m pytest -q
genvm-lint check contracts/patcharena.py
```

The UI never fabricates chain records and reports success only after finality, successful GenVM execution and canonical readback.
