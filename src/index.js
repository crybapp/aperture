require('dotenv').config()

import http from 'http'
import { Server } from 'ws'
import { verify } from 'jsonwebtoken'

import { log, parse, fetchPortalFromId } from './utils'

console.log(require('fs').readFileSync('logo.txt', 'utf8'))

const wss = new Server({ port: 9001 }, () => log('WebSocket Server running on :9001'))
wss.on('connection', async (socket, { url }) => {
    const { t: token } = parse(url)
    if(!token) {
        log(`A client tried to connect but didn't provide a token`)
        return socket.close()
    }

    let id

    try {
        id = verify(token, process.env.APERTURE_KEY).id
        if(!id) {
            log(`A client was rejected as the portal ID could not be found`)
            return socket.close()
        }
    } catch (error) {
        // I think we should log this for now as some people are experiencing issues
        // with this as their token gets expired, but shouldn't crash aperture now.
        console.error(`A client failed to authenticate`, error)
        return socket.close()
    }

    const server = await fetchPortalFromId(id)
    if(!server) {
        log(`A client tried to connect to a stream which does not exists: ${id}`)
        return socket.close()
    }

    socket['id'] = server.id
    log('Connection over WS for Portal with ID', server.id)

    socket.on('message', data => log('New message over WS:', data))
    socket.on('close', () => log('Disconnection over WS'))
})

const server = http.createServer((req, res) => {
    const { url } = req,
          { t: token } = parse(url),
          address = `${req.socket.remoteAddress}:${req.socket.remotePort}`

    if(!token) {
        log(`An attempted stream from ${address} failed as no token was provided`)
        return res.end(null)
    }

    let id

    try {
        id = verify(token, process.env.APERTURE_KEY).id
        if(!id) {
            log(`An attempted stream from ${address} was rejected as the portal ID could not be found`)
            return res.end(null)
        }
    } catch (error) {
        console.error(`An attempted stream from ${address} failed in authentication`, error)
        return res.end(null)
    }

    res.connection.setTimeout(0)
    log(`Stream with ID ${id} connected from ${address}`)

    req.on('data', data =>
        Array.from(wss.clients)
            .filter(client => client['id'] === id)
            .forEach(client => client.send(data))
    )
})

server.listen(9000, () => log('Streaming Server running on :9000'))
