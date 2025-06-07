import React from 'react';
import { TrendingUp } from 'lucide-react';

const ConversionsCard: React.FC = () => {
  return (
    <div className="card">
      <div className="stat-label">Facebook ad website conversions</div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="stat-value">459</div>
        <TrendingUp size={20} className="text-accent-success" />
      </div>
    </div>
  );
};

export default ConversionsCard;