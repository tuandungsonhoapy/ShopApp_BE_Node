import { ICartItem } from '~/@types/cart/interface.js'
import { cartModel } from '~/models/cartModel.js'

const addToCart = async (userId: string, cartItem: ICartItem) => {
  return await cartModel.addToCart(userId, cartItem)
}

export const cartService = {
  addToCart
}
