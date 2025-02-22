export interface IProduct {
  _id?: string
  title: string
  categoryId?: string
  description?: string
  price: number
  sizes: Array<{
    size: string
    stock: number
    price: number
  }>
  thumbnail?: string | null
  images: string[] | null
  status?: string
  slug?: string
  stock?: number
  createdBy: {
    account_id: string
    createdAt?: Date
  }
  createdAt?: Date
  updatedAt?: Date
  _destroy?: boolean
}
