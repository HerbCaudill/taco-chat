import { Card, CardBody } from '@windmill/react-ui'
import React from 'react'
import { DeviceInfo } from './devices'
import { UserInfo } from './users'
import classNames from 'classnames'

export const Peer = ({ id, user, device, onRemove }: PeerProps) => (
  <Card className="group max-w-sm flex-1 bg-white shadow-md relative">
    <RemoveButton onClick={() => onRemove(id)}></RemoveButton>
    <CardBody className="flex items-center bg-teal-500 leading-none">
      <Avatar size="lg">{user.emoji}</Avatar>
      <h1 className="text-white text-2xl font-extrabold flex-grow">{user.name}</h1>
      <Avatar size="sm">{device.emoji}</Avatar>
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

const RemoveButton = ({ onClick }: RemoveButtonProps) => (
  <div className="opacity-0 group-hover:opacity-100">
    <button
      className="absolute top-0 right-0 p-1 m-2 leading-none opacity-25 rounded-full 
        text-white text-xs
        hover:opacity-75 
        focus:opacity-100 focus:outline-none focus:shadow-outline-neutral "
      onClick={onClick}
    >
      🗙
    </button>
  </div>
)
interface RemoveButtonProps {
  onClick: () => void
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(function Avatar(props, ref) {
  const { size = 'md', className, children } = props
  const sizeStyles = {
    lg: 'w-12 h-12 text-2xl',
    md: 'w-10 h-10 text-lg',
    sm: 'w-8 h-8 text-md',
  }
  const baseStyle = 'rounded-full border border-white bg-white bg-opacity-50 mr-3 flex items-center'
  const cls = classNames(baseStyle, sizeStyles[size], className)
  return (
    <div className={cls}>
      <div className="align-middle text-center w-full">{children}</div>
    </div>
  )
})
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'lg' | 'md' | 'sm'
}
