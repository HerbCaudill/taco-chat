import * as auth from '@localfirst/auth'
import { Client } from '@localfirst/relay-client'
import { EventEmitter } from 'events'
import { Connection } from './Connection'

// TODO this probably belongs in the relay package - this would be the client we import
/**
 * Wraps a Client and creates a Connection instance for each peer we connect to.
 */
export class ConnectionManager extends EventEmitter {
  private client: Client
  private connections: { [peerId: string]: Connection } = {}

  constructor({ teamName, urls, context }: ConnectionManagerOptions) {
    super()
    this.client = new Client({ id: context.user.userName, url: urls[0] })

    this.client.join(teamName)

    this.client.on('peer', ({ key, id, socket }) => {
      const connection = new Connection(socket, context)
      this.connections[id] = connection
      connection.on('connected', () => this.emit('peer', connection))
      connection.on('disconnected', () => this.removePeer(id))
    })

    this.client.on('open', () => this.emit('open'))
    this.client.on('close', () => this.emit('close'))
  }

  private removePeer = (peerId: string) => {
    if (this.connections[peerId]) this.connections[peerId].end()
    delete this.connections[peerId]
    this.emit('peer_remove', Object.keys(this.connections))
  }

  public get connectionCount() {
    return Object.keys(this.connections).length
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
