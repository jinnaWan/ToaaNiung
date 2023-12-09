import mongoose from "mongoose";

export function mongooseConnect() {
  // Checking if there's an active mongoose connection
  if (mongoose.connection.readyState === 1) {
    // If a connection exists, returns a Promise resolving to the existing connection
    return mongoose.connection.asPromise();
  } else {
    // If no active connection exists, retrieves the MongoDB URI from the environment variables
    const uri = process.env.MONGODB_URI;
    // Establishes a new connection to the MongoDB database using the retrieved URI
    return mongoose.connect(uri);
  }
}