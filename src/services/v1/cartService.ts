import { ICartItem } from '~/@types/cart/interface.js'
import { cartModel } from '~/models/v1/cartModel.js'

const addToCart = async (userId: string, cartItem: ICartItem) => {
  return await cartModel.addToCart(userId, cartItem)
}

const getCart = async (userId: string) => {
  return await cartModel.getCart(userId)
}

const updateCartItemQuantity = async (userId: string, productId: string, size: string, quantity: number) => {
  return await cartModel.updateCartItemQuantity(userId, productId, size, quantity)
}

const deleteCartItem = async (userId: string, productId: string, size: string) => {
  return await cartModel.deleteCartItem(userId, productId, size)
}

export const cartService = {
  addToCart,
  getCart,
  updateCartItemQuantity,
  deleteCartItem
}
