// src/producer.ts
import { Kafka, Producer, Partitioners } from 'kafkajs'
import { Order } from '~/@types/v1/order/interface.js'
import { OrderKafka } from '~/@types/v2/order/interface.js'

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['192.168.29.140:9092']
})
const producer: Producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
  allowAutoTopicCreation: true
})
let isProducerConnected = false

/**
 * Kết nối Producer (gọi một lần khi khởi ứng dụng)
 */
export async function connectProducer(): Promise<void> {
  if (!isProducerConnected) {
    await producer.connect()
    isProducerConnected = true
    console.log('Kafka producer connected')
  }
}

/**
 * Gửi Order đến Kafka topic 'order'
 */
export async function sendMessage(topic: string, order: OrderKafka): Promise<void> {
  // Đảm bảo producer đã kết nối
  if (!isProducerConnected) {
    await connectProducer()
  }

  // Chỉ gửi nếu orderId hợp lệ
  if (order.orderId || order.productId) {
    await producer.send({
      topic: topic,
      messages: [
        {
          key: order.productId.toString(),
          value: JSON.stringify(order)
        }
      ]
    })
  } else {
    console.warn('Order missing orderId, skip sending')
  }
}
