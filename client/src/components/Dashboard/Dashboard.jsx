// src/components/Dashboard.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import LineChart from '../PeopleGraph/PeopleGraph';
import HighestCount from '../HighestCount/HighestCount';
import ImageViewerBus from '../busCamera/busCamera'
import ImageViewerPeople from '../peopleCamera/peopleCamera'
import LogTableBus from '../LogTableBus/LogTableBus';
import LogTablePeople from "../LogTablePeoples/LogTablePeoples";
import Decision from '../Decision/Decision';
import LogSumPeople from '../LogSumPeople/LogSumPeople'


const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b bg-blue-100 to-white bg-blue-50 flex flex-col bg-gradient-to-r from-sky-200 to-sky-50">
      <header className="bg-blue-400 p-4 shadow-md text-white rounded-b-lg z-10 sticky top-0">
        <h1 className="text-2xl font-bold text-center">🚌 Bus and People Monitoring 🚌</h1>
        <p className="text-lg text-white/80 text-center">Your Commute, Simplified: Real-Time Passenger & Bus Metrics</p>
      </header>

      <main className="flex flex-col p-10">
        <div className="flex flex-wrap mx-10 gap-5 flex-row justify-center">
          <ImageViewerPeople />
          <ImageViewerBus />
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
          <h2 className="text-blue-900 text-xl font-bold mb-4 mx-6">Log Table (Today only)</h2>
          <div className="flex flex-col bg-white gap-10 rounded-lg shadow-lg p-6 mx-6">
            <div>
              <h2 className="text-blue-900 text-xl font-bold mx-6">Log images table for Bus Detection</h2>
              <LogTableBus />
            </div>
            <div>
              <h2 className="text-blue-900 text-xl font-bold mx-6">Log images table for People Detection</h2>
              <LogTablePeople />
            </div>
            <div>
              <h2 className="text-blue-900 text-xl font-bold mx-6">Log Sum table for People Detection</h2>
              <LogSumPeople />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-blue-400 text-white p-4 text-center rounded-t-lg z-10">
        <p>&copy; {new Date().getFullYear()} Universitas Indonesia | Desain Proyek TE 2 Group 12</p>
      </footer>
    </div>
  );
};

export default Dashboard;