import React from 'react';

interface MRCCardProps {
  title: string;
  summary: string;
  status: string;
  onClick: () => void;
}

const MRCCard: React.FC<MRCCardProps> = ({ title, summary, status, onClick }) => {
  // Clean up the title
  const cleanTitle = title.replace(/MRC\s*(\d+)\.md:\s*#MRC\d+:\s*/, 'MRC$1: ');

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer" onClick={onClick}>
      <h3 className="text-xl font-semibold mb-2 text-white">{cleanTitle}</h3>
      <p className="text-gray-300 mb-4 line-clamp-3">{summary}</p>
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          status === 'Implemented' ? 'bg-green-500 text-white' :
          status === 'In Progress' ? 'bg-yellow-500 text-black' :
          status === 'Closed' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {status}
        </span>
        <button className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
          View MOR
        </button>
      </div>
    </div>
  );
};

export default MRCCard;