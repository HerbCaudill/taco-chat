import { Button, Card, CardBody } from '@windmill/react-ui'
import React from 'react'
import { DeviceInfo } from './devices'
import { UserInfo } from './users'
import { RemoveButton } from './RemoveButton'
import { Avatar } from './Avatar'

export const Peer = ({ id, user, device, onRemove }: PeerProps) => {
  const createTeam = () => {}
  const joinTeam = () => {}
  return (
    <Card className="group max-w-sm flex-1 bg-white shadow-md relative">
      <RemoveButton onClick={() => onRemove(id)}></RemoveButton>

      <CardBody className="flex items-center bg-teal-500">
        <Avatar size="lg" className="bg-opacity-75">
          {user.emoji}
        </Avatar>
        <h1 className="text-white text-2xl font-extrabold flex-grow">{user.name}</h1>
        <Avatar size="sm">{device.emoji}</Avatar>
      </CardBody>

      <CardBody className="border-b">
        <p>Starting something new?</p>
        <p className="text-right">
          <Button onClick={createTeam}>Create team</Button>
        </p>
      </CardBody>

      <CardBody>
        <p>Have an invitation?</p>
        <p className="text-right">
          <Button onClick={joinTeam}>Join team</Button>
        </p>
      </CardBody>
    </Card>
  )
}

interface PeerProps {
  user: UserInfo
  device: DeviceInfo
  id: string
  onRemove: (id: string) => void
}
