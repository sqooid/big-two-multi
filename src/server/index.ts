import { handleClientEmits } from '@/server/event-handler'
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/interfaces/socket-events'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import https from 'https'
import { Server } from 'socket.io'
import path from 'path'
import fs from 'fs'
import { removeUser } from '@/server/maps'

dotenv.config()

// With certbot let's encrypt
let privateKey
let certificate
try {
  privateKey = fs.readFileSync(
    '/etc/letsencrypt/live/domain/privkey.pem',
    'utf-8',
  )
  certificate = fs.readFileSync(
    '/etc/letsencrypt/live/domain/fullchain.pem',
    'utf-8',
  )
} catch (e) {
  console.error('Failed to read ssl credentials:', e)
}

let server
let sslEnabled = false
const app = express()
if (privateKey && certificate) {
  const credentials = { key: privateKey, cert: certificate }
  server = https.createServer(credentials, app)
  sslEnabled = true
} else {
  server = http.createServer(app)
}

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(
  server,
  {
    serveClient: false,
    cors: {
      origin: ['http://localhost:3000'],
    },
  },
)

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

const port = Number(process.env.VITE_SERVER_PORT) || sslEnabled ? 443 : 80
server.listen(port, () => {
  console.log('Listening on port', port)
})
