import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { userService_V2 } from '~/services/v2/userService.js'

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService_V2.login({
      ...req.body,
      userAgent: req.headers['user-agent']
    })

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days')
    })

    res.status(StatusCodes.OK).json({ isLogin: true, ...result })
  } catch (error) {
    next(error)
  }
}

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService_V2.registerUser(req.body)

    res.status(StatusCodes.CREATED).json({ message: 'Register account successfully!', user })
  } catch (error) {
    next(error)
  }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ message: 'Logout successfully!', isLogout: true })
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userService_V2.forgotPassword(req.body.email)

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userService_V2.verifyOTP(req.body.userId, req.body.otp)

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userService_V2.resetPassword(req.body)

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, q, type } = req.query

    const users = await userService_V2.getAllUsers(
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
      q as string,
      type as string
    )

    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.jwtDecoded as { id: number }

    const response = await userService_V2.updateUser(id, req.body)

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const changePasswordUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { old_password, new_password, confirm_password } = req.body
    const { id: userId } = req.jwtDecoded as { id: number }

    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
      return
    }

    const response = await userService_V2.changePasswordUser(userId, old_password, new_password, confirm_password)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

export const userController_V2 = {
  login,
  registerUser,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getAllUsers,
  updateUser,
  changePasswordUser
}
