// // hooks/useUserProfiles.ts
// import { useReadContract, useAccount } from "wagmi";
// import abi from "../contract/abi.json";
// import { CONTRACT_ADDRESS } from "@/contract/address";
// import { useEffect, useState } from "react";

// export const useUserProfiles = () => {
//   const { address } = useAccount();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [profiles, setProfiles] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const { data: allUsers } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi,
//     functionName: "getAllUsers",
//   });

//   const { data: userProfile, refetch } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi,
//     functionName: "getUser",
//     args: [allUsers?.[currentIndex]],
//     query: {
//       enabled: !!allUsers && currentIndex < allUsers.length,
//     },
//   });

//   useEffect(() => {
//     if (allUsers && allUsers.length > 0) {
//       setLoading(true);
//       const filteredUsers = (allUsers as string[]).filter(
//         (user) => user !== address,
//       );
//       setProfiles([]);
//       setCurrentIndex(0);
//     }
//   }, [allUsers, address]);

//   useEffect(() => {
//     if (userProfile && allUsers) {
//       setProfiles((prev) => [...prev, userProfile]);
//       if (currentIndex < (allUsers as string[]).length - 1) {
//         setCurrentIndex((prev) => prev + 1);
//       } else {
//         setLoading(false);
//       }
//     }
//   }, [userProfile]);

//   return { profiles, loading, refetch };
// };


// hooks/useUserProfile.ts
import { useReadContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";

export const useUserProfiles = (userAddress: string | null) => {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getUser",
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });
};