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

  console.log("🚀 Starting Firebase seed process...");

  // 2. Clear existing data
  const snapshot = await collectionRef.get();
  if (!snapshot.empty) {
    const batchDelete = db.batch();
    snapshot.docs.forEach((doc) => {
      batchDelete.delete(doc.ref);
    });
    await batchDelete.commit();
    console.log("✅ Old records cleared from Firestore.");
  }

  // 3. Upload records using chunked batches (Handling the 500 limit)
  const MAX_BATCH_SIZE = 400; // Safer under the 500 limit
  
  for (let i = 0; i < destinationData.length; i += MAX_BATCH_SIZE) {
    const batch = db.batch();
    const chunk = destinationData.slice(i, i + MAX_BATCH_SIZE);

    chunk.forEach((dest) => {
      // Ensure each destination has an ID for the document name
      const docId = dest.id || `dest_${Math.random().toString(36).substr(2, 9)}`;
      const docRef = collectionRef.doc(docId);
      batch.set(docRef, dest);
    });

    await batch.commit();
    console.log(`📦 Batch ${Math.ceil((i + 1) / MAX_BATCH_SIZE)} uploaded (${chunk.length} records).`);
  }

  console.log(`\n✨ Successfully pushed ${destinationData.length} updated records to Firebase!`);
  process.exit();
};

seedFirestore().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});