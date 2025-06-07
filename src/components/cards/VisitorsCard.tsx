import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const VisitorsCard: React.FC = () => {
  // Sample data for the chart
  const data = [
    { name: 'Dec', value: 400 },
    { name: 'Jan', value: 650 },
  ];
  
  return (
    <div className="card">
      <h3 className="font-semibold mb-3">Visitors this month</h3>
      
      <div className="stat-value text-4xl font-bold">+65,0</div>
      
      <div className="h-32 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#A0A0A0', fontSize: 12 }}
            />
            <YAxis hide />
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VisitorsCard;