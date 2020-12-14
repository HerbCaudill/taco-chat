import { Button, Select } from '@windmill/react-ui'
import { useRef } from 'react'
import { PeerMap } from './peers'

export const Chooser = ({ onAdd, peers }: ChooserProps) => {
  const peerSelect = useRef() as React.MutableRefObject<HTMLSelectElement>

  return (
    <div className="px-3 flex">
      <div className="w-64 flex-grow mr-3 ">
        <Select ref={peerSelect} className="w-full h-10 font-normal text-lg" autoFocus={true}>
          {Object.values(peers)
            .filter(p => !p.added)
            .map(p => (
              <option key={p.id} value={p.id}>
                {p.user.emoji} {p.device.emoji}
              </option>
            ))}
        </Select>
      </div>
      <Button
        className="w-full flex-0 block text-lg h-10"
        onClick={() => onAdd(peerSelect.current.value)}
      >
        Add
      </Button>
    </div>
  )
}

interface ChooserProps {
  onAdd: (id: string) => void
  peers: PeerMap
}
