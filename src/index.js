require('dotenv').config()

import http from 'http'
import { Server } from 'ws'
import { verify } from 'jsonwebtoken'

import { log, parse, fetchPortalFromId } from './utils'

console.log(require('fs').readFileSync('logo.txt', 'utf8'))

const wss = new Server({ port: 9001 }, () => log('WebSocket Server running on :9001'))
wss.on('connection', async (socket, { url }) => {
    const { t: token } = parse(url)
    if(!token) return socket.close()

    const { id } = verify(token, process.env.APERTURE_KEY), server = await fetchPortalFromId(id)
    if(!server) return socket.close()

    socket['id'] = server.id
    log('Connection over WS for Portal with id', server.id)

    socket.on('message', data => log('New message over WS:', data))
    socket.on('close', () => log('Disconnection over WS'))
})

const server = http.createServer((req, res) => {
    const { url } = req, params = parse(url)
    if(!params.t) return res.end(null)

    const { t: token } = params, { id } = verify(token, process.env.APERTURE_KEY)
    if(!id) return res.end(null)

    res.connection.setTimeout(0)
    log(`Stream with id ${id} connected from ${req.socket.remoteAddress}:${req.socket.remotePort}`)
    
    req.on('data', data =>
        Array.from(wss.clients)
            .filter(client => client['id'] === id)
            .forEach(client => client.send(data))
    )
})

server.listen(9000, () => log('Streaming Server running on :9000'))