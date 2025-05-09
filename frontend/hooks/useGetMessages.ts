// hooks/useMessages.ts
import { useReadContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

// Define message structure if known
interface Message {
  sender: string;
  content: string;
  timestamp: bigint;
}

export const useGetMessages = (matchAddress: string | null) => {
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const enabled = !!matchAddress && !!address;

  const { data: sentMessages } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getMessages",
    args: [address, matchAddress],
    query: {
      enabled,
    },
  });

  const { data: receivedMessages } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getMessages",
    args: [matchAddress, address],
    query: {
      enabled,
    },
  });

  useEffect(() => {
    if (!enabled) return;

    setLoading(true);
    const sent = (sentMessages as Message[]) || [];
    const received = (receivedMessages as Message[]) || [];

    const merged = [...sent, ...received].sort(
      (a, b) => Number(a.timestamp) - Number(b.timestamp),
    );

    setMessages(merged);
    setLoading(false);
  }, [sentMessages, receivedMessages, enabled]);

  return { messages, loading };
};
