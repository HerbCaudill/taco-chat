import * as auth from '@localfirst/auth'
import { Button, CardBody } from '@windmill/react-ui'
import { Fragment, FC, useEffect, useState } from 'react'
import { users } from '../users'
import { CardLabel } from './CardLabel'
import { Invite } from './Invite'
import { TeamProvider } from './TeamContext'
import { ChainDiagram } from './ChainDiagram'
import { DeviceInfo } from '../devices'
import debug from 'debug'

export const Team: FC<TeamProps> = ({ team, user, connections }) => {
  const [members, setMembers] = useState(team?.members())
  const log = debug(`lf:tc:Team:${user.userName}`)

  useEffect(() => {
    log('(useEffect) wiring up team change handler')
    setMembers(team.members())
    team.on('updated', () => setMembers(team.members()))
    return () => {
      team.removeAllListeners()
    }
  }, [team])

  const adminCount = () => members.filter(m => team.memberIsAdmin(m.userName)).length

  return (
    <TeamProvider value={team}>
      <CardBody className="Team">
        {/* Team name */}
        <CardLabel>Team</CardLabel>
        <p className="TeamName">{team.teamName}</p>

        {/* Members table */}
        <table className="MemberTable w-full border-collapse text-sm my-3">
          <tbody>
            {/* One row per member */}
            {members?.map(m => {
              const isAdmin = team.memberIsAdmin(m.userName)
              const status = connections[m.userName]
              return (
                <Fragment key={m.userName}>
                  <tr className="border-t border-b border-gray-200 group">
                    {/* Admin icon, if admin */}
                    <td className="w-2">
                      <Button
                        layout="link"
                        size="small"
                        disabled={isAdmin && adminCount() === 1}
                        onClick={() => {
                          if (isAdmin) team.removeMemberRole(m.userName, auth.ADMIN)
                          else team.addMemberRole(m.userName, auth.ADMIN)
                        }}
                        title={
                          isAdmin
                            ? adminCount() === 1
                              ? `Can't remove the only admin`
                              : 'Team admin (click to remove)'
                            : 'Click to make team admin'
                        }
                        className={`px-1 m-1 hover:opacity-25 ${
                          isAdmin ? 'opacity-100' : 'opacity-0 '
                        }`}
                        children="👑"
                      />
                    </td>

                    {/* Name & emoji */}
                    <td className="p-2">
                      {users[m.userName].emoji} <span className="UserName">{m.userName}</span>
                    </td>

                    {/* Connection status: Laptop */}
                    <td title={status}>
                      {m.userName === user.userName ? null : (
                        <div className="flex items-center">
                          <span className="mr-2">💻</span>
                          <span className={`h-3 w-3 rounded-full ${statusIndicatorCx(status)}`} />
                        </div>
                      )}
                    </td>

                    {/* Remove button */}
                    <td>
                      {team.memberIsAdmin(user.userName) ? (
                        <button
                          title="Remove member from team"
                          className="group-hover group-hover:opacity-100 opacity-0 font-bold"
                          children="❌"
                        />
                      ) : null}
                    </td>
                  </tr>
                </Fragment>
              )
            })}
          </tbody>
        </table>

        {/* Invitation UI */}
        {team.memberIsAdmin(user.userName) ? <Invite /> : null}
      </CardBody>

      {/* Chain visualization */}
      <CardBody className="border-t">
        <CardLabel>Signature chain</CardLabel>
        <ChainDiagram chain={team.chain} id={user.userName} />
      </CardBody>
    </TeamProvider>
  )
}

interface TeamProps {
  team: auth.Team
  user: auth.User
  device: DeviceInfo
  connections: Record<string, string>
}

const statusIndicatorCx = (status: string = '') => {
  status = status.split(':')[0]
  switch (status) {
    case 'idle':
    case 'disconnected':
      return 'bg-gray-300'
    case 'connecting':
      return 'yellow-300'
    case 'connected':
      return 'bg-green-500'
    case 'synchronizing':
      return 'bg-green-500 animate-ping'
  }
}
