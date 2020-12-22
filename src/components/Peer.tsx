import { Button, Card, CardBody } from '@windmill/react-ui'
import React, { useEffect, useState } from 'react'
import * as taco from '@localfirst/auth'
import { Avatar } from './Avatar'
import { CardLabel } from './CardLabel'
import { ConnectionToggle } from './ConnectionToggle'
import { DeviceInfo } from '../devices'
import { Invite } from './Invite'
import { randomTeamName } from '../util/randomTeamName'
import { RemoveButton } from './RemoveButton'
import { TeamProvider } from './TeamContext'
import { UserInfo, users } from '../users'
import { assert } from '../util/assert'

export const Peer = ({ id, user, device, onRemove }: PeerProps) => {
  const context = {
    user: taco.createUser({
      userName: user.name,
      deviceName: device.name,
      deviceType: device.name === 'laptop' ? 1 : 2, // TODO: use constants
    }),
  }
  const newTeam = () => taco.createTeam(randomTeamName(), context)

  const AUTO_CREATE_ALICE_TEAM = true
  const initialTeam =
    AUTO_CREATE_ALICE_TEAM && isAlice(user, device) //
      ? newTeam()
      : undefined

  const [team, setTeam] = useState(initialTeam)
  const [members, setMembers] = useState(team?.members())

  const createTeam = () => setTeam(newTeam())

  const joinTeam = () => {}

  useEffect(() => {
    if (team) {
      setMembers(team.members())
      team.on('updated', () => {
        console.log('team updated')
        setMembers(team.members())
      })
      return () => {
        team.removeAllListeners
      }
    }
  }, [team])

  // TODO: can't have nested groups, so need to do custom css for group-hover
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

      {team ? <PeerWithTeam /> : <PeerWithoutTeam />}
    </Card>
  )

  function PeerWithoutTeam() {
    return (
      <div className="flex">
        <CardBody className="border-r">
          <p>Starting something new?</p>
          <p className="py-2">
            <Button className="w-full" onClick={createTeam}>
              Create team
            </Button>
          </p>
        </CardBody>

        <CardBody>
          <p>Have an invitation?</p>
          <p className="py-2">
            <Button className="w-full" onClick={joinTeam}>
              Join team
            </Button>
          </p>
        </CardBody>
      </div>
    )
  }

  function PeerWithTeam() {
    assert(team)
    return (
      <TeamProvider value={team}>
        <CardBody>
          <CardLabel>Team</CardLabel>
          <p className="">{team.teamName}</p>

          <table className="w-full border-collapse text-sm my-3">
            <tbody>
              {members?.map(m => {
                console.log('rendering team members')
                return (
                  <React.Fragment key={m.userName}>
                    <tr className="border-t border-b group">
                      <td>{team.memberIsAdmin(m.userName) ? '👑' : ''}</td>
                      <td>
                        {users[m.userName].emoji} {m.userName}
                      </td>
                      <td>
                        <div className="flex items-center">
                          <span className="mr-2">💻</span>
                          <ConnectionToggle></ConnectionToggle>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <span className="mr-2">📱</span>
                          <ConnectionToggle disabled></ConnectionToggle>
                        </div>
                      </td>
                      <td>
                        <button
                          title="Remove member from team"
                          className="group-hover group-hover:opacity-100 opacity-0 font-bold"
                          children="❌"
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
          <Invite></Invite>
        </CardBody>
      </TeamProvider>
    )
  }
}

interface PeerProps {
  user: UserInfo
  device: DeviceInfo
  id: string
  onRemove: (id: string) => void
}

const isAlice = (user: UserInfo, device: DeviceInfo) =>
  user.name === 'Alice' && device.name === 'laptop'
