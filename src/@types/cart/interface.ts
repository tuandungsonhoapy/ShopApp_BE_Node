import { ObjectId } from 'mongodb'

export interface ICartItem {
  productId?: ObjectId | string
  title?: string
  size?: string
  quantity?: number
  price?: number
  thumbnail?: string
}

export interface ICart {
  _id?: ObjectId | string
  userId?: ObjectId | string
  products: ICartItem[]
}
