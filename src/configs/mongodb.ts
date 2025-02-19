import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/configs/enviroment.js'
import { Db } from 'mongodb'
import mongoose, { Connection } from 'mongoose'

// * Initiate a variable to store the connection instance
let shopAppDBInstance: Db | null = null
let mongooseConnection: Connection | null = null

// * Create a new instance of MongoClient
const mongoClient = new MongoClient(env.MONGODB_URI || '', {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  },
  connectTimeoutMS: 5 * 60 * 1000,
  socketTimeoutMS: 5 * 60 * 1000,
  serverSelectionTimeoutMS: 5 * 60 * 1000
})

export const connectDB = async () => {
  // * Connect to the database
  await mongoClient.connect()

  shopAppDBInstance = mongoClient.db(env.MONGODB_DB_NAME)

  mongooseConnection = mongoose.createConnection(env.MONGODB_URI || '', {
    dbName: env.MONGODB_DB_NAME
  })

  mongooseConnection.on('connected', () => {
    console.log('Mongoose connected successfully!')
  })

  mongooseConnection.on('error', (err: any) => {
    console.error('Mongoose connection error:', err)
  })
}

export const getDB = () => {
  if (!shopAppDBInstance) {
    throw new Error('Must connect to database first!')
  }

  return shopAppDBInstance
}

export const getMongooseConnection = () => {
  if (!mongooseConnection) {
    throw new Error('Must connect to Mongoose first!')
  }
  return mongooseConnection
}

export const closeDB = async () => {
  await mongoClient.close()
  if (mongooseConnection) {
    await mongooseConnection.close()
  }
}
