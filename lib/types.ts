export type BountyStatus = "OPEN" | "PATCHED" | "CHALLENGED" | "REVIEWED" | "APPEALED" | "FINALIZED";
export type Verdict = "MERGE_READY" | "NEEDS_WORK" | "REJECTED" | "REPAIR_REQUIRED";
export interface Bounty {
  id: number; maintainer: string; contributor: string; title: string; issue_url: string; policy_url: string;
  patch_url: string; test_url: string; amount: string; challenge_bond: string; status: BountyStatus;
  challenger: string; counterevidence_url: string; revision: number; verdict: Verdict | ""; payout_bps: number;
  confidence: number; reason: string; policy_digest: string; reviewed_at: number; appeal_used: boolean;
}
export interface Summary { bounties: number; open: number; under_review: number; finalized: number; locked: string; }
