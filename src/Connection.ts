import * as auth from '@localfirst/auth'
import { Duplex } from 'stream'
import { WebSocketDuplex } from 'websocket-stream'
import debug from 'debug'

export class Connection extends Duplex {
  authConnection: auth.Connection
  log: debug.Debugger

  constructor(peerSocket: WebSocketDuplex, context: auth.InitialContext) {
    super()
    this._read = () => {}
    this._write = () => {}

    this.log = debug(`lf:tc:connection:${context.user.userName}`)

    const authConnection = new auth.Connection(context)
    authConnection.start()

    // this ⇆ authConnection ⇆ peerSocket
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

  get state() {
    return this.authConnection.state
  }
}
