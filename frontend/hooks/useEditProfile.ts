import { useWriteContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";

type EditProfileArgs = {
  ens: string;
  description: string;
  profilePic: string;
  interestedIn: number; // Enums.Gender
  relationshipStatus: number; // Enums.RelationshipStatus
  hobbyIndices: number[];
  drinking: number; // Enums.Drinking
  smoking: number; // Enums.Smoking
};

export const useEditProfile = () => {
  const {
    writeContractAsync,
    isPending,
    isSuccess,
    error,
    data,
  } = useWriteContract();

  const editProfile = async ({
    ens,
    description,
    profilePic,
    interestedIn,
    relationshipStatus,
    hobbyIndices,
    drinking,
    smoking,
  }: EditProfileArgs) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "editProfile",
      args: [
        ens,
        description,
        profilePic,
        interestedIn,
        relationshipStatus,
        hobbyIndices,
        drinking,
        smoking,
      ],
    });
  };

  return {
    editProfile,
    isPending,
    isSuccess,
    error,
    data,
  };
};
