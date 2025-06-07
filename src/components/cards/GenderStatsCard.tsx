import React from 'react';

const GenderStatsCard: React.FC = () => {
  return (
    <div className="card">
      <h3 className="font-semibold mb-6">Predicted gender of clients</h3>
      
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">31%</span>
            <span className="text-text-secondary">male</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">66%</span>
            <span className="text-text-secondary">female</span>
          </div>
        </div>
        
        <div className="w-24 h-24 rounded-full border-8 border-accent-primary opacity-30"></div>
      </div>
    </div>
  );
};

export default GenderStatsCard;