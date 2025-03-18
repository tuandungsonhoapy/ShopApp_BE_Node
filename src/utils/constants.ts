import { env } from '~/configs/enviroment.js'

export const WHITELIST_DOMAINS: Array<string> = []

export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARE: 'prepare',
  SHIPPING: 'shipping',
  COMPLETED: 'completed',
  REFUND: 'refund',
  CANCEL: 'cancel'
}

export const paymentStatus = {
  UNPAID: 'unpaid',
  PAID: 'paid'
}

export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
}

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female'
}

export const WEB_DOMAIN = env.BUILD_MODE === 'dev' ? env.WEB_DOMAIN_DEV : env.WEB_DOMAIN_PROD
