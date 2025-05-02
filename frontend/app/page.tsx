"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import { Gift, Lock, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  
  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-purple-600 p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-purple-600 animate-fade-out">
          <Icon name="check" size="sm" className="text-purple-600" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  // Function to navigate to registration page
  const navigateToRegister = () => {
    // You would implement navigation to your existing registration page here
    // This could be router.push('/register') or any other navigation method
    console.log("Navigating to registration page");
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-gray-800">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1">
          <div className="flex flex-col items-center text-center px-4 py-6">
            {/* Hero Section */}
            <div className="mb-6">
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-500 mb-2">
                Dupple
              </div>
              <p className="text-lg text-gray-600 mb-8">
                Find your perfect match on Chain
              </p>
              
              {/* App Showcase Visual */}
              <div className="relative w-64 h-64 mx-auto mb-8">
                <div className="absolute top-0 left-0 w-56 h-56 bg-purple-100 rounded-lg transform rotate-6"></div>
                <div className="absolute top-0 left-0 w-56 h-56 bg-purple-200 rounded-lg transform -rotate-3"></div>
                <div className="absolute top-0 left-0 w-56 h-56 bg-white shadow-md rounded-lg flex items-center justify-center">
                  <div className="text-3xl text-purple-600">
                    <Icon name="heart" size="lg" />
                  </div>
                </div>
              </div>
              
              <Button
                onClick={navigateToRegister}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium text-lg transition-all shadow-lg"
              >
                <Link href="/register">
                Get Started
                </Link>
              </Button>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-sm">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 mb-2">
                <Users />
                </div>
                <h3 className="font-medium">Meet Others</h3>
                <p className="text-sm text-gray-600">Connect with like-minded crypto enthusiasts</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 mb-2">
                <Lock />
                </div>
                <h3 className="font-medium">Secure</h3>
                <p className="text-sm text-gray-600">Built on Base with wallet verification</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 mb-2">
                <Zap />
                </div>
                <h3 className="font-medium">Fast</h3>
                <p className="text-sm text-gray-600">Quick and seamless experience</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 mb-2">
                <Gift />
                </div>
                <h3 className="font-medium">Rewards</h3>
                <p className="text-sm text-gray-600">Earn rewards for participation</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}