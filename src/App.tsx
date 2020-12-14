import React, { useState } from 'react'
import { Chooser } from './Chooser'
import { Peer } from './Peer'
import { peers as allPeers, PeerMap } from './peers'

export const App = () => {
  const [peers, setPeers] = useState<PeerMap>(allPeers)

  const onAdd = (id: string) => {
    setPeers(peers => ({ ...peers, [id]: { ...peers[id], added: true } }))
  }
  const onRemove = (id: string) => {
    setPeers(peers => ({ ...peers, [id]: { ...peers[id], added: false } }))
  }

  return (
    <div className="flex p-3 gap-3" style={{ minWidth: 2400 }}>
      {Object.values(peers)
        .filter(p => p.added)
        .map(p => (
          <Peer key={p.id} onRemove={onRemove} {...p}></Peer>
        ))}
      <Chooser onAdd={onAdd} peers={peers}></Chooser>
    </div>
  )
}
