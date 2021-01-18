import * as auth from '@localfirst/auth'
import debug from 'debug'
import { Duplex } from 'stream'
import { WebSocketDuplex } from 'websocket-stream'

export class Connection extends Duplex {
  authConnection: auth.Connection
  log: debug.Debugger

  constructor(peerSocket: WebSocketDuplex, context: auth.InitialContext) {
    super()

    this.log = debug(`lf:tc:conn:${context.user.userName}`)

    const authConnection = new auth.Connection(context)
    authConnection.start()

    // this ⇆ authConnection ⇆ peerSocket
    this.pipe(authConnection).pipe(this)
    authConnection.pipe(peerSocket).pipe(authConnection)

    // TODO: I'd like to do this
    // ```
    // pipeline(this, authConnection, peerSocket)
    // ```
    // but pipeline is not happy with `this` being passed as a stream, maybe because it's still being constructed?
    // error is `Object(...) is not a function`

    authConnection.on('connected', () => this.emit('connected'))
    authConnection.on('joined', () => this.emit('joined'))
    authConnection.on('disconnected', event => this.emit('disconnected', event))
    authConnection.on('change', state => this.emit('change', stateSummary(state.value)))

    // Without this, the connection hangs unpredictably. I think I probably need to understand streams a bit better.
    authConnection.on('readable', () => authConnection.resume())

    this.authConnection = authConnection
  }

  _read() {}
  _write() {}

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
