import { ObjectId } from 'mongodb'

export interface IProduct {
  imagesURL?: string
  _id?: string | ObjectId
  title: string
  categoryId?: string
  description?: string
  code?: string
  thumbnail?: string | null | any
  images: string[] | null | any
  status?: string
  slug?: string
  sizes: Array<{
    size: string
    stock: number
    price: number
  }>
  createdAt?: Date | any | null
  updatedAt?: Date | any | null
  _destroy?: boolean
}
