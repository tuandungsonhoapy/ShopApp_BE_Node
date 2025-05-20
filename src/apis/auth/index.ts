import axios from 'axios'

export class AuthApi {
  static async verifyUser(request: string) {
    try {
      const response = await axios.get(`http://localhost:8083/api/v1/users/${request}`)
      return response.status === 200
    } catch (error) {
      return false
    }
  }
}
