import { JwtPayload } from 'jsonwebtoken'

declare module 'express-serve-static-core' {
  interface Request {
    jwtDecoded?: (JwtPayload & { role?: string; email?: string; _id?: string }) | string | undefined
  }
}
