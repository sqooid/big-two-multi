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
import { log } from './log'

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
  console.error('Unable to read ssl credentials')
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
  log(`[${req.ip}] Page served`)
  res.sendFile(process.cwd() + '/index.html')
})

io.on('connection', (socket) => {
  log(`[${socket.handshake.address}] Client connected: ${socket.id}`)

  handleClientEmits(socket)

  socket.on('disconnect', () => {
    log(`[${socket.handshake.address}] Client disconnected: ${socket.id}`)
    removeUser(socket.id)
  })
})

const port = Number(process.env.VITE_SERVER_PORT) || (sslEnabled ? 443 : 80)
server.listen(port, () => {
  log(`[Server] Listening on port ${port}`)
})
