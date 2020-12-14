import { Card, CardBody } from '@windmill/react-ui'
import { DeviceInfo } from './devices'
import { UserInfo } from './users'

export const Peer = ({ id, user, device, onRemove }: PeerProps) => (
  <Card className="group max-w-sm flex-1 bg-white shadow-md relative">
    <RemoveButton onClick={() => onRemove(id)}></RemoveButton>
    <CardBody className="flex items-center bg-teal-500 leading-none">
      <div className="rounded-full border border-white w-12 h-12 bg-white bg-opacity-50 mr-3 text-2xl flex items-center ">
        <div className="align-middle text-center w-full">{user.emoji}</div>
      </div>
      <h1 className="text-white text-2xl font-extrabold flex-grow">{user.name}</h1>
      <div className="rounded-full border border-white w-8 h-8 bg-white bg-opacity-50 mr-3 text-md flex items-center ">
        <div className="align-middle text-center w-full">{device.emoji}</div>
      </div>
    </CardBody>
    <CardBody></CardBody>
  </Card>
)

interface PeerProps {
  user: UserInfo
  device: DeviceInfo
  id: string
  onRemove: (id: string) => void
}

export const RemoveButton = ({ onClick }: RemoveButtonProps) => (
  <div className="opacity-0 group-hover:opacity-100 ">
    <button
      className="
      absolute top-0 right-0 p-1 m-2 leading-none 
      opacity-25 hover:opacity-75
      focus:opacity-100 focus:outline-none focus:shadow-outline-neutral rounded-full
      text-white text-xs"
      onClick={onClick}
    >
      🗙
    </button>
  </div>
)

interface RemoveButtonProps {
  onClick: () => void
}
