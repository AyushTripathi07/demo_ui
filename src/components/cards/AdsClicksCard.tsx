import React from 'react';
import { AreaChart, Area, XAxis, ResponsiveContainer } from 'recharts';

const AdsClicksCard: React.FC = () => {
  const data = [
    { date: '1 Jan', value: 10 },
    { date: '8 Jan', value: 15 },
    { date: '15 Jan', value: 30 },
    { date: '22 Jan', value: 80 },
    { date: '29 Jan', value: 100 },
  ];
  
  return (
    <div className="card bg-[#FDF2FF]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700">Ads clicks</h3>
      </div>
      
      <div className="stat-value text-gray-900">+247%</div>
      
      <div className="h-48 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E879F9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E879F9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
            <Area type="monotone" dataKey="value" stroke="#E879F9" fill="url(#colorClicks)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdsClicksCard;