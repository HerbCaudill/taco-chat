import React, { useState } from 'react'
import { Chooser } from './Chooser'
import { Device } from './Device'
import { UserInfo, users } from './users'
import { DeviceInfo, devices } from './devices'

export interface Peer {
  user: UserInfo
  device: DeviceInfo
}

const initialPeers: Peer[] = []

export const App = () => {
  const [peers, setPeers] = useState<Peer[]>(initialPeers)

  const onSelect = (user: UserInfo, device: DeviceInfo) => {
    setPeers((peers) => [...peers, { user, device }])
  }

  return (
    <div className="flex p-3 gap-3" style={{ minWidth: 2400 }}>
      {peers.map((peer) => (
        <Device key={`${peer.user.name}:${peer.device.name}`} {...peer}></Device>
      ))}
      <Chooser onSelect={onSelect} selected={peers}></Chooser>
    </div>
  )
}
