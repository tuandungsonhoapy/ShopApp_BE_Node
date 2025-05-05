import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'order-producer',
  brokers: ['52.90.150.186:9092'] // hoặc 'kafka:9092' nếu chạy trong Docker
})

const producer = kafka.producer()

export const sendOrderToKafka = async (order: any, partition: number) => {
  await producer.connect()

  await producer
    .send({
      topic: 'sale-transactions',
      messages: [
        {
          key: order.transaction_id,
          value: JSON.stringify(order),
          partition: partition
        }
      ]
    })
    .then((result) => console.log(`📤 Sent to partition ${result[0].partition}`))

  await producer.disconnect()
}
