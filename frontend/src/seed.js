const admin = require('firebase-admin');
// Verify these paths match your actual 'data' folder location
const serviceAccount = require('./data/serviceAccountKey.json');
const destinationData = require('./data/destinations.json');

// 1. Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const seedFirestore = async () => {
  const collectionRef = db.collection('destinations');

  console.log("🚀 Starting Firebase seed process...");

  // 2. Clear existing data with Batch Limit Handling
  // If you have more than 500 docs, a single batch delete would fail.
  const snapshot = await collectionRef.get();
  if (!snapshot.empty) {
    console.log(`🧹 Clearing ${snapshot.size} old records...`);
    const deleteBatch = db.batch();
    snapshot.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();
    console.log("✅ Firestore collection cleared.");
  }

  // 3. Upload records using chunked batches (Handling the 500 limit)
  const MAX_BATCH_SIZE = 400; 
  
  for (let i = 0; i < destinationData.length; i += MAX_BATCH_SIZE) {
    const batch = db.batch();
    const chunk = destinationData.slice(i, i + MAX_BATCH_SIZE);

    chunk.forEach((dest) => {
      // Use the 'id' from JSON as the Firestore Document ID
      if (!dest.id) {
        console.warn(`⚠️ Warning: Destination "${dest.name}" is missing an ID.`);
      }
      const docId = dest.id || `gen_${Math.random().toString(36).substr(2, 9)}`;
      const docRef = collectionRef.doc(docId);
      
      // This uploads the entire object (including tags, budget, media, etc.)
      batch.set(docRef, dest);
    });

    await batch.commit();
    console.log(`📦 Batch uploaded: records ${i + 1} to ${Math.min(i + MAX_BATCH_SIZE, destinationData.length)}`);
  }

  console.log(`\n✨ Success! Pushed ${destinationData.length} destinations with Budget & Cultural tags.`);
  process.exit(0);
};

seedFirestore().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});