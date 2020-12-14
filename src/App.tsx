import React, { useState } from 'react'
import { Chooser } from './Chooser'
import { Peer } from './Peer'
import { peers as allPeers, PeerMap } from './peers'

allPeers['Alice:laptop'].added = true

export const App = () => {
  const [peers, setPeers] = useState<PeerMap>(allPeers)

  const setAdded = (v: boolean) => (id: string) =>
    setPeers(peers => ({ ...peers, [id]: { ...peers[id], added: v } }))

  return (
    <div className="flex p-3 gap-3" style={{ minWidth: 2400 }}>
      {Object.values(peers)
        .filter(p => p.added)
        .map(p => (
          <Peer key={p.id} onRemove={setAdded(false)} {...p}></Peer>
        ))}
      <Chooser onAdd={setAdded(true)} peers={peers}></Chooser>
    </div>
  )
}
