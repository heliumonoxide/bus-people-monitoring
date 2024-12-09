// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";

const LogSumPeople = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await fetch("https://webapi-bus-monitoring.vercel.app/api/prediction-today"); // Replace with your actual API URL
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        
        // Format the data, converting timestamps to local time
        const formattedData = data.map((doc) => {
            const utcDate = new Date(doc.timeAdded._seconds * 1000); // Create a date object
            const localDate = new Date(utcDate.setHours(utcDate.getHours())); // Adjust to UTC+7
            
            return {
                id: doc.id, // Adjust based on your data
                timestamp: localDate.toString(),
                sum: doc.sum, // Assuming image URL is available
                createdAt: utcDate // Store original UTC timestamp for sorting
            };
        });
        console.log(formattedData)

        // Sort the data based on the `createdAt` field (newest first)
        const sortedData = formattedData.sort((a, b) => b.createdAt - a.createdAt);

        // Set sorted data to state
        setData(sortedData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
      <div className="container mx-auto overflow-y-auto h-60 px-4 py-6">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left text-sm rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 rounded-tl-lg">Data ID</th>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2 rounded-tr-lg">Sum people</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="odd:bg-blue-100 even:bg-blue-200">
                  <td className="px-4 py-2">{row.id}</td>
                  <td className="px-4 py-2">{row.timestamp}</td>
                  <td className="px-4 py-2">{row.sum}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogSumPeople;
