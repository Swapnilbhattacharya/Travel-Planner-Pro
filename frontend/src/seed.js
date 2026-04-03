const admin = require('firebase-admin');
const serviceAccount = require('./data/serviceAccountKey.json');
const destinationData = require('./data/destinations.json');

// 1. Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const seedFirestore = async () => {
  const collectionRef = db.collection('destinations');

  console.log("🚀 Starting fresh Firebase seed process...");

  // 2. Clear existing data
  // Using a larger batch delete for efficiency
  const snapshot = await collectionRef.get();
  if (!snapshot.empty) {
    console.log(`🧹 Found ${snapshot.size} existing documents. Deleting...`);
    const deleteBatch = db.batch();
    snapshot.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();
    console.log("✅ Firestore collection cleared.");
  }

  // 3. Upload expanded records using chunked batches
  const MAX_BATCH_SIZE = 400; 
  
  for (let i = 0; i < destinationData.length; i += MAX_BATCH_SIZE) {
    const batch = db.batch();
    const chunk = destinationData.slice(i, i + MAX_BATCH_SIZE);

    chunk.forEach((dest) => {
      // Use the 'id' from your JSON (e.g., "banff_01") as the Document ID
      const docId = dest.id;
      if (!docId) {
        console.error(`❌ Error: Destination "${dest.name}" is missing a unique ID.`);
        return;
      }
      
      const docRef = collectionRef.doc(docId);
      
      // batch.set handles all the new nesting automatically:
      // - media {} becomes a Map
      // - hotels [] becomes an Array of Maps (with nested rooms)
      // - sightseeing [] becomes an Array of Maps
      // - flights {} becomes a Map with departures/arrivals arrays
      batch.set(docRef, dest);
    });

    await batch.commit();
    console.log(`📦 Batch uploaded: destinations ${i + 1} to ${Math.min(i + MAX_BATCH_SIZE, destinationData.length)}`);
  }

  console.log(`\n✨ Success! Pushed ${destinationData.length} highly detailed destinations to Firebase.`);
  process.exit(0);
};

seedFirestore().catch((err) => {
  console.error("❌ Seeding failed dramatically:", err);
  process.exit(1);
});