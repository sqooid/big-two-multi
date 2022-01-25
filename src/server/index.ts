import { handleClientEmits } from '@/server/event-handler'
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/interfaces/socket-events'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { removeUser } from '@/server/maps'

dotenv.config()

const app = express()
const server = http.createServer(app)
export const io = new Server<ClientToServerEvents, ServerToClientEvents>(
  server,
  {
    serveClient: false,
    cors: {
      origin: ['http://localhost:3000'],
    },
  },
)

// const root = path.join(__dirname + '../')
// console.log(root)
// process.chdir(root)
app.use(express.static(process.cwd())) // Fix working root directory

app.get('*', (req, res) => {
  console.log('Page served')
  res.sendFile(process.cwd() + '/index.html')
})

io.on('connection', (socket) => {
  console.log('Client connected')

  handleClientEmits(socket)

  socket.on('disconnect', () => {
    console.log('Client disconnected')
    removeUser(socket.id)
  })
})

const port = Number(process.env.VITE_SERVER_PORT) || 80
server.listen(port, () => {
  console.log('Listening on port', port)
})
