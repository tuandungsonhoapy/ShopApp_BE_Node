import express from 'express'
import { userController } from '~/controllers/userController.js'
import { userValidation } from '~/validations/userValidation.js'

const router = express.Router()

router.route('/login').post(userValidation.login, userController.login)

router.route('/register').post(userValidation.registerUser, userController.registerUser)

export const userRoute = router
