import JWT from 'jsonwebtoken'
import { IUser } from '~/@types/v1/auth/interface.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'

const generateToken = (userInfo: IUser, secretSignature: string, tokenLife: string | number) => {
  try {
    return JWT.sign(userInfo, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    })
  } catch (error) {
    handleThrowError(error)
  }
}

const verifyToken = (token: string, secretSignature: string) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error) {
    handleThrowError(error)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
