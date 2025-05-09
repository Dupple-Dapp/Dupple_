import { useReadContract, useAccount } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";
import { useEffect, useState } from "react";

export const useGetAllUsersAddresses = () => {
  const { address } = useAccount();
  const [profiles, setProfiles] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  console.log("account:", address)

  const {
    data: allUsers,
    isError,
    isLoading: isContractLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getAllUsers",
  });

  useEffect(() => {
    if (allUsers) {
      try {
        // Cast the response to address[] type
        const userAddresses = allUsers as string[];
        setProfiles(userAddresses);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to parse user addresses"),
        );
        setLoading(false);
      }
    }
  }, [allUsers]);

  useEffect(() => {
    if (isError) {
      setError(new Error("Failed to fetch users from contract"));
      setLoading(false);
    }
  }, [isError]);

  // Combine loading states
  const isLoadingCombined = isLoading || isContractLoading;

  return {
    profiles,
    isLoading: isLoadingCombined,
    error,
    currentUser: address, // optionally expose current user address if needed
  };
};
