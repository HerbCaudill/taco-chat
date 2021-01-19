import * as auth from '@localfirst/auth'
import { Client } from '@localfirst/relay-client'
import { EventEmitter } from 'events'
import { Connection } from './Connection'
import debug from 'debug'

// TODO this probably belongs in the relay package - this would be the client we import?

/**
 * Wraps a Relay client and creates a Connection instance for each peer we connect to.
 */
export class ConnectionManager extends EventEmitter {
  private client: Client
  private connections: Record<string, Connection> = {}
  private log: debug.Debugger

  public state: Record<string, string> = {}

  constructor({ teamName, urls, context }: ConnectionManagerOptions) {
    super()
    this.log = debug(`lf:tc:connmgr:${context.user.userName}`)

    // connect to relay server
    this.client = new Client({ id: context.user.userName, url: urls[0] })
    // tell relay server we're interested in a specific team
    this.client.join(teamName)

    this.client.on('close', () => {
      // disconnected from relay server
      this.emit('close')
    })

    this.client.on('peer', ({ id, socket }) => {
      if (socket) {
        // connected to a new peer
        const connection = new Connection(socket, context)
        this.connections[id] = connection

        connection.on('change', connectionState => {
          this.state = {
            ...this.state,
            [id]: connectionState,
          }
          this.emit('change')
        })

        connection.on('connected', () => this.emit('connected', connection))
        connection.on('disconnected', event => this.disconnect(id, event))
      } else {
        this.log('no socket')
      }
    })
  }

  public disconnect = (id: string, event?: any) => {
    if (this.connections[id]) this.connections[id].disconnect()
    delete this.connections[id]
    const { [id]: toDelete, ...rest } = this.state
    this.state = rest
    this.emit('disconnected', id, event)
  }

  public get connectionCount() {
    return Object.keys(this.connections).length
  }

  public async close() {
    const closeAllConnections = Object.keys(this.connections).map(peerId => this.disconnect(peerId))
    await Promise.all(closeAllConnections)
    this.connections = {}
  }
}

interface ConnectionManagerOptions {
  teamName: string
  urls: string[]
  context: auth.InitialContext
}
