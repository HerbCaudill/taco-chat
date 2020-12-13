import { Button, Select } from '@windmill/react-ui'
import { useRef, useState } from 'react'
import { Peer } from './App'
import { devices as deviceMap } from './devices'
import { users as userMap } from './users'

export const Chooser = ({ onSelect }: ChooserProps) => {
  const peerSelect = useRef() as React.MutableRefObject<HTMLSelectElement>

  const users = Object.values(userMap)
  const devices = Object.values(deviceMap)
  const allPeers = users.flatMap((user) => devices.map((device) => ({ user, device }))) as Peer[]

  const [peers, setPeers] = useState(allPeers)

  const [selectedPeer, setSelectedPeer] = useState(allPeers[0])

  const onClickAdd = () => {
    setPeers((peers) => {
      peers = peers.filter((p) => !isEqual(p, selectedPeer))
      setSelectedPeer(peers[0])
      return peers
    })
    onSelect(selectedPeer)
  }

  return (
    <div className="px-3">
      <div className="flex">
        <Select
          ref={peerSelect}
          onChange={() => setSelectedPeer(JSON.parse(peerSelect.current.value))}
          className="w-full flex-grow my-3 mr-3 h-10 font-normal text-lg"
          autoFocus={true}
        >
          {peers.map((p) => (
            <option key={JSON.stringify(p)} value={JSON.stringify(p)}>
              {p.user.emoji} {p.user.name} {p.device.emoji} {p.device.name}
            </option>
          ))}
        </Select>
      </div>
      <Button className="w-full block text-lg h-10" onClick={onClickAdd}>
        Add
      </Button>
    </div>
  )
}

interface ChooserProps {
  onSelect: (peer: Peer) => void
}

const isEqual = (a: Peer, b: Peer) => a.user.name === b.user.name && a.device.name === b.device.name
