import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { userService } from '~/services/v1/userService.js'

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.login({
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
    const user = await userService.registerUser(req.body)

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
    const response = await userService.forgotPassword(req.body.email)

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userService.verifyOTP(req.body.userId, req.body.otp)

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userService.resetPassword(req.body)

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, q, type } = req.query

    const users = await userService.getAllUsers(
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
    const { _id } = req.jwtDecoded as { _id: string }

    const response = await userService.updateUser(_id, req.body)

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const changePasswordUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { old_password, new_password, confirm_password } = req.body
    const { _id: userId } = req.jwtDecoded as { _id: string }

    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
      return
    }

    const response = await userService.changePasswordUser(userId, old_password, new_password, confirm_password)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

export const userController = {
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
