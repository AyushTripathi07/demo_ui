import React from 'react';
import { Bell, ChevronDown, Search } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-background-dark border-b border-gray-800 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-background-cardLight rounded-lg px-4 py-2 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
            <Bell size={20} />
          </button>
          <div className="flex items-center space-x-2 ml-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-background-dark font-bold">D</span>
            </div>
            <span className="text-text-primary">Demo User</span>
            <ChevronDown size={16} className="text-text-secondary" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;