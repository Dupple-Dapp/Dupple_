"use client";

import React, { useState } from "react";
import { TabName } from "../../types";
import Header from "../components/Layout/Header";
import NavigationBar from "../components/Navigation/NavigationBar";
import HomePage from "../components/Pages/HomePage";
import ExplorePage from "../components/Pages/ExplorePage";
import MessagesPage from "../components/Pages/MessagePage";
import ProfilePage from "../components/Pages/ProfilePage";
import Likes from "../components/Pages/Likes";

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>("profile");

  // Render the active page based on the selected tab
  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "explore":
        return <ExplorePage />;
      case "likes":
        return <Likes />;
      case "messages":
        return <MessagesPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="bg-white text-gray-700 h-screen relative pb-16">
      <Header activeTab={activeTab} />
      <div className="overflow-y-auto h-full pb-16">{renderPage()}</div>
      <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Page;
