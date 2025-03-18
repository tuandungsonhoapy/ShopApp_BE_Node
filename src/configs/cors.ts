import { WHITELIST_DOMAINS } from '~/utils/constants.js'
import { env } from '~/configs/enviroment.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'

interface CorsOptions {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void
  optionsSuccessStatus: number
  credentials: boolean
}

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Cho phép việc gọi API bằng POSTMAN trên môi trường dev,
    if (!origin || env.BUILD_MODE === 'dev') {
      return callback(null, true)
    }

    // Kiểm tra dem origin có phải là domain được chấp nhận hay không
    if (WHITELIST_DOMAINS.includes(origin || '')) {
      return callback(null, true)
    }

    // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
    return callback(
      new ApiError(
        StatusCodes.FORBIDDEN,
        origin ? `${origin} not allowed by CORS Policy.` : 'Not allowed by CORS Policy.'
      )
    )
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  credentials: true
}
