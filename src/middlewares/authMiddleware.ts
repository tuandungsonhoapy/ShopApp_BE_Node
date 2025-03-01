import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider.js'
import { env } from '~/configs/enviroment.js'
import ApiError from '~/utils/ApiError.js'
import { USER_ROLES } from '~/utils/constants.js'
import { Request, Response, NextFunction } from 'express'

const getTokenFromRequest = (req: Request): string | null => {
  let token = req.cookies?.accessToken || null

  if (!token) {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    }
  }

  return token
}

const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = getTokenFromRequest(req)
    if (!accessToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!')
    }

    const decoded = JwtProvider.verifyToken(accessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE || '')

    req.jwtDecoded = decoded

    next()
  } catch (error: any) {
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token!'))
      return
    }

    next(error)
  }
}

const isAuthorizedAndAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = getTokenFromRequest(req)
    if (!accessToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!')
    }

    const decoded: any = JwtProvider.verifyToken(accessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE || '')

    if (decoded && decoded.role !== USER_ROLES.ADMIN) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission!')
    }

    req.jwtDecoded = decoded

    next()
  } catch (error: any) {
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token!'))
      return
    }

    next(error)
  }
}

export const authMiddleware = {
  isAuthorized,
  isAuthorizedAndAdmin
}
