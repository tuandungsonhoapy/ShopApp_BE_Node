import { ObjectId } from 'mongodb'
import { ORDER_STATUS, paymentStatus } from '~/utils/constants.js'

export interface OrderDetail {
  productId: string | ObjectId
  quantity: number
  price: number
  total: number
  color?: string
  size?: string
  note?: string
}

export interface Order {
  fullName: string
  address: string
  email: string
  phoneNumber: string
  orderDate?: number
  status?: keyof typeof ORDER_STATUS
  total: number
  shippingMethod: string
  shippingAddress?: string
  trackingNumber?: string
  paymentMethod: string
  shippingDate?: number | null
  isActive?: boolean
  paymentStatus?: keyof typeof paymentStatus
  paymentDate?: number | null
  userId: string
  orderDetails?: OrderDetail[]
  createdAt?: number
  updatedAt?: number | null
  _destroy?: boolean
}
