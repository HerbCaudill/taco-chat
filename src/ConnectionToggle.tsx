import React from 'react'
import { useState } from 'react'
import { Toggle } from './Toggle'

export const ConnectionToggle: React.FC<ConnectionToggleProps> = ({ disabled = false }) => {
  const [isConnected, setIsConnected] = useState(false)
  const onConnectionToggle = () => {
    setIsConnected(v => !v)
  }
  return <Toggle on={isConnected} disabled={disabled} onClick={onConnectionToggle}></Toggle>
}
interface ConnectionToggleProps {
  disabled?: boolean
}
