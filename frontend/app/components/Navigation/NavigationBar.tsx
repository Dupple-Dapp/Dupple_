"use client";

import React from 'react';
import { Home, User, Search, MessageSquare } from "lucide-react";
import { NavigationBarProps, TabName } from '@/types';
import Tab from './Tab';

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
      <Tab 
        icon={<Home size={24} />} 
        label="Home" 
        active={activeTab === 'home'} 
        onClick={() => setActiveTab('home')}
      />
      <Tab 
        icon={<Search size={24} />} 
        label="Explore" 
        active={activeTab === 'explore'} 
        onClick={() => setActiveTab('explore')}
      />
      <Tab 
        icon={<MessageSquare size={24} />} 
        label="Messages" 
        active={activeTab === 'messages'} 
        onClick={() => setActiveTab('messages')}
      />
      <Tab 
        icon={<User size={24} />} 
        label="Profile" 
        active={activeTab === 'profile'} 
        onClick={() => setActiveTab('profile')}
      />
    </div>
  );
};

export default NavigationBar;