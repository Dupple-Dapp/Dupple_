import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { client } from "../providers/thirdwebAAclient";
import { CONTRACT_ADDRESS } from "../contract/address";
import abi from "../contract/abi.json";

export const useRegisterUser = () => {
  const account = useActiveAccount();
  const contract = getContract({
    address: CONTRACT_ADDRESS,
    chain: baseSepolia,
    abi: abi as any,
    client,
  });

  const { mutateAsync, isPending, error } = useSendTransaction();

  const registerUser = async (
    ens: string,
    description: string,
    profilePic: string,
    interestedIn: number,
    gender: number,
    relationshipStatus: number,
    height: number,
    hobbyIndices: number[],
    reasonForJoining: number,
    drinking: number,
    smoking: number
  ) => {
    if (!account) {
      throw new Error("Smart account not ready. Please complete social login.");
    }

    if (!account.address) {
      throw new Error("Account address not available");
    }

    const tx = prepareContractCall({
      contract: contract,
      method: "register",
      params: [
        ens,
        description,
        profilePic,
        interestedIn,
        gender,
        relationshipStatus,
        height,
        hobbyIndices,
        reasonForJoining,
        drinking,
        smoking,
      ],
    });

    return await mutateAsync(tx);
  };

  return {
    registerUser,
    isPending,
    error,
  };
};
