import { useAccount, useWriteContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";
import { useChainId } from "wagmi";


export const useRegisterUser = () => {
  const { writeContract, data, isPending, isSuccess, error } =
    useWriteContract();
    const account = useAccount();
    const chainId = useChainId();
    console.log("Connected chain ID:", chainId);

  const registerUser = ({
    ens,
    description,
    profilePic,
    interestedIn,
    gender,
    relationshipStatus,
    height,
    hobbyIndices,
    reason,
    drinking,
    smoking,
  }: {
    ens: string;
    description: string;
    profilePic: string;
    interestedIn: number;
    gender: number;
    relationshipStatus: number;
    height: number;
    hobbyIndices: number[];
    reason: number;
    drinking: number;
    smoking: number;
  }) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "register",
      args: [
        ens,
        description,
        profilePic,
        interestedIn,
        gender,
        relationshipStatus,
        height,
        hobbyIndices,
        reason,
        drinking,
        smoking,
      ],
    });
  };

  console.log("account:", account.address)

  return {
    registerUser,
    data,
    isPending,
    isSuccess,
    error,
  };
};
