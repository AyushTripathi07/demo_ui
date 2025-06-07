import React from 'react';
import { Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const TrafficSourceCard: React.FC = () => {
  // Sample data for the bar chart
  const data = [
    { name: 'Mon', value: 60 },
    { name: 'Tue', value: 100 },
    { name: 'Wed', value: 80 },
    { name: 'Thu', value: 70 },
    { name: 'Fri', value: 50 },
    { name: 'Sat', value: 30 },
    { name: 'Sun', value: 10 },
  ];
  
  return (
    <div className="card bg-[#E2E8F0] text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Traffic source</h3>
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          <Calendar size={18} />
        </button>
      </div>
      
      <div className="stat-value text-gray-900">1,231</div>
      
      <div className="h-48 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 0 }} />
            <YAxis hide={true} />
            <Bar 
              dataKey="value" 
              fill="#1E1E1E" 
              radius={[4, 4, 0, 0]} 
              barSize={15} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficSourceCard;