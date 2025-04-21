import React, { useState } from 'react';
import MRCCard from '../MRCCard/MRCCard';

interface MRCData {
  title: string;
  summary: string;
  status: string;
}

interface MRCDashboardProps {
  mrcData: {
    implemented: MRCData[];
    inProgress: MRCData[];
    closed: MRCData[];
    pending: MRCData[];
  } | null | undefined;
}

const MRCDashboard: React.FC<MRCDashboardProps> = ({ mrcData }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, number>>({});

  const renderMRCCards = (category: MRCData[], status: string) => {
    const displayCount = expandedCategories[status] || 9;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {category.slice(0, displayCount).map((mrc, index) => (
          <MRCCard key={index} {...mrc} />
        ))}
      </div>
    );
  };

  const toggleExpand = (status: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [status]: prev[status] ? prev[status] + 9 : 18
    }));
  };

  if (!mrcData) {
    return <div className="text-white">No MRC data available.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-white mb-6">MRC Dashboard</h2>
      
      {Object.entries(mrcData).map(([status, mrcs]) => (
        <div key={status} className="mb-8">
          <h3 className="text-2xl font-semibold text-white mb-4 capitalize">{status}</h3>
          {renderMRCCards(mrcs, status)}
          {mrcs.length > (expandedCategories[status] || 9) && (
            <button
              onClick={() => toggleExpand(status)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              View More
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MRCDashboard;