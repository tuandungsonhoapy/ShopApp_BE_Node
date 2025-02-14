export interface IProduct {
  _id?: string
  title: string
  categoryId?: string
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
  _destroy?: boolean
}
