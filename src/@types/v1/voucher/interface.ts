import { ObjectId } from 'mongodb'

export interface IVoucher {
  _id?: string | ObjectId
  code: string
  description?: string
  discountType: 'percent' | 'fixed'
  discountValue: number
  minOrderValue: number
  maxDiscount?: number | null
  expirationDate: Date | string
  isActive?: boolean
  createdAt?: Date | string | number
  updatedAt?: Date | string | number
  _destroy?: boolean
  usageLimit?: number | null
  usageCount?: number
  applicableProducts?: string[]
  applicableCategories?: string[]
}
