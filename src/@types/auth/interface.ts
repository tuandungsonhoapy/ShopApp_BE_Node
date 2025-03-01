export interface IUser {
  _id?: string
  customerId?: string
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
  addresses?: Array<{
    address: string
    province: string
    district: string
    fullname: string
    phoneNumber: string
    isDefault: boolean
  }>
  createdAt?: string
  updatedAt?: string
  _destroy?: boolean
}

export interface IUserLogin {
  email: string
  password: string
  userAgent: string
}
