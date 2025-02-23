import { ICartItem } from '~/@types/cart/interface.js'
import { cartModel } from '~/models/cartModel.js'

const addToCart = async (userId: string, cartItem: ICartItem) => {
  return await cartModel.addToCart(userId, cartItem)
}

const getCart = async (userId: string) => {
  return await cartModel.getCart(userId)
}

export const cartService = {
  addToCart,
  getCart
}
