import { Client, newid, Peer } from '@localfirst/relay-client'
import { EventEmitter } from 'events'
import { Connection } from './Connection'

/**
 * Wraps a Client and creates a Connection instance for each peer we connect to.
 */
export class ConnectionManager extends EventEmitter {
  private client: Client
  private connections: { [peerId: string]: Connection } = {}

  constructor({ discoveryKey, urls, clientId = newid() }: ConnectionManagerOptions) {
    super()

    // TODO: randomly select a URL if more than one is provided? select best based on ping?
    this.client = new Client({ id: clientId, url: urls[0] })

    this.client.join(discoveryKey)
    this.client.on('peer', this.addPeer)
    this.client.on('open', () => this.emit('open'))
    this.client.on('close', () => this.emit('close'))
  }

  private addPeer = (peer: Peer, discoveryKey: string) => {
    const socket = peer.get(discoveryKey)

    peer.on('close', () => this.removePeer(peer.id))
    this.emit('peer', Object.keys(this.connections))
  }

  private removePeer = (peerId: string) => {
    if (this.connections[peerId]) this.connections[peerId].close()
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
  discoveryKey: string
  urls: string[]
  clientId?: string
}
