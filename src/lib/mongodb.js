import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ CRITICAL ERROR: MONGODB_URI is missing in .env.local file!");
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  console.log("⏳ [DB STEP 1] Connection function call hui...");

  if (cached.conn) {
    console.log("✅ [DB STATUS] Pehle se connected hai, purana connection use ho raha hai.");
    return cached.conn;
  }

  if (!cached.promise) {
    // serverSelectionTimeoutMS: 5000 (Agar 5 second me connect nahi hua toh fail kar dega)
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000 
    };

    console.log("🔄 [DB STEP 2] MongoDB se naya connection banane ki koshish...");
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("🚀 [DB SUCCESS] MONGODB SUCCESSFULLY CONNECT HO GAYA!");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ [DB FAILED] MONGODB CONNECTION FAIL HO GAYA!");
        console.error("🔍 [DB ERROR DETAILS]:", err.message);
        // Error aane par promise clear kar do taaki agli baar dobara try kar sake
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error("❌ [DB CATCH BLOCK] Await karte time error:", e.message);
    throw e;
  }
}

export default connectToDatabase;