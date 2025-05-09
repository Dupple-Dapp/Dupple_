import { useReadContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";

export interface UserProfile {
  user: string;
  ens: string;
  description: string;
  profilePictureNFT: string;
  hobbies: string[];
  likes: string[];
  relationshipStatus: number;
  height: number;
  reason: number;
  drinking: number;
  smoking: number;
  gender: number;
  interestedIn: number;
  tipsReceived: bigint;
  tippers: string[];
  registered: boolean;
  resgistrationTime: bigint; // Note: typo in Solidity is preserved here
}

export const useGetUser = (userAddress: string | null) => {
  const result = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getUser",
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    ...result,
    data: result.data as UserProfile | undefined,
  };
};
