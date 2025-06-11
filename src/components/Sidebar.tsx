import React from 'react';
import { Home, Twitter, MessageSquare, Settings, HelpCircle, Airplay } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <Home size={20} />, route: '/', label: 'Dashboard' },
    { icon: <Twitter size={20} />, route: '/twitter', label: 'Twitter Monitoring' },
    { icon: <MessageSquare size={20} />, route: '/chat', label: 'Messages' },
    { icon: <Airplay size={20} />, route: '/article-scraper', label: 'Article Scraper' },
    { icon: <Settings size={20} />, route: '/settings', label: 'Settings' },
    { icon: <HelpCircle size={20} />, route: '/help', label: 'Help' },
  ];

  return (
    <div className="w-16 bg-background-card min-h-screen flex flex-col items-center py-6 border-r border-gray-800">
      <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center mb-8">
        <span className="text-background-dark font-bold">Ti</span>
      </div>

      <div className="flex flex-col space-y-6">
        {menuItems.map((item, index) => (
          <Link
            to={item.route}
            key={index}
            className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
              location.pathname === item.route
                ? 'bg-blue-500 text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-background-cardLight'
            }`}
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;