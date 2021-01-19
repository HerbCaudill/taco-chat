import * as auth from '@localfirst/auth'
import debug from 'debug'
import { EventEmitter } from 'events'
import { Duplex } from 'stream'
import { WebSocketDuplex } from 'websocket-stream'

export class Connection extends EventEmitter {
  authConnection: auth.Connection
  log: debug.Debugger
  stream = new Duplex({
    write: (_chunk, _encoding, next) => next(),
    read: () => {},
  })

  constructor(peerSocket: WebSocketDuplex, context: auth.InitialContext) {
    super()

    this.log = debug(`lf:tc:conn:${context.user.userName}`)

    const authConnection = new auth.Connection(context)
    authConnection.start()

    // this ⇆ authConnection ⇆ peerSocket
    this.stream.pipe(authConnection).pipe(this.stream)
    authConnection.pipe(peerSocket).pipe(authConnection)

    authConnection.on('connected', () => this.emit('connected'))
    authConnection.on('joined', () => this.emit('joined'))
    authConnection.on('disconnected', event => this.emit('disconnected', event))
    authConnection.on('change', state => this.emit('change', stateSummary(state.value)))

    this.authConnection = authConnection
  }

  get team() {
    return this.authConnection.team
  }

  get state() {
    return this.authConnection.state
  }

  public disconnect() {
    this.authConnection.stop()
    this.stream.end()
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
