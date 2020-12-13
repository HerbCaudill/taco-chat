import { Card, CardBody, Label, Input, Button } from '@windmill/react-ui'
import { UserInfo } from './users'
import { DeviceInfo } from './devices'

export const Device = ({ user, device }: DeviceProps) => (
  <Card className="max-w-sm flex-1">
    <CardBody className="bg-teal-500 ">
      <h1 className="text-white text-2xl font-extrabold">{user.name}</h1>
      <span>{device.emoji}</span>
    </CardBody>
    <CardBody></CardBody>
  </Card>
)

interface DeviceProps {
  user: UserInfo
  device: DeviceInfo
}
