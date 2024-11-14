import express from 'express'
import { UserController } from '~/controllers/UserController.js'

const router = express.Router()

router.route('/login').post(UserController.login)

export const userRoute = router
