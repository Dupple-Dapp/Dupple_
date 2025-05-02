"use client";

import React from 'react';
import { Settings, PenSquare } from "lucide-react";
import { HeaderProps, TabName } from '@/types';

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const titles: Record<TabName, string> = {
    home: "Home",
    explore: "Explore",
    messages: "Messages",
    profile: "Profile"
  };

  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <h1 className="text-xl font-bold">{titles[activeTab]}</h1>
      <div className="flex gap-4">
        <Settings className="text-gray-600" />
        <PenSquare className="text-gray-600" />
      </div>
    </div>
  );
};

export default Header;