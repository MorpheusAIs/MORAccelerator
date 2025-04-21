import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function FeatureRequestDashboard() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const [activeTab, setActiveTab] = useState('sponsors');

  const summaryData = [
    { title: 'Total Requests', value: 127, icon: '📊' },
    { title: 'Active Sponsors', value: 43, icon: '🏆' },
    { title: 'Completed Projects', value: 89, icon: '✅' },
  ];

  const topSponsors = [
    { name: 'Sponsor A', amount: 1000 },
    { name: 'Sponsor B', amount: 850 },
    { name: 'Sponsor C', amount: 700 },
    { name: 'Sponsor D', amount: 550 },
    { name: 'Sponsor E', amount: 400 },
  ];

  const topDevelopers = [
    { name: 'Developer X', completed: 5 },
    { name: 'Developer Y', completed: 4 },
    { name: 'Developer Z', completed: 3 },
    { name: 'Developer W', completed: 2 },
    { name: 'Developer V', completed: 1 },
  ];

  return (
    <section className="container mx-auto py-12 px-4 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900 rounded-3xl shadow-lg">
      <h2 className="text-4xl font-bold text-white mb-8" data-aos="fade-up">Feature Request Dashboard</h2>
      
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" data-aos="fade-up" data-aos-delay="100">
        {summaryData.map((item, index) => (
          <div 
            key={index} 
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6 shadow-[5px_5px_15px_rgba(0,0,0,0.2),_inset_5px_5px_15px_rgba(255,255,255,0.1)]"
          >
            <div className="flex items-center mb-2">
              <span className="text-3xl mr-2">{item.icon}</span>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            </div>
            <p className="text-4xl font-bold text-[#00a3ff]">{item.value}</p>
          </div>
        ))}
      </div>
      
      {/* Top Sponsors and Developers */}
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6 shadow-[5px_5px_15px_rgba(0,0,0,0.2),_inset_5px_5px_15px_rgba(255,255,255,0.1)]" data-aos="fade-up">
        <div className="flex mb-6">
          <button
            className={`mr-4 px-4 py-2 rounded-full ${activeTab === 'sponsors' ? 'bg-[#00a3ff] text-white shadow-inner' : 'bg-white bg-opacity-20 text-white shadow'} transition-all duration-300 ease-in-out transform hover:scale-105`}
            onClick={() => setActiveTab('sponsors')}
          >
            Top Sponsors
          </button>
          <button
            className={`px-4 py-2 rounded-full ${activeTab === 'developers' ? 'bg-[#00a3ff] text-white shadow-inner' : 'bg-white bg-opacity-20 text-white shadow'} transition-all duration-300 ease-in-out transform hover:scale-105`}
            onClick={() => setActiveTab('developers')}
          >
            Top Developers
          </button>
        </div>
        
        {activeTab === 'sponsors' ? (
          <ul className="space-y-4">
            {topSponsors.map((sponsor, index) => (
              <li 
                key={index} 
                className="bg-white bg-opacity-5 p-4 rounded-2xl flex justify-between items-center shadow-[2px_2px_10px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <span className="text-white">{sponsor.name}</span>
                <span className="text-[#00a3ff] font-semibold">{sponsor.amount} MOR</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-4">
            {topDevelopers.map((developer, index) => (
              <li 
                key={index} 
                className="bg-white bg-opacity-5 p-4 rounded-2xl flex justify-between items-center shadow-[2px_2px_10px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <span className="text-white">{developer.name}</span>
                <span className="text-[#00a3ff] font-semibold">{developer.completed} completed</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default FeatureRequestDashboard;
