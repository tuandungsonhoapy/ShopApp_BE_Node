import lodash from 'lodash'
import { IUser } from '~/@types/interface.js'

const { pick } = lodash

export const slugify = (val: string) => {
  if (!val) return ''
  return String(val)
    .normalize('NFKD') // Tách ký tự có dấu thành ký tự cơ bản và dấu tách biệt
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/Đ/g, 'd') // Thay thế chữ Đ (hoa) thành d
    .replace(/đ/g, 'd') // Thay thế chữ đ (thường) thành d
    .replace(/&/g, '-and-') // Thay thế & bằng 'and'
    .replace(/[\s\W-]+/g, '-') // Thay thế khoảng trắng, ký tự không phải chữ và dấu gạch ngang bằng một dấu gạch ngang
    .trim() // Xóa khoảng trắng ở đầu và cuối
    .toLowerCase() // Chuyển sang chữ thường
    .replace(/[^a-z0-9 -]/g, '') // Loại bỏ ký tự không phải chữ cái hoặc số
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-') // Xóa các dấu gạch ngang liên tiếp
}

export const pickUser = (user: IUser) => {
  if (!user) return null
  const newUser = pick(user, [
    '_id',
    'customerId',
    'email',
    'fullname',
    'displayName',
    'province',
    'district',
    'address',
    'avatar',
    'phoneNumber',
    'require_2fa',
    'is_2fa_verified',
    'role',
    'isActive',
    'createdAt',
    'updatedAt'
  ])

  return newUser
}
