import React from 'react';
import { TabProps } from '@/types';

const Tab: React.FC<TabProps> = ({ icon, label, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 ${
        active ? "text-purple-800" : "text-gray-500"
      }`}
    >
      {icon}
      <span className="text-xs mt-1 text-purple-800">{label}</span>
    </button>
  );
};

export default Tab;