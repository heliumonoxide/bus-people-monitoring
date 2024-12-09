import React, { useEffect, useState } from "react";

const LogTablePeople = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from the API
                const response = await fetch("https://webapi-bus-monitoring.vercel.app/api/newest-image"); // Replace with your actual API URL
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();

                const response2 = await fetch("https://webapi-bus-monitoring.vercel.app/api/newest-sum");
                if (!response2.ok) throw new Error("Failed to fetch data");
                const data2 = await response2.json();
                
                const newSum = data2.map(doc => {
                    return doc.sum
                })
                
                console.log(newSum);
                // Format the data, converting timestamps to local time
                const utcDate = new Date(data.metadata.timeCreated); // Convert Firestore timestamp
                const localDate = new Date(utcDate.setHours(utcDate.getHours())); // Adjust to UTC+7
                const formattedData = {
                    id: data.metadata.generation, // Adjust based on your data
                    timestamp: localDate.toString(),
                    imageUrl: data.imageUrl, // Assuming image URL is available
                    peopleCount: newSum,
                    createdAt: utcDate // Store original UTC timestamp for sorting
                };


                // Sort the data based on the `createdAt` field (newest first)
                // const sortedData = formattedData.sort((a, b) => b.createdAt - a.createdAt);

                // Set sorted data to state
                setData(formattedData);

            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-6">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left text-sm rounded-lg">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2 rounded-tl-lg">Image ID</th>
                            <th className="px-4 py-2">Timestamp</th>
                            <th className="px-4 py-2">People Count</th>
                            <th className="px-4 py-2 rounded-tr-lg">Image</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr key={data.id} className="odd:bg-blue-100 even:bg-blue-200">
                            <td className="px-4 py-2">{data.id}</td>
                            <td className="px-4 py-2">{data.timestamp}</td>
                            <td className="px-4 py-2">{data.peopleCount}</td>
                            <td className="px-4 py-2">
                                {data.imageUrl ? (
                                    <a
                                        href={data.imageUrl}
                                        alt="Uploaded"
                                        className="h-16 w-16 object-cover rounded-full hover:text-blue-500"
                                    >
                                        Image Link
                                    </a>
                                ) : (
                                    "No Image"
                                )}
                            </td>
                        </tr>
                        {/* 
                        : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">Loading...</td>
                        </tr>
                        ) */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogTablePeople;
