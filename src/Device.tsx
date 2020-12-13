import { Card, CardBody, Label, Input, Button } from '@windmill/react-ui'
import { UserInfo } from './users'
import { DeviceInfo } from './devices'

export const Device = ({ user, device }: DeviceProps) => (
  <Card className="max-w-sm flex-1">
    <CardBody className="bg-teal-500 text-white text-2xl font-extrabold">{user.name}</CardBody>
    <CardBody></CardBody>
  </Card>
)

interface DeviceProps {
  user: UserInfo
  device: DeviceInfo
}
