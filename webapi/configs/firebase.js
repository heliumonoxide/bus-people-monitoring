const admin = require('firebase-admin');
const serviceAccount = require('../env/people-bus-monitoring-firebase-adminsdk-tysym-f1f1926e67.json'); // Update this path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://people-bus-monitoring.firebasestorage.app', // Replace with your storage bucket
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };