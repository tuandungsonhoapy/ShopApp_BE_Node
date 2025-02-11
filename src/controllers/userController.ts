import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { userService } from '~/services/userService.js'

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

export const userController = {
  login,
  registerUser,
  logout
}
