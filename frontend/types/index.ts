export type TabName = 'home' | 'explore' | 'messages' | 'profile';

export interface TabProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export interface NavigationBarProps {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

export interface HeaderProps {
  activeTab: TabName;
}

// Types for dummy data
export interface UserProfile {
  name: string;
  age: number;
  distance: number;
  bio?: string;
  interests?: string[];
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}