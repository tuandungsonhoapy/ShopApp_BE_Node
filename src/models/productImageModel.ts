import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'

const PRODUCT_IMAGE_COLLECTION_NAME = 'product_images'
const PRODUCT_IMAGE_COLLECTION_SCHEMA = Joi.object({
  imageUrl: Joi.string().required().trim().strict(),
  productId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

export const productImageModel = {
  PRODUCT_IMAGE_COLLECTION_NAME,
  PRODUCT_IMAGE_COLLECTION_SCHEMA
}
