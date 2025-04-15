export interface IUser_V2 {
  id?: number
  customerId?: string
  fullname?: string
  email?: string
  password?: string
  confirm_password?: string
  phone_number?: string
  address?: string
  province?: string
  district?: string
  display_name?: string
  date_of_birth?: string
  avatar?: string
  is_active?: boolean
  role?: string
  require_2fa?: boolean
  secretKey_2fa?: string
  forgotPasswordOTP?: string
  verify_token?: string
  createdAt?: string
  updatedAt?: string
  _destroy?: boolean
}

export interface IUserLogin {
  email: string
  password: string
  userAgent: string
}
