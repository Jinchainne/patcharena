import { describe, expect, it } from "vitest";
import { CHAIN_ID, executionResult } from "../lib/genlayer";
describe("Bradbury client",()=>{it("pins chain",()=>expect(CHAIN_ID).toBe("0x107D"));it("requires execution success",()=>{expect(executionResult({consensus_data:{leader_receipt:[{execution_result:1}]}})).toBe("FINISHED_WITH_RETURN");expect(executionResult({status_name:"FINALIZED"})).toBeUndefined();});});
