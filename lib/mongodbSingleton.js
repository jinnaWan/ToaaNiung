//singleton with solid

import { MongoClient } from 'mongodb';

class MongoConnection {
  constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }

    this.uri = process.env.MONGODB_URI;
    this.options = {};
    this.client = new MongoClient(this.uri, this.options);
  }

  async connect() {
    if (!this.clientPromise) {
      this.clientPromise = this.client.connect();
    }
    return this.clientPromise;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }

  getClient() {
    if (!this.clientPromise) {
      throw new Error('MongoClient is not connected. Call connect() first.');
    }
    return this.client;
  }
}

class MongoSingleton {
  constructor(connection) {
    if (!MongoSingleton.instance) {
      this.connection = connection;
      MongoSingleton.instance = this;
    }
    return MongoSingleton.instance;
  }

  static getInstance(connection) {
    if (!MongoSingleton.instance) {
      MongoSingleton.instance = new MongoSingleton(connection);
    }
    return MongoSingleton.instance;
  }

  async connect() {
    return this.connection.connect();
  }

  async disconnect() {
    return this.connection.disconnect();
  }

  getClient() {
    return this.connection.getClient();
  }
}

const mongoConnection = new MongoConnection();
const mongoSingleton = MongoSingleton.getInstance(mongoConnection);

export default mongoSingleton;

/*import { MongoClient } from 'mongodb';
//singleton 
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
*/
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