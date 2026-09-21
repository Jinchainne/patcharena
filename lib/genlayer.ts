"use client";
import { createClient } from "genlayer-js";
import { testnetBradbury } from "genlayer-js/chains";
import type { Bounty, Summary } from "./types";

export const CHAIN_ID = "0x107D";
export const EXPLORER = "https://explorer-bradbury.genlayer.com";
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "") as `0x${string}`;
type Provider = { request(args: { method: string; params?: unknown[] }): Promise<unknown> };
export type TxPhase = "SIGN" | "SUBMITTED" | "CONSENSUS" | "FINALIZED" | "READBACK" | "SUCCESS" | "ERROR";

function wallet(): Provider { const p = (window as typeof window & { ethereum?: Provider }).ethereum; if (!p) throw new Error("Install an EIP-1193 wallet"); return p; }
function address() { if (!/^0x[0-9a-fA-F]{40}$/.test(CONTRACT_ADDRESS) || /^0x0{40}$/.test(CONTRACT_ADDRESS)) throw new Error("Contract is not configured"); return CONTRACT_ADDRESS; }

export async function connectWallet() {
  const provider = wallet();
  const accounts = await provider.request({ method: "eth_requestAccounts" }) as string[];
  try { await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_ID }] }); }
  catch (error) { if ((error as { code?: number }).code !== 4902) throw error; await provider.request({ method: "wallet_addEthereumChain", params: [{ chainId: CHAIN_ID, chainName: "GenLayer Bradbury Testnet", nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 }, rpcUrls: ["https://rpc-bradbury.genlayer.com"], blockExplorerUrls: [EXPLORER] }] }); }
  if (!accounts[0]) throw new Error("Wallet returned no account"); return accounts[0];
}

const reader = createClient({ chain: testnetBradbury });
async function read<T>(functionName: string, args: unknown[] = []) { return reader.readContract({ address: address(), functionName, args: args as never[] }) as Promise<T>; }
export const getBounties = () => read<Bounty[]>("list_bounties");
export const getBounty = (id: number) => read<Bounty>("get_bounty", [id]);
export const getSummary = () => read<Summary>("get_summary");

export function executionResult(receipt: unknown): string | undefined {
  const seen = new Set<unknown>();
  const visit = (value: unknown): string | undefined => {
    if (value == null || seen.has(value)) return undefined;
    if (typeof value === "string") { const n = value.toUpperCase(); if (["FINISHED_WITH_RETURN", "FINISHED_WITH_ERROR"].includes(n)) return n; }
    if (typeof value === "number") return value === 1 ? "FINISHED_WITH_RETURN" : value === 2 ? "FINISHED_WITH_ERROR" : undefined;
    if (Array.isArray(value)) { seen.add(value); for (const item of value) { const x = visit(item); if (x) return x; } }
    if (typeof value === "object") { seen.add(value); const r = value as Record<string, unknown>; for (const key of ["txExecutionResultName", "tx_execution_result_name", "execution_result", "executionResult", "tx_execution_result", "consensus_data", "leader_receipt", "receipts", "data"]) { const x = visit(r[key]); if (x) return x; } }
    return undefined;
  }; return visit(receipt);
}

async function canonical<T>(readback: () => Promise<T>, expected: (value: T) => boolean) { for (let i=0;i<50;i++) { try { const v=await readback(); if(expected(v)) return v; } catch {} await new Promise(r=>setTimeout(r,Math.min(1000+i*200,4000))); } throw new Error("Canonical state did not reflect the transaction"); }

export async function writeAndVerify<T>(account: string, functionName: string, args: unknown[], readback: () => Promise<T>, expected: (value:T)=>boolean, phase:(p:TxPhase,h?:string)=>void, value=0n) {
  try { const client=createClient({chain:testnetBradbury,account:account as `0x${string}`,provider:wallet()}); phase("SIGN"); const hash=await client.writeContract({address:address(),functionName,args:args as never[],value}); phase("SUBMITTED",hash); phase("CONSENSUS",hash); const receipt=await client.waitForTransactionReceipt({hash,status:"FINALIZED",retries:220,interval:4000} as never); const result=executionResult(receipt); if(result!=="FINISHED_WITH_RETURN") throw new Error(`GenVM execution failed: ${result||"UNKNOWN"}`); phase("FINALIZED",hash); phase("READBACK",hash); const state=await canonical(readback,expected); phase("SUCCESS",hash); return {hash,state}; } catch(error){phase("ERROR");throw error;}
}

export function policyBoundToExecution(b: Bounty) { return /^[0-9a-f]{64}$/.test(b.policy_digest) && ["MERGE_READY","NEEDS_WORK","REJECTED","REPAIR_REQUIRED"].includes(b.verdict) && b.payout_bps>=0 && b.payout_bps<=10000; }
