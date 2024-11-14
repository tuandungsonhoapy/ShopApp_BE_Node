import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/configs/enviroment.js'
import { Db } from 'mongodb'

// * Khởi tạo đối tượng database
let shopAppDBInstance: Db | null = null

// * Khởi tạo đối tượng connection
const mongoClient = new MongoClient(env.MONGODB_URI || '', {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const connectDB = async () => {
  // * Thực hiện kết đối đến mongodb
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
