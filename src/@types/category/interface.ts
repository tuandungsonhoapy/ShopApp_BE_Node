import { ObjectId } from 'mongodb'

export interface ICategory {
  _id?: string
  name?: string
  parent_id?: string | ObjectId | null
  description?: string
  createdAt?: string
  updatedAt?: string
  _destroy?: boolean
}
