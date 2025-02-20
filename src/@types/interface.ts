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
  code?: string
  thumbnail?: string | null | any
  images: string[] | null | any
  status?: string
  slug?: string
  sizes: Array<{
    size: string
    stock: number
  }>
  stock?: number
  updatedAt?: Date | any | null
  _destroy?: boolean
}
