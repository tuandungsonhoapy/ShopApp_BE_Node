import express from 'express'
import { userRoute } from '~/routes/v1/userRoute.js'
import { categoryRoute } from '~/routes/v1/categoryRoute.js'

const router = express.Router()

router.use('/users', userRoute)
router.use('/categories', categoryRoute)

export const APIs_V1 = router
