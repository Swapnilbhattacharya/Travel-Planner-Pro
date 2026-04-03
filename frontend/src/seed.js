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

  console.log("Starting Firebase seed...");

  // 2. Clear existing data (Optional but recommended for a clean MMT start)
  // Warning: Firestore doesn't have a simple 'deleteMany', you have to delete docs one by one
  const snapshot = await collectionRef.get();
  const batchDelete = db.batch();
  snapshot.docs.forEach((doc) => {
    batchDelete.delete(doc.ref);
  });
  await batchDelete.commit();
  console.log("Old records cleared from Firestore.");

  // 3. Upload 50 records using Batched Writes (More efficient than individual calls)
  const batchAdd = db.batch();

  destinationData.forEach((dest) => {
    // We use dest.id as the Document ID so it's clean (e.g., 'banff_01')
    const docRef = collectionRef.doc(dest.id); 
    batchAdd.set(docRef, dest);
  });

  await batchAdd.commit();
  console.log(`Successfully pushed ${destinationData.length} records to Firebase!`);
  process.exit();
};

seedFirestore().catch(console.error);