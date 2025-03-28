import React from "react";
import { FaChartBar, FaExchangeAlt, FaCog } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Home, BarChart, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="sidebar p-4 bg-sidebarGradientStart shadow-xl h-screen text-white w-64">
    <div className="sidebar-item flex items-center gap-3 p-3 hover:bg-sidebarHover transition-all rounded-lg cursor-pointer">
      <Home className="w-6 h-6 text-white" />
      <span>Dashboard</span>
    </div>
    
    <div className="sidebar-item flex items-center gap-3 p-3 hover:bg-sidebarHover transition-all rounded-lg cursor-pointer">
      <BarChart className="w-6 h-6 text-white" />
      <span>Reports</span>
    </div>
    
    <div className="sidebar-item flex items-center gap-3 p-3 hover:bg-sidebarHover transition-all rounded-lg cursor-pointer">
      <Settings className="w-6 h-6 text-white" />
      <span>Settings</span>
    </div>
  </div>
  );
};

export default Sidebar;