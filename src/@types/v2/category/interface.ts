export interface ICategory {
  id?: number
  name: string
  description?: string
  parent_id?: number | null
  created_at?: Date
  updated_at?: Date | null
  _destroy?: boolean
}
