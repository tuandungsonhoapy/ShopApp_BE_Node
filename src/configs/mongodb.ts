import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/configs/enviroment.js'
import { Db } from 'mongodb'

// * Initiate a variable to store the connection instance
let shopAppDBInstance: Db | null = null

// * Create a new instance of MongoClient
const mongoClient = new MongoClient(env.MONGODB_URI || '', {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  },
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 30000
})

export const connectDB = async () => {
  // * Connect to the database
  await mongoClient.connect()

  shopAppDBInstance = mongoClient.db(env.MONGODB_DB_NAME)
}

export const getDB = () => {
  if (!shopAppDBInstance) {
    throw new Error('Must connect to database first!')
  }

  return shopAppDBInstance
}

export const closeDB = async () => {
  await mongoClient.close()
}
