import React, { useState } from 'react'
import { Chooser } from './Chooser'
import { Device } from './Device'

interface Peer {
  userName: string
  deviceName: string
}

const initialPeers: Peer[] = []
export const App = () => {
  const [peers, setPeers] = useState<Peer[]>(initialPeers)
const onSelect = () => {
  setPeers([])
}

  return (
    <div className="flex p-3">
      {peers.map((peer) => (
        <Device {...peer}></Device>
      ))}
      <Chooser onSelect={onSelect}></Chooser>
    </div>
  )
}
