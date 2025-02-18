import { env } from '~/configs/enviroment.js'

export const WHITELIST_DOMAINS: Array<string> = []

export const orderStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELED: 'canceled'
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
