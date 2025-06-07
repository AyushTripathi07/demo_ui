import React from 'react';

const CountryStatsCard: React.FC = () => {
  const countries = [
    { id: 'us', name: 'United States', value: '38.0k' },
    { id: 'in', name: 'India', value: '6.4k' },
    { id: 'ca', name: 'Canada', value: '4.2k' },
  ];
  
  return (
    <div className="card">
      <h3 className="font-semibold mb-6">Country stats</h3>
      
      <div className="space-y-6">
        {countries.map(country => (
          <div key={country.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-full max-w-md">
                <div className="relative">
                  <div className="h-1 bg-gray-700 rounded-full w-full"></div>
                  <div 
                    className={`h-1 bg-accent-primary rounded-full absolute top-0 left-0`}
                    style={{ 
                      width: country.id === 'us' ? '80%' : country.id === 'in' ? '40%' : '20%' 
                    }}
                  ></div>
                </div>
                <p className="text-sm mt-1">{country.name}</p>
              </div>
            </div>
            <span className="font-semibold">{country.value}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex items-center justify-between">
        <p className="text-text-secondary">+19 more</p>
        <button className="btn btn-outline text-sm">
          View all countries
        </button>
      </div>
    </div>
  );
};

export default CountryStatsCard;