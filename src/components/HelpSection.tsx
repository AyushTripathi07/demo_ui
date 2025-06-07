import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';

const HelpSection: React.FC = () => {
  const [helpText, setHelpText] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Help request:', helpText);
    setHelpText('');
  };
  
  return (
    <div className="mt-auto pt-6">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={helpText}
          onChange={(e) => setHelpText(e.target.value)}
          placeholder="How can I help you?"
          className="w-full bg-background-cardLight rounded-lg px-4 py-3 pr-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-primary"
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowUp size={20} />
        </button>
      </form>
    </div>
  );
};

export default HelpSection;