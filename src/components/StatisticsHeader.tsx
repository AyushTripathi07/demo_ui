import React from 'react';

interface StatisticsHeaderProps {
  title?: string;
  onRefresh: () => void;
}

const StatisticsHeader: React.FC<StatisticsHeaderProps> = ({ title = "Article Analysis" }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default StatisticsHeader;