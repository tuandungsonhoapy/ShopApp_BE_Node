import { DefaultEventsMap, Socket } from 'socket.io'

export const testMessageSocket = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  socket.on('fe-message', (data) => {
    console.log('Received message:', data)

    // Gửi tin nhắn đến client sau khi nhận được tin nhắn từ client
    socket.emit('be-message', { content: 'Hello from server!' })
  })
}
