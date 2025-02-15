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
  forgotPasswordOTP?: string
  verifyToken?: string
}

export interface IUserLogin {
  email: string
  password: string
  userAgent: string
}

export interface ICategory {
  _id?: string
  name?: string
  description?: string
  createdAt?: string
  updatedAt?: string
  _destroy?: boolean
}
export interface IProduct {
  _id?: string
  title: string
  categoryId?: string
  description?: string
  price: number
  thumbnail?: string | null | any
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
  _destroy?: boolean
}
