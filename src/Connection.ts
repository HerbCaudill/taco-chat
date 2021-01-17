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

    this.log = debug(`lf:tc:conn:${context.user.userName}`)

    const authConnection = new auth.Connection(context)
    authConnection.start()

    // this ⇆ authConnection ⇆ peerSocket
    this.pipe(authConnection).pipe(this)
    authConnection.pipe(peerSocket).pipe(authConnection)

    authConnection.on('connected', () => this.emit('connected'))
    authConnection.on('joined', () => this.emit('joined'))
    authConnection.on('disconnected', event => this.emit('disconnected', event))

    // peerSocket.on('data', (chunk: any) => this.log('received', chunk.toString()))
    // authConnection.on('data', (chunk: any) => this.log('sending', chunk.toString()))

    authConnection.on('change', state => {
      const newState = stateSummary(state.value)
      this.log('state change', newState)
      this.emit('change', newState)
    })

    this.authConnection = authConnection
  }

  get team() {
    return this.authConnection.team
  }

  get state() {
    return this.authConnection.state
  }
}

const stateSummary = (state: any): string =>
  isString(state)
    ? state
    : Object.keys(state)
        .map(key => (state[key] === 'done' ? '' : `${key}:${stateSummary(state[key])}`))
        .filter(s => s.length)
        .join(',')

const isString = (state: any) => typeof state === 'string'
