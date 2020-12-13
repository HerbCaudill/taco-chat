import React, { useState } from 'react'
import { Chooser } from './Chooser'
import { Device } from './Device'
import { DeviceInfo } from './devices'
import { UserInfo } from './users'

export interface Peer {
  user: UserInfo
  device: DeviceInfo
}

const initialPeers: Peer[] = []

export const App = () => {
  const [peers, setPeers] = useState<Peer[]>(initialPeers)

  const onSelect = (peer: Peer) => {
    setPeers((peers) => [...peers, peer])
  }

  return (
    <div className="flex p-3 gap-3" style={{ minWidth: 2400 }}>
      {peers.map((peer) => (
        <Device key={`${peer.user.name}:${peer.device.name}`} {...peer}></Device>
      ))}
      <Chooser onSelect={onSelect}></Chooser>
    </div>
  )
}
