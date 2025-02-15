import multer from 'multer'
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from '~/utils/validators.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { Request } from 'express'

const storage = multer.memoryStorage()

const customFileFilter = (req: Request, file: any, cb: any) => {
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(StatusCodes.BAD_REQUEST, 'File type is not supported!'), false)
  }

  cb(null, true)
}

const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter,
  storage: storage
})

export const multerMiddleware = { upload }
