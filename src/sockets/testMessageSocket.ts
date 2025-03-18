import { DefaultEventsMap, Socket } from 'socket.io'

export const testMessageSocket = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  socket.on('fe-message', (data) => {
    socket.broadcast.emit('be-message', data)
  })
}
