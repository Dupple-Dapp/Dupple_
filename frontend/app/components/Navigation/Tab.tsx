import React from 'react';
import { TabProps } from '@/types';

const Tab: React.FC<TabProps> = ({ icon, label, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 ${
        active ? "text-pink-500" : "text-gray-500"
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default Tab;