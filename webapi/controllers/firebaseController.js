const { db, bucket } = require('../configs/firebase'); // Import your firebase setup
const { Timestamp } = require('firebase-admin/firestore');
// const { Storage } = require('@google-cloud/storage');

// Process image upload
exports.processImage = (req, res) => {
    // Logic to process the image, e.g., save to Firebase or other cloud storage
    const { imageUrl } = req.body;

    // Assuming some processing happens here
    console.log('Received image URL:', imageUrl);

    // Send a valid JSON response
    res.json({ message: 'Image uploaded successfully!', imageUrl });
};

// Get image processing result
exports.getNewestSum = async (req, res) => {
    try {
        const snapshot = await db
            .collection('sum-person')
            .orderBy('timeAdded', 'desc') // Order by timeAdded field in descending order
            .limit(10) // Limit the results to 1 document
            .get();

        // Check if any documents were returned
        if (snapshot.empty) {
            return res.status(404).send('No data found.');
        }

        const numbers = [];
        snapshot.forEach(doc => {
            numbers.push({ id: doc.id, sum: doc.data().sum, timeAdded: doc.data().timeAdded });
        });

        res.status(200).json(numbers); // Return the newest document as a single object
    } catch (error) {
        console.error('Error reading from Firestore:', error);
        res.status(500).send('Error reading from Firestore.');
    }
};

// Get 1 newest sum person
exports.getNewestSumOnly = async (req, res) => {
    try {
        const snapshot = await db
            .collection('sum-person')
            .orderBy('timeAdded', 'desc') // Order by timeAdded field in descending order
            .limit(1) // Limit the results to 1 document
            .get();

        // Check if any documents were returned
        if (snapshot.empty) {
            return res.status(404).send('No data found.');
        }

        const numbers = [];
        snapshot.forEach(doc => {
            numbers.push({ id: doc.id, sum: doc.data().sum, timeAdded: doc.data().timeAdded });
        });

        res.status(200).json(numbers);
    } catch (error) {
        console.error('Error reading from Firestore:', error);
        res.status(500).send('Error reading from Firestore.');
    }
};

// Get images from firebase
exports.getNewestImage = async (req, res) => {
    try {
        const [files] = await bucket.getFiles({ prefix: 'result_predict/' });  // Adjust the prefix to your folder
        if (files.length === 0) {
            return res.status(404).json({ message: 'No images found' });
        }

        // Sort files by timeCreated (newest first)
        const sortedFiles = files.sort((a, b) => new Date(b.metadata.timeCreated) - new Date(a.metadata.timeCreated));
        const newestFile = sortedFiles[0];

        // Get signed URL for the newest image (valid for 1 hour, adjust as needed)
        const [url] = await newestFile.getSignedUrl({
            action: 'read',
            expires: '03-17-2025',  // Set the expiration date for the signed URL
        });

        const [metadata] = await newestFile.getMetadata();

        res.json({ imageUrl: url, metadata: metadata });
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).json({ message: 'Error retrieving image' });
    }
};

// Get 1 highest sum data
exports.getHighestSum = async (req, res) => {
    try {
        const snapshot = await db
            .collection('sum-person')
            .orderBy('sum', 'desc')
            .limit(1) // Limit the results to 1 document
            .get();

        // Check if any documents were returned
        if (snapshot.empty) {
            return res.status(404).send('No data found.');
        }

        const numbers = [];
        snapshot.forEach(doc => {
            numbers.push({ id: doc.id, sum: doc.data().sum, timeAdded: doc.data().timeAdded });
        });

        res.status(200).json(numbers); // Return the newest document as a single object
    } catch (error) {
        console.error('Error reading from Firestore:', error);
        res.status(500).send('Error reading from Firestore.');
    }
};

exports.getNewestBusTimestamps = async (req, res) => {
    try {
        // Get the start and end of the current day
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Convert to Firestore Timestamps
        const startTimestamp = Timestamp.fromDate(startOfDay);
        const endTimestamp = Timestamp.fromDate(endOfDay);

        // Query Firestore for documents with timeAdded within the range
        const snapshot = await db
            .collection('bus-timestamp')
            .where('timeAdded', '>=', startTimestamp)
            .where('timeAdded', '<', endTimestamp)
            .orderBy('timeAdded', 'desc') // Order by timeAdded field in descending order
            .get();

        // Check if any documents were returned
        if (snapshot.empty) {
            return res.status(404).send('No data found for today.');
        }

        const timestamps = [];
        snapshot.forEach(doc => {
            timestamps.push({ id: doc.id, timeAdded: doc.data().timeAdded });
        });

        res.status(200).json(timestamps); // Return the filtered documents
    } catch (error) {
        console.error('Error reading from Firestore:', error);
        res.status(500).send('Error reading from Firestore.');
    }
};

exports.getTodayImages = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Fetch all files from the bus_timestamp_photo folder
        const [files] = await bucket.getFiles({ prefix: 'bus_timestamp_photo/' });

        if (files.length === 0) {
            return res.status(404).json({ message: 'No images found in bus_timestamp_photo folder' });
        }

        // Filter files that were added or modified today
        const todayFiles = files.filter(file => {
            const updatedTime = new Date(file.metadata.updated || file.metadata.timeCreated);
            return updatedTime >= startOfDay && updatedTime < endOfDay;
        });

        if (todayFiles.length === 0) {
            return res.status(404).json({ message: 'No images added or modified today' });
        }

        // Generate signed URLs for the filtered files
        const images = await Promise.all(
            todayFiles.map(async file => {
                const [url] = await file.getSignedUrl({
                    action: 'read',
                    expires: '03-17-2025', // Adjust the expiration date as needed
                });
                return {
                    imageUrl: url,
                    metadata: file.metadata,
                };
            })
        );

        res.status(200).json(images);
    } catch (error) {
        console.error('Error retrieving today\'s images:', error);
        res.status(500).json({ message: 'Error retrieving today\'s images' });
    }
};

exports.getTodayImagesESP = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Fetch all files from the result_predict folder
        const [files] = await bucket.getFiles({ prefix: 'result_predict/' });

        if (files.length === 0) {
            return res.status(404).json({ message: 'No images found in result_predict folder' });
        }

        // Filter files that were added or modified today
        const todayFiles = files.filter(file => {
            const updatedTime = new Date(file.metadata.timeCreated);
            return updatedTime >= startOfDay && updatedTime < endOfDay;
        });

        if (todayFiles.length === 0) {
            return res.status(404).json({ message: 'No images added or modified today' });
        }

        // Generate signed URLs for the filtered files
        const images = await Promise.all(
            todayFiles.map(async file => {
                const [url] = await file.getSignedUrl({
                    action: 'read',
                    expires: '03-17-2025', // Adjust the expiration date as needed
                });
                return {
                    imageUrl: url,
                    metadata: file.metadata,
                };
            })
        );

        res.status(200).json(images);
    } catch (error) {
        console.error('Error retrieving today\'s images:', error);
        res.status(500).json({ message: 'Error retrieving today\'s images' });
    }
};

// Get image processing result
exports.getTodaySum = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Firestore expects timestamps for comparison
        const snapshot = await db
            .collection('sum-person')
            .where('timeAdded', '>=', startOfDay)
            .where('timeAdded', '<', endOfDay)
            .orderBy('timeAdded', 'desc')
            .get();

        if (snapshot.empty) {
            return res.status(404).send('No data found.');
        }

        const numbers = snapshot.docs.map(doc => ({
            id: doc.id,
            sum: doc.data().sum,
            timeAdded: doc.data().timeAdded,
        }));

        res.status(200).json(numbers); // Return all today's data
    } catch (error) {
        console.error('Error reading from Firestore:', error);
        res.status(500).send('Error reading from Firestore.');
    }
};
