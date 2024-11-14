import express from 'express'
import { userRoute } from '~/routes/v1/userRoute.js'

const router = express.Router()

router.use('/users', userRoute)

export const APIs_V1 = router
