import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel.js'
import ApiError from '~/utils/ApiError.js'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { BrevoProvider } from '~/providers/BrevoProvider.js'
import { pickUser } from '~/utils/formatters.js'
import { IUser, IUserLogin } from '~/@types/interface.js'
import { WEB_DOMAIN } from '~/utils/constants.js'
import { env } from '~/configs/enviroment.js'
import { JwtProvider } from '~/providers/JwtProvider.js'

const registerUser = async (data: IUser) => {
  // * Check email has been existed
  const existedUser = await userModel.findOneByEmail(data.email || '')
  if (existedUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
  }

  if (data.password !== data.confirmPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password and confirm password do not match!')
  }

  delete data.confirmPassword

  // * Save user to database
  if (!data.email) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is required!')
  }
  if (!data.password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is required!')
  }
  const username = data.email.split('@')[0]
  const newUser = {
    ...data,
    password: bcryptjs.hashSync(data.password, 10),
    email: data.email,
    displayName: username,
    verifyToken: uuidv4()
  }

  const registeredUser = await userModel.registerUser(newUser as IUser)
  if (!registeredUser) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User registration failed!')
  }
  const user = await userModel.findOneById(registeredUser.insertedId)
  if (!user) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User not found after registration!')
  }

  // * Send verification email
  const verificationLink = `${WEB_DOMAIN}/verify-account?email=${user?.email}&token=${user?.verifyToken}`
  const customSubject = 'Shop App: Please verify your email address to activate your account!'
  const htmlContent = `
    <h2>Welcome to The Shop App!</h2>
    <h4>Please click the link below to verify your email address:</h4>
    <h4>${verificationLink}</h4>
    <h4>If you did not create an account using this email address, please ignore this email.</h4>
  `

  // * Send email
  await BrevoProvider.sendEmail(user?.email, customSubject, htmlContent)

  return pickUser(user as unknown as IUser)
}

const login = async (data: IUserLogin) => {
  const user = await userModel.findOneByEmail(data.email)

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email or password is incorrect!')
  }

  if (!user.isActive) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Your account is not activated!')
  }

  if (!bcryptjs.compareSync(data.password, user.password)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email or password is incorrect!')
  }

  // let checkUserSession = await userSessionsModel.findByUserIdAndUserAgent(user._id, data.userAgent)

  // if (!checkUserSession && user.require_2fa) {
  //   const result = await userSessionsModel.createUserSession({
  //     userId: user._id.toString(),
  //     userAgent: data.userAgent,
  //     is_2fa_verified: false
  //   })

  //   checkUserSession = await userSessionsModel.findOneById(result.insertedId)
  // }

  // * Tạo access token
  const accessToken = JwtProvider.generateToken(
    { _id: user._id.toString(), email: user.email, role: user.role } as IUser,
    env.ACCESS_TOKEN_SECRET_SIGNATURE || '',
    env.ACCESS_TOKEN_LIFE || '1d'
  )

  const refreshToken = JwtProvider.generateToken(
    { _id: user._id.toString(), email: user.email, role: user.role },
    env.REFRESH_TOKEN_SECRET_SIGNATURE || '',
    env.REFRESH_TOKEN_LIFE || '3d'
  )

  return {
    accessToken,
    refreshToken,
    ...pickUser(user as unknown as IUser)
    // is_2fa_verified: checkUserSession?.is_2fa_verified,
    // last_login: checkUserSession?.last_login
  }
}

export const userService = {
  registerUser,
  login
}
