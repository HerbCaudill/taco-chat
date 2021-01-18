import * as auth from '@localfirst/auth'
import { Connection } from '@localfirst/auth'
import { Card, CardBody } from '@windmill/react-ui'
import cuid from 'cuid'
import debug from 'debug'
import React, { useEffect, useState } from 'react'
import { ConnectionManager } from '../ConnectionManager'
import { PeerInfo } from '../peers'
import { randomTeamName } from '../util/randomTeamName'
import { AlertInfo, Alerts } from './Alerts'
import { Avatar } from './Avatar'
import { CreateOrJoinTeam } from './CreateOrJoinTeam'
import { Team } from './Team'
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

  const log = debug(`lf:tc:Peer:${user.userName}`)

  const [alerts, setAlerts] = useState([] as AlertInfo[])
  const [team, setTeam] = useState<auth.Team | undefined>()
  const [connections, setConnections] = useState<Record<string, string>>({})

  const addAlert = (message: string, type: AlertInfo['type'] = 'info') => {
    const alert = { id: cuid(), message, type }
    setAlerts(alerts => [...alerts, alert])
  }

  const clearAlert = (id: string) => {
    setAlerts(alerts => alerts.filter(alert => alert.id !== id))
  }

  const createTeam = () => {
    log('creating team')
    const team = auth.createTeam(randomTeamName(), { user })
    setTeam(team)

    const { teamName } = team
    const context = { user, team }
    connect(teamName, context)
  }

  const joinTeam = (teamName: string, invitationSeed: string) => {
    log('joining team')
    const context = { user, invitationSeed }
    connect(teamName, context)
  }

  const connect = (teamName: string, context: auth.InitialContext) => {
    new ConnectionManager({ teamName, urls, context })
      .on('change', state => setConnections(state))

      .once('connected', (connection: Connection) => {
        setTeam(connection.team)
      })

      .on('disconnected', event => {
        if (event.type === 'ERROR') {
          const { message } = event.payload
          addAlert(message)
        }
      })
  }

  // set up Alice on first load
  useEffect(() => {
    const AUTO_CREATE_ALICE_TEAM = true
    if (AUTO_CREATE_ALICE_TEAM && isAlice(peer)) createTeam()
  }, [])

  // TODO: can't have nested tailwindcss groups, so need to do custom css for group-hover
  return (
    <ErrorBoundary>
      <Card className="Peer group max-w-sm flex-1 bg-white shadow-md relative">
        <RemoveButton onClick={() => onRemove(peer.id)}></RemoveButton>

        <CardBody className="Header flex items-center bg-teal-500">
          <Avatar size="lg" className="bg-opacity-75">
            {peer.user.emoji}
          </Avatar>
          <h1 className="text-white text-2xl font-extrabold flex-grow">{peer.user.name}</h1>
          <Avatar size="sm">{peer.device.emoji}</Avatar>
        </CardBody>

        <Alerts alerts={alerts} clearAlert={clearAlert} />

        {team ? (
          <Team user={user} device={peer.device} team={team} connections={connections} />
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
