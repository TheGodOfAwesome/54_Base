import { createBundlerClient, sepolia, arbitrumSepolia } from "@alchemy/aa-core";
import { http } from "viem";

export const publicClient = createBundlerClient({
  chain: arbitrumSepolia,
  transport: http("/api/rpc"),
});
