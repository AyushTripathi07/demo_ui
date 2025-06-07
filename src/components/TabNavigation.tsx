type TabNavigationProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs?: string[];
};

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, tabs = ['today', 'trends'] }) => {
  return (
    <div className="flex space-x-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-3 py-1 rounded-full text-sm capitalize ${
            activeTab === tab ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-text-muted'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
