// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

const ImageViewerBus = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [timeAdded, setTimeAdded] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNewestImage = async () => {
      try {
        const response = await fetch('https://webapi-bus-monitoring.vercel.app/api/bus-timestamps-images');
        if (!response.ok) {
          throw new Error('Error fetching the newest image');
        }
        const data = await response.json();
        
        // Sort the data based on timeCreated and pick the newest one
        const sortedData = data.sort((a, b) => new Date(b.metadata.timeCreated) - new Date(a.metadata.timeCreated));

        // Get the newest image
        const newestImage = sortedData[0];
        const createdDate = new Date(newestImage.metadata.timeCreated);
        const formattedDate = createdDate.toLocaleDateString();
        const formattedTime = createdDate.toLocaleTimeString();

        // Set the image URL and formatted time
        setImageUrl(newestImage.imageUrl);
        setTimeAdded(`${formattedDate} at ${formattedTime}`);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchNewestImage();
  }, []);

  return (
    <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 pt-4 pb-1 text-center">
        <h2 className="text-xl text-blue-900 font-bold mb-2">(Bus) Camera</h2>
      </div>
      <div className="px-6 pt-2 pb-4">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Newest uploaded"
            className="w-full h-64 object-cover rounded-lg transition-all duration-300 ease-in-out hover:scale-105"
          />
        ) : (
          <p className="text-center">Loading...</p>
        )}
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : timeAdded ? (
          <p className="text-blue-900">{timeAdded}</p>
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ImageViewerBus;