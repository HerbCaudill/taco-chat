import * as auth from '@localfirst/auth'
import { Duplex } from 'stream'
import { WebSocketDuplex } from 'websocket-stream'
import debug from 'debug'
const log = debug('lf:tc:connection')

export class Connection extends Duplex {
  authConnection: auth.Connection

  constructor(peerSocket: WebSocketDuplex, context: auth.InitialContext) {
    super()

    this._read = () => {}
    this._write = () => {}

    const authConnection = new auth.Connection(context)
    authConnection.start()

    // this <-> authConnection <-> peerSocket
    log({ peerSocket, authConnection })

    this.pipe(authConnection).pipe(this)
    authConnection.pipe(peerSocket).pipe(authConnection)

    authConnection.on('connected', () => this.emit('connected'))
    authConnection.on('joined', () => this.emit('joined'))
    authConnection.on('disconnected', event => this.emit('disconnected', event))

    this.authConnection = authConnection
  }

  get team() {
    return this.authConnection.team
  }
}
