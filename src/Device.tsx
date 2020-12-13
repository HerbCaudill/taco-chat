import { Card, CardBody, Label, Input, Button } from '@windmill/react-ui'

export const Device = ({ userName, deviceName }: DeviceProps) => (
  <Card className="max-w-sm flex-1">
    <CardBody className="bg-teal-500 text-white text-2xl font-extrabold">{userName}</CardBody>
    <CardBody></CardBody>
  </Card>
)

interface DeviceProps {
  userName: string
  deviceName: string
}
