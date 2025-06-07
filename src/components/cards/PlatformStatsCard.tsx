import React from 'react';

const PlatformStatsCard: React.FC = () => {
  const platforms = [
    { id: 'instagram', name: 'Instagram', value: '+7.4k' },
    { id: 'google', name: 'Google Ads', value: '+4.4k' },
    { id: 'facebook', name: 'Facebook Ads', value: '+3.4k' },
  ];
  
  return (
    <div className="card">
      <h3 className="font-semibold mb-6">List of platforms</h3>
      
      <div className="space-y-4">
        {platforms.map(platform => (
          <div key={platform.id} className="flex items-center justify-between">
            <span className="text-text-primary">{platform.name}</span>
            <span className="font-semibold text-accent-success">{platform.value}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <p className="text-text-secondary">+2 more</p>
        <button className="btn btn-outline text-sm">View all</button>
      </div>
    </div>
  );
};

export default PlatformStatsCard;