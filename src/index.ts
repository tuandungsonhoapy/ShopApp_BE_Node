import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/configs/cors.js'
import AsyncExitHook from 'async-exit-hook'
import { closeDB, connectDB } from '~/configs/mongodb.js'
import { env } from '~/configs/enviroment.js'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware.js'
import { APIs_V1 } from '~/routes/v1/index.js'

const START_SERVER = () => {
  const app = express()

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // * Configuring the app to use middlewares
  app.use(cookieParser())

  app.use(cors(corsOptions))

  app.use(express.json())

  // * Configuring the app to use routes
  app.use('/api/v1', APIs_V1)

  // * Error handling middleware
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port ${process.env.PORT}/api/v1`)
    })
  } else {
    const port: number = Number.parseInt(env.APP_PORT || '8081')
    app.listen(port, env.APP_HOST || '', () => {
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
    console.log('Connected to MongoDB successfully!')
    START_SERVER()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0)
  }
})()
