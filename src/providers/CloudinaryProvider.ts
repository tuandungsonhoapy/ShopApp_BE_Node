// import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'
// import streamifier from 'streamifier'
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// })

// const streamUpload = (buffer: Buffer): Promise<UploadApiResponse> => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       (error: UploadApiErrorResponse | undefined, result?: UploadApiResponse) => {
//         if (result) {
//           resolve(result)
//         } else {
//           reject(error)
//         }
//       }
//     )

//     streamifier.createReadStream(buffer).pipe(stream)
//   })
// }

// export const uploadToCloudinary = async (buffer: Buffer): Promise<string> => {
//   try {
//     const result = await streamUpload(buffer)
//     return result.secure_url
//   } catch (error) {
//     throw new Error('Upload to Cloudinary failed')
//   }
// }
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

export const CloudinaryProvider = { streamUpload}