import * as auth from '@localfirst/auth'
import { Client } from '@localfirst/relay-client'
import { EventEmitter } from 'events'
import { Connection } from './Connection'
import debug from 'debug'

// TODO this probably belongs in the relay package - this would be the client we import?

const log = debug('lf:tc:connectionmanager')

/**
 * Wraps a Relay client and creates a Connection instance for each peer we connect to.
 */
export class ConnectionManager extends EventEmitter {
  private client: Client
  private connections: Record<string, Connection> = {}

  constructor({ teamName, urls, context }: ConnectionManagerOptions) {
    super()

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

        connection.on('connected', () => this.emit('connected', connection))
        connection.on('disconnected', event => {
          // disconnected from peer
          this.emit('disconnected', event)
          this.removePeer(id)
        })
      } else {
        log('no socket')
      }
    })
  }

  private removePeer = (peerId: string) => {
    if (this.connections[peerId]) this.connections[peerId].end()
    delete this.connections[peerId]
    this.emit('peer_remove', Object.keys(this.connections))
  }

  public get connectionCount() {
    return Object.keys(this.connections).length
  }

  public connectionState(userName: string) {
    const connection = this.connections[userName]
    return connection?.state
  }

  public async close() {
    const closeAllConnections = Object.keys(this.connections).map(peerId => this.removePeer(peerId))
    await Promise.all(closeAllConnections)
    this.connections = {}
  }
}

interface ConnectionManagerOptions {
  teamName: string
  urls: string[]
  context: auth.InitialContext
}
