import { ObjectId } from 'mongodb'

export interface IVoucher {
  _id?: string | ObjectId
  code: string
  discountType: 'percent' | 'fixed'
  discountValue: number
  minOrderValue: number
  maxDiscount?: number | null
  expirationDate: string
  isActive?: boolean
  createdAt?: string | number
  updatedAt?: string | number
  _destroy?: boolean
}
