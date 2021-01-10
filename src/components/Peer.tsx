import * as auth from '@localfirst/auth'
import { Connection } from '@localfirst/auth'
import { Card, CardBody } from '@windmill/react-ui'
import cuid from 'cuid'
import React, { useEffect, useState } from 'react'
import { ConnectionManager } from '../ConnectionManager'
import { PeerInfo } from '../peers'
import { randomTeamName } from '../util/randomTeamName'
import { AlertInfo, Alerts } from './Alerts'
import { Avatar } from './Avatar'
import { CreateOrJoinTeam } from './CreateOrJoinTeam'
import { DisplayTeam } from './DisplayTeam'
import { ErrorBoundary } from './ErrorBoundary'
import { RemoveButton } from './RemoveButton'

// TODO: make this an environment var
const urls = ['ws://localhost:8080']

export const Peer = ({ peer, onRemove }: PeerProps) => {
  const [user] = useState(() =>
    auth.createUser({
      userName: peer.user.name,
      deviceName: peer.device.name,
      deviceType: peer.device.name === 'laptop' ? 1 : 2, // TODO: use constants
    })
  )

  const newTeam = () => auth.createTeam(randomTeamName(), { user })

  const [alerts, setAlerts] = useState([] as AlertInfo[])
  const [team, setTeam] = useState<auth.Team | undefined>()
  const [connectionManager, setConnectionManager] = useState<ConnectionManager | undefined>()

  const addAlert = (message: string, type: AlertInfo['type'] = 'info') => {
    const alert = { id: cuid(), message, type }
    setAlerts(alerts => [...alerts, alert])
  }

  const clearAlert = (id: string) => {
    setAlerts(alerts => alerts.filter(alert => alert.id !== id))
  }

  const createTeam = () => {
    const team = newTeam()
    setTeam(team)

    const { teamName } = team
    const context = { user, team }
    setConnectionManager(new ConnectionManager({ teamName, urls, context }))
  }

  const joinTeam = (teamName: string, invitationSeed: string) => {
    const context = { user, invitationSeed }
    const connectionManager = new ConnectionManager({ teamName, urls, context })

    connectionManager.once('connected', (connection: Connection) => {
      setTeam(connection.team)
    })

    connectionManager.on('disconnected', event => {
      if (event.type === 'ERROR') {
        const { message } = event.payload
        addAlert(message)
      }
      // console.warn('disconnected', event)
    })

    setConnectionManager(connectionManager)
  }

  // set up Alice on first load
  useEffect(() => {
    const AUTO_CREATE_ALICE_TEAM = true
    if (AUTO_CREATE_ALICE_TEAM && isAlice(peer)) createTeam()
    // addAlert('This is a test')
  }, [])

  // TODO: can't have nested tailwindcss groups, so need to do custom css for group-hover
  return (
    <ErrorBoundary>
      <Card className="group max-w-sm flex-1 bg-white shadow-md relative">
        <RemoveButton onClick={() => onRemove(peer.id)}></RemoveButton>

        <CardBody className="flex items-center bg-teal-500">
          <Avatar size="lg" className="bg-opacity-75">
            {peer.user.emoji}
          </Avatar>
          <h1 className="text-white text-2xl font-extrabold flex-grow">{peer.user.name}</h1>
          <Avatar size="sm">{peer.device.emoji}</Avatar>
        </CardBody>

        <Alerts alerts={alerts} clearAlert={clearAlert} />

        {team ? (
          <DisplayTeam user={user} team={team} connectionManager={connectionManager!} />
        ) : (
          <CreateOrJoinTeam user={user} createTeam={createTeam} joinTeam={joinTeam} />
        )}
      </Card>
    </ErrorBoundary>
  )
}

interface PeerProps {
  peer: PeerInfo
  onRemove: (id: string) => void
}

const isAlice = (peer: PeerInfo) => peer.user.name === 'Alice' && peer.device.name === 'laptop'
