const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const data = require('./destinations.json');

// 1. Initialize the Firebase Admin SDK with your VIP Pass
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 2. Create the function to push the data
const seedData = async () => {
  try {
    const collectionRef = db.collection('destinations');
    let count = 0;
    
    console.log("Starting upload to Firestore...");

    // Loop through each item in your JSON file and push it
    for (const item of data) {
      // We use .doc(item.id).set() to use the specific IDs from your JSON file
      await collectionRef.doc(item.id).set(item);
      console.log(`Added: ${item.name}`);
      count++;
    }
    
    console.log(`\n✅ Success! Added ${count} destinations to your database.`);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// 3. Run the function
seedData();