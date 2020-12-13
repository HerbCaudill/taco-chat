import { Button, Select } from '@windmill/react-ui'
import { useRef, useState } from 'react'
import { Peer } from './App'
import { DeviceInfo, devices as deviceMap } from './devices'
import { UserInfo, users as userMap } from './users'

export const Chooser = ({ onSelect, selected }: ChooserProps) => {
  const userSelect = useRef() as React.MutableRefObject<HTMLSelectElement>
  const deviceSelect = useRef() as React.MutableRefObject<HTMLSelectElement>

  const users = Object.values(userMap)
  const devices = Object.values(deviceMap)
  const [userName, setUserName] = useState(users[0].name)
  const [deviceName, setDeviceName] = useState(devices[0].name)

  const onClickAdd = () => {
    const user = userMap[userName]
    const device = deviceMap[deviceName]
    return onSelect(user, device)
  }

  return (
    <div className="px-3">
      <div className="flex">
        <Select
          ref={userSelect}
          onChange={() => setUserName(userSelect.current.value)}
          className="w-full flex-grow my-3 mr-3 h-10 font-normal text-lg"
          autoFocus={true}
        >
          {users.map((user) => (
            <option key={user.name} value={user.name}>
              {user.emoji} {user.name}
            </option>
          ))}
        </Select>
        <Select
          ref={deviceSelect}
          onChange={() => setDeviceName(deviceSelect.current.value)}
          className="w-full flex-1 min-w-24 my-3 h-10 text-lg"
        >
          {devices.map((device) => (
            <option key={device.name} value={device.name}>
              {device.emoji}
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
  selected: Peer[]
}
