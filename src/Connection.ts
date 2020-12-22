import { Duplex } from 'stream'

/**
 * A `Connection` keeps one local document synchronized with one peer's replica of the same
 * document. It uses `Synchronizer` for the synchronization logic, and integrates it with our
 * networking stack and with the Redux store.
 */
export class Connection extends Duplex {
  private peerSocket: WebSocket | null

  constructor(peerSocket: WebSocket) {
    super()
    this.peerSocket = peerSocket

    this.peerSocket.onmessage = async ({ data }: any) => {
      const message = JSON.parse(data.toString())
      this.emit('receive', message)
    }
  }

  public write = (message: any) => {
    if (this.peerSocket)
      try {
        this.peerSocket.send(JSON.stringify(message))
      } catch (err) {
        return false
      }
    return true
  }

  public close = () => {
    if (!this.peerSocket) return
    this.peerSocket.close()
    this.peerSocket = null
  }
}
