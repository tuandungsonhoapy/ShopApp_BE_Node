import { ObjectId } from 'mongodb'
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { getDB } from '~/configs/mongodb.js'
import { handleThrowError } from '~/middlewares/errorHandlingMiddleware.js'
import { ICart, ICartItem } from '~/@types/cart/interface.js'

const CART_COLLECTION_NAME = 'cart'

const CART_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        quantity: Joi.number().required().min(1),
        size: Joi.string().required(),
        title: Joi.string(),
        price: Joi.number().required().min(0),
        thumbnail: Joi.string()
      })
    )
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validData = async (data: ICart) => {
  return await CART_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const findOneById = async (id: string) => {
  try {
    return await getDB()
      .collection(CART_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      })
  } catch (error) {
    handleThrowError(error)
  }
}

const addToCart = async (userId: string, product: ICartItem) => {
  try {
    const cartCollection = getDB().collection(CART_COLLECTION_NAME)
    const cart = await cartCollection.findOne({ userId: ObjectId.createFromHexString(userId) })

    if (!cart) {
      const validatedData = await validData({
        userId,
        products: [product]
      })

      validatedData.products = validatedData.products.map((item: ICartItem) => ({
        ...item,
        productId: ObjectId.createFromHexString(item.productId?.toString() || '')
      }))

      const result = await cartCollection.insertOne({
        ...validatedData,
        userId: ObjectId.createFromHexString(userId.toString())
      })

      return await cartCollection.findOne({ _id: result.insertedId })
    } else {
      return await cartCollection
        .findOneAndUpdate(
          {
            userId: ObjectId.createFromHexString(userId.toString()),
            'products.productId': ObjectId.createFromHexString(product.productId?.toString() || ''),
            'products.size': product.size
          },
          {
            $inc: { 'products.$.quantity': product.quantity || 1 }
          },
          { upsert: false, returnDocument: 'after' }
        )
        .then((result) => {
          if (!result) {
            // Nếu không tìm thấy sản phẩm trùng, thêm mới vào giỏ hàng
            return cartCollection.findOneAndUpdate(
              { userId: ObjectId.createFromHexString(userId.toString()) },
              {
                $push: {
                  products: {
                    ...product,
                    productId: ObjectId.createFromHexString(product.productId?.toString() || ''),
                    quantity: product.quantity || 1 // Đặt mặc định nếu không có quantity
                  }
                } as any
              },
              { upsert: true, returnDocument: 'after' }
            )
          }
          return result
        })
    }
  } catch (error) {
    handleThrowError(error)
  }
}

const getCart = async (userId: string) => {
  try {
    return await getDB()
      .collection(CART_COLLECTION_NAME)
      .findOne({ userId: ObjectId.createFromHexString(userId) })
  } catch (error) {
    handleThrowError(error)
  }
}

const updateCartItemQuantity = async (userId: string, productId: string, size: string, quantity: number) => {
  try {
    const cartCollection = getDB().collection(CART_COLLECTION_NAME)

    // Nếu quantity <= 0, xóa sản phẩm khỏi giỏ hàng
    if (quantity <= 0) {
      return await deleteCartItem(userId, productId, size)
    }

    return await cartCollection.findOneAndUpdate(
      {
        userId: ObjectId.createFromHexString(userId),
        'products.productId': ObjectId.createFromHexString(productId),
        'products.size': size
      },
      {
        $set: { 'products.$.quantity': quantity }
      },
      { returnDocument: 'after' }
    )
  } catch (error) {
    handleThrowError(error)
  }
}

const deleteCartItem = async (userId: string, productId: string, size: string) => {
  try {
    const cartCollection = getDB().collection(CART_COLLECTION_NAME)

    return await cartCollection.findOneAndUpdate(
      { userId: ObjectId.createFromHexString(userId) },
      {
        $pull: {
          products: {
            productId: ObjectId.createFromHexString(productId),
            size: size
          }
        } as any
      },
      { returnDocument: 'after' }
    )
  } catch (error) {
    handleThrowError(error)
  }
}

export const cartModel = {
  CART_COLLECTION_NAME,
  CART_COLLECTION_SCHEMA,
  addToCart,
  findOneById,
  getCart,
  updateCartItemQuantity,
  deleteCartItem
}
