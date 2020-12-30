import * as auth from '@localfirst/auth'
import { Duplex } from 'stream'
import { WebSocketDuplex } from 'websocket-stream'

export class Connection extends Duplex {
  authConnection: auth.Connection

  constructor(peerSocket: WebSocketDuplex, context: auth.InitialContext) {
    super()
    const authConnection = new auth.Connection(context).start()

    // this Connection <-> authConnection <-> peerSocket
    this.pipe(authConnection).pipe(this)
    authConnection.pipe(peerSocket).pipe(authConnection)

    this._read = () => {}
    this._write = () => {}

    authConnection.on('connected', () => this.emit('connected'))
    authConnection.on('joined', () => this.emit('joined'))
    authConnection.on('disconnected', event => this.emit('disconnected', event))

    this.authConnection = authConnection
  }

  get team() {
    return this.authConnection.team
  }
}
