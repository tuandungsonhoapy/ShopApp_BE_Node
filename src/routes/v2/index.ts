import express from 'express'
import { userRoute } from '~/routes/v2/userRoute.js'

const router = express.Router()

router.use('/users', userRoute)

export const APIs_V2 = router
