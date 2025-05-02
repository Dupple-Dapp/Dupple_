import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { client } from "../providers/thirdwebAAclient";
import abi from "../contract/abi.json";

// Define the enum types based on your contract
export enum RelationshipStatus {
  Single,
  InRelationship,
  Complicated,
  Married,
}

export enum ReasonForJoining {
  Dating,
  Friends,
  Networking,
  Explore,
}

export enum Drinking {
  Never,
  Socially,
  Regularly,
  Against,
}

export enum Smoking {
  Never,
  Socially,
  Regularly,
  Against,
}

export enum Gender {
  Male,
  Female,
  NonBinary,
  Other,
}

// Define the UserProfile type
export type UserProfile = {
  user: string;
  ens: string;
  description: string;
  profilePictureNFT: string;
  hobbies: string[];
  likes: string[];
  relationshipStatus: RelationshipStatus;
  height: number;
  reason: ReasonForJoining;
  drinking: Drinking;
  smoking: Smoking;
  gender: Gender;
  interestedIn: Gender;
  tipsReceived: bigint;
  tippers: string[];
  registered: boolean;
  resgistrationTime: bigint;
};

export const useGetUser = (userAddress?: string) => {
  const contract = getContract({
    address: "0x63ccc44b06a76be04c5fbbc52b318d4f17660dd3",
    chain: baseSepolia,
    abi: abi as any,
    client,
  });

  const {
    data: userProfile,
    isLoading,
    error,
  } = useReadContract({
    contract,
    method: "getUser",
    params: [userAddress],
    // enabled: !!userAddress,
  });

  return {
    userProfile: userProfile as UserProfile | undefined,
    isLoading,
    error,
  };
};
