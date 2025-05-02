import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'order-producer',
  brokers: ['localhost:9092'] // hoặc 'kafka:9092' nếu chạy trong Docker
})

const producer = kafka.producer()

export const sendOrderToKafka = async (order: any) => {
  await producer.connect()
  await producer.send({
    topic: 'sale-transactions',
    messages: [
      {
        key: order.transaction_id,
        value: JSON.stringify(order)
      }
    ]
  })
  await producer.disconnect()
}
