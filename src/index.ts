import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/configs/cors.js'
import AsyncExitHook from 'async-exit-hook'
import { closeDB, connectDB } from '~/configs/mongodb.js'
import { env } from '~/configs/enviroment.js'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware.js'
import YAML from 'yaml'
import fs from 'fs'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import http from 'http'
import swaggerJsdoc from 'swagger-jsdoc'
// import { Server as socketIo } from 'socket.io'
import { testMessageSocket } from '~/sockets/testMessageSocket.js'
import { APIs_V1 } from '~/routes/v1/index.js'
import { connectDBPostgre } from '~/configs/postgres.js'
import { APIs_V2 } from '~/routes/v2/index.js'

const isProduction = process.env.NODE_ENV === 'production'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger Cake Store',
      version: '1.0.0'
    },
    servers: [
      {
        url: isProduction ? 'https://shopapp-be-node.onrender.com/api/v1' : 'http://localhost:8081/api/v1',
        description: isProduction ? 'Production server' : 'Development server'
      }
    ]
  },
  apis: ['./src/routes/v1/*.ts'] // files containing annotations as above
}

const openapiSpecification = swaggerJsdoc(options)

// * Load the OpenAPI document
const file = fs.readFileSync(path.resolve('swagger.yaml'), 'utf8')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const swaggerDocument = YAML.parse(file)

const START_SERVER = () => {
  const app = express()

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // * Serve the Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

  // * Configuring the app to use middlewares
  app.use(cookieParser())

  app.use(cors(corsOptions))

  app.use(express.json())

  // * Configuring the app to use routes
  // app.use('/api/v2', APIs_V2)
  app.use('/api/v1', APIs_V1)

  // * Error handling middleware
  app.use(errorHandlingMiddleware)

  // * Configuring the app to use socket.io
  const server = http.createServer(app)
  // const io = new socketIo(server, { cors: corsOptions })

  // io.on('connection', (socket) => {
  //   testMessageSocket(socket)
  // })

  const PORT = process.env.PORT || 8081

  if (env.BUILD_MODE === 'production') {
    server.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}/api/v1`)
    })
  } else {
    const port: number = Number.parseInt(env.APP_PORT || '8081')
    server.listen(port, env.APP_HOST || '', () => {
      console.log(`Server is running at http://${env.APP_HOST}:${port}/api/v1`)
    })
  }

  // * Thực hiện cleanup khi server bị tắt
  AsyncExitHook(() => {
    console.log('Cleaning up...')
    closeDB() // Close the database connection
    console.log('Cleanup complete.')
  })
}

;(async () => {
  try {
    await connectDB()
    await connectDBPostgre()
    console.log('Connected to MongoDB successfully!')
    START_SERVER()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0)
  }
})()
