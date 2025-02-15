import streamifier from 'streamifier'
import { env } from '~/configs/enviroment.js'

import { v2 as cloudinary } from 'cloudinary'

// Configuration
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
})

const streamUpload = (buffer: any, folderName: any) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto', folder: folderName }, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })

    streamifier.createReadStream(buffer).pipe(stream)
  })
}

export const CloudinaryProvider = { streamUpload }
