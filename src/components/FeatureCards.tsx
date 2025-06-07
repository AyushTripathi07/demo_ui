import React from 'react';
import { LineChart, BarChart, PieChart, FileText } from 'lucide-react';

const FeatureCards: React.FC = () => {
  const features = [
    {
      id: 'monitoring',
      title: 'Campaign monitoring',
      description: 'Monitoring ad campaign performance',
      icon: <LineChart className="text-accent-primary" size={24} />,
    },
    {
      id: 'segmentation',
      title: 'Audience segmentation',
      description: 'Segment identification through data analysis',
      icon: <PieChart className="text-accent-warning\" size={24} />,
    },
    {
      id: 'forecasting',
      title: 'Trend forecasting',
      description: 'Utilizing algorithms to forecast trends',
      icon: <BarChart className="text-accent-success" size={24} />,
    },
    {
      id: 'automation',
      title: 'Report automation',
      description: 'Automating the generation of reports',
      icon: <FileText className="text-accent-primary\" size={24} />,
    },
  ];
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {features.map(feature => (
        <div 
          key={feature.id}
          className="feature-card"
        >
          <div className="flex items-start">
            <div className="mr-4">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-text-secondary text-sm mt-1">{feature.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;