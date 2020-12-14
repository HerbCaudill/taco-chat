import { Select } from '@windmill/react-ui'
import { useRef } from 'react'
import { PeerMap } from './peers'

export const Chooser = ({ onAdd, peers }: ChooserProps) => {
  const peerSelect = useRef() as React.MutableRefObject<HTMLSelectElement>

  const onChange = () => onAdd(peerSelect.current.value)

  return (
    <div>
      <Select ref={peerSelect} className="h-10 font-normal text-lg" onChange={onChange}>
        <option>Add...</option>
        {Object.values(peers)
          .filter(p => !p.added)
          .map(p => (
            <option key={p.id} value={p.id}>
              {p.user.emoji} {p.device.emoji}
            </option>
          ))}
      </Select>
    </div>
  )
}
interface ChooserProps {
  onAdd: (id: string) => void
  peers: PeerMap
}
