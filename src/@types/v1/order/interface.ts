import { ObjectId } from 'mongodb'
import { ORDER_STATUS, paymentStatus } from '~/utils/constants.js'
import { IUser } from '../auth/interface.js'

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
  orderId?: string | ObjectId
  fullName: string
  address: string
  email: string
  phoneNumber: string
  orderDate?: number
  status?: keyof typeof ORDER_STATUS
  total: number
  shippingMethod: string
  shippingAddress?: string
  voucher?: string
  shippingFee?: number
  trackingNumber?: string
  paymentMethod: string
  shippingDate?: number | null | Date
  isActive?: boolean
  paymentStatus?: keyof typeof paymentStatus
  paymentDate?: number | null | Date
  userId: string | ObjectId
  orderDetails?: OrderDetail[]
  createdAt?: number
  updatedAt?: number | null
  _destroy?: boolean
}

export interface OrderWithUser extends Order {
  user?: IUser
}

export interface UpdateOrderStatusParams {
  orderId: string
  newStatus: keyof typeof ORDER_STATUS
}
