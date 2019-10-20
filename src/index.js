require('dotenv').config()

import http from 'http'
import { Server } from 'ws'
import { verify } from 'jsonwebtoken'

import { verify_env, log, errlog, parse, fetchPortalFromId } from './utils'

verify_env('APERTURE_KEY', 'STREAMING_KEY')

const streamingPort = process.env.STREAMING_PORT || 9000,
        aperturePort = process.env.APERTURE_PORT || 9001

console.log(require('fs').readFileSync('logo.txt', 'utf8')
            .replace(':APERTURE_PORT', aperturePort)
            .replace(':STREAMING_PORT', streamingPort)
)

const wss = new Server({ port: aperturePort }, () => log(`WebSocket Server running on :${aperturePort}`))
wss.on('connection', async (socket, { url }) => {
    const { t: token } = parse(url)

    if(!token) {
        log(`A client tried to connect but didn't provide a token`)
        return socket.close()
    }

    let payload

    try {
        payload = verify(token, process.env.APERTURE_KEY)
    } catch (error) {
        // I think we should log this for now as some people are experiencing issues
        // with this as their token gets expired, but shouldn't crash aperture now.
        errlog(`A client failed to authenticate`, error)
        return socket.close()
    }

    if(!payload.id) {
        log(`A client was rejected as the portal ID could not be found`)
        return socket.close()
    }

    const { id } = payload,
          server = await fetchPortalFromId(id)

    if(!server) {
        log(`A client tried to connect to a stream which does not exists: ${id}`)
        return socket.close()
    }

    socket['id'] = server.id
    log('Connection over WS for Portal ID', server.id)

    socket.on('message', data => log(`New message over WS for Portal ID ${id}:`, data))
    socket.on('close', () => log(`Disconnection over WS for Portal ID ${id}`))
})

const server = http.createServer((req, res) => {
    const { url } = req,
          { t: token } = parse(url),
          address = `${req.socket.remoteAddress}:${req.socket.remotePort}`

    if (!token) {
        log(`An attempted stream from ${address} failed as no token was provided`)
        return res.end(null)
    }

    let payload

    try {
        payload = verify(token, process.env.STREAMING_KEY || process.env.APERTURE_KEY)
    } catch (error) {
        errlog(`An attempted stream from ${address} failed in authentication`, error)
        return res.end(null)
    }

    if (!payload.id) {
        log(`An attempted stream from ${address} was rejected as the portal ID could not be found`)
        return res.end(null)
    }

    const { id } = payload

    res.connection.setTimeout(0)
    log(`Stream with ID ${id} connected from ${address}`)

    req.on('data', data =>
        Array.from(wss.clients)
        .filter(client => client['id'] === id)
        .forEach(client => client.send(data))
    )
})

server.listen(streamingPort, () => log(`Streaming Server running on :${streamingPort}`))
