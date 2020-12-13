import { Button, Select } from '@windmill/react-ui'
import { useRef } from 'react'
import { DeviceInfo, devices } from './devices'
import { UserInfo, users } from './users'

export const Chooser = ({ onSelect }: ChooserProps) => {
  const userSelect = useRef() as React.MutableRefObject<HTMLSelectElement>
  const deviceSelect = useRef() as React.MutableRefObject<HTMLSelectElement>

  const onClickAdd = () => {
    const userName = userSelect.current.value
    const user = users[userName]
    const deviceName = deviceSelect.current.value
    const device = devices[deviceName]
    return onSelect(user, device)
  }

  return (
    <div className="px-3">
      <div className="flex">
        <Select
          ref={userSelect}
          className="w-full flex-grow my-3 mr-3 h-10 font-normal text-lg"
          autoFocus={true}
        >
          {Object.keys(users).map((k) => (
            <option key={k} value={k}>
              {users[k].emoji} {users[k].name}
            </option>
          ))}
        </Select>
        <Select //
          ref={deviceSelect}
          className="w-full flex-1 min-w-24 my-3 h-10 text-lg"
        >
          {Object.keys(devices).map((k) => (
            <option key={k} value={k}>
              {devices[k].emoji}
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
  onSelect: (user: UserInfo, device: DeviceInfo) => void
}
