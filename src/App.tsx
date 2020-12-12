import React, { useState } from 'react'
import { Chooser } from './Chooser'
import { Device } from './Device'

interface Peer {
  userName: string
  deviceName: string
}

const initialPeers: Peer[] = [{ userName: 'Alice', deviceName: 'laptop' }]
export const App = () => {
  const [peers, setPeers] = useState<Peer[]>(initialPeers)

  return (
    <div className="flex p-3">
      {peers.map((peer) => (
        <Device {...peer}></Device>
      ))}
      <Chooser></Chooser>
    </div>
  )
}
