import pg from 'pg'
import { env } from '~/configs/enviroment.js'

const { Pool } = pg

// * Tạo Pool kết nối đến PostgreSQL
const pool = new Pool({
  connectionString: env.POSTGRES_URI, // Ví dụ: 'postgres://user:password@localhost:5432/shopapp'
  max: 10, // Số kết nối tối đa
  idleTimeoutMillis: 30000, // Thời gian chờ trước khi đóng kết nối
  connectionTimeoutMillis: 5000 // Thời gian tối đa chờ kết nối
})

// * Hàm kết nối
export const connectDBPostgre = async () => {
  try {
    // const client = await pool.connect()
    // console.log('Connected to PostgreSQL successfully!')
    // client.release() // Giải phóng kết nối sau khi kiểm tra thành công
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err)
    process.exit(1)
  }
}

// * Lấy kết nối database từ Pool
export const getDBPostgre = () => pool

// * Đóng kết nối
export const closeDB = async () => {
  await pool.end()
  console.log('PostgreSQL connection closed.')
}
