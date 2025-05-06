// hooks/useMatches.ts
import { useReadContract, useAccount } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";

export const useMatches = () => {
  const { address } = useAccount();

  const { data: matches, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getMatches",
    args: [address],
  });

  return { matches: matches as string[] | undefined, refetch };
};
