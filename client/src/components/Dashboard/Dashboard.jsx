// src/components/Dashboard.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import LineChart from '../PeopleGraph/PeopleGraph';
import HighestCount from '../HighestCount/HighestCount';
import ImageViewer from '../NewestImageComponent/NewestImageComponent';
import LogTable from '../LogTable/LogTable';
import Decision from '../Decision/Decision';


const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b bg-blue-100 to-white bg-blue-50 flex flex-col">
      <header className="bg-blue-400 p-4 shadow-md text-white">
        <h1 className="text-2xl font-bold text-center">🚌 Bus and People Monitoring in Halte FTUI 🚌</h1>
        <p className="text-lg text-white/80 text-center">Kata katanya kak hari ini. Pahamm!!</p>
      </header>

      <main className="flex flex-col p-10">
        <div className="flex flex-wrap mx-10 gap-5 flex-row justify-center">
          <ImageViewer />
          <div className='flex flex-col gap-5'>
            <HighestCount />
            <Decision />
          </div>
          {/* <EthicCard /> */}
        </div>
        <div className="container mx-auto mt-10">
          <h2 className="text-blue-900 text-xl font-bold mb-4 mx-6">Monitoring Graph</h2>
          <div className="flex flex-col bg-white gap-10 rounded-lg shadow-lg p-6 pt-12 mx-6">
            <LineChart />
            {/* <SpeedGraph /> */}
          </div>
        </div>
        <div className="container mx-auto mt-10">
          <h2 className="text-blue-900 text-xl font-bold mb-4 mx-6">Log Table</h2>
          <div className="flex flex-col bg-white gap-10 rounded-lg shadow-lg p-6 mx-6">
            <LogTable />
          </div>
        </div>
      </main>

      <footer className="bg-blue-400 text-white p-4 text-center">
        <p>&copy; {new Date().getFullYear()} Universitas Indonesia | Desain Proyek TE 2 Group 12</p>
      </footer>
    </div>
  );
};

export default Dashboard;