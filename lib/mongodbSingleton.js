import { MongoClient } from 'mongodb';

class MongoSingleton {
  constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }

    const uri = process.env.MONGODB_URI;
    const options = {};

    this.client = new MongoClient(uri, options);
    this.clientPromise = this.client.connect();
  }

  async getClientPromise() {
    return this.clientPromise;
  }

  async disconnect() {
    await this.client.close();
  }
}

const mongoSingleton = new MongoSingleton();
export default mongoSingleton;

/*
Original Code (mongodb.js):
javascript

import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

Comparison:
Structure: The original code directly exports the MongoDB client promise (clientPromise), while the updated code encapsulates the MongoDB client creation and connection within a MongoSingleton class.
Singleton Pattern: The updated code implements the Singleton pattern by ensuring that only one instance of the MongoDB client (this.client) is created and used throughout the application. The mongoSingleton object represents this Singleton instance.
Methods: The updated code includes methods like getClientPromise() to access the MongoDB client promise and disconnect() to close the MongoDB client connection. These methods provide controlled access and management of the MongoDB client.
Usage: In your application, you would import and use mongoSingleton from mongodbSingleton.js wherever you need to interact with the MongoDB client, ensuring consistency and efficiency in client usage.
*/