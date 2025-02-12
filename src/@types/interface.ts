export interface IUser {
  _id?: string
  fullname?: string
  email?: string
  password?: string
  confirmPassword?: string
  phoneNumber?: string
  address?: string
  province?: string
  district?: string
  displayName?: string
  dateOfBirth?: string
  avatar?: string
  isActive?: boolean
  role?: string
  require_2fa?: boolean
  secretKey_2fa?: string
}

export interface IUserLogin {
  email: string
  password: string
  userAgent: string
}

export interface IProduct {
  _id?: string
  title: string
  product_category_id?: string
  description?: string
  price: number
  thumbnail?: string | null
  status?: string
  slug?: string
  deleted?: boolean
  stock?: number
  createdBy: {
    account_id: string
    createdAt?: Date
  }
  createdAt?: Date
  updatedAt?: Date
}
