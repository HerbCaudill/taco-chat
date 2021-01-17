import * as auth from '@localfirst/auth'
import { Button, CardBody } from '@windmill/react-ui'
import { Fragment, FC, useEffect, useState } from 'react'
import { ConnectionManager } from '../ConnectionManager'
import { users } from '../users'
import { CardLabel } from './CardLabel'
import { ConnectionToggle } from './ConnectionToggle'
import { Invite } from './Invite'
import { TeamProvider } from './TeamContext'
import { ChainDiagram } from './ChainDiagram'
import { DeviceInfo } from '../devices'
import debug from 'debug'

export const DisplayTeam: FC<PeerWithTeamProps> = ({ team, user, connections }) => {
  const [members, setMembers] = useState(team?.members())
  const log = debug(`lf:tc:DisplayTeam:${user.userName}`)

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
      <CardBody className="DisplayTeam">
        {/* Team name */}
        <CardLabel>Team</CardLabel>
        <p className="TeamName">{team.teamName}</p>

        {/* <pre
          className="my-2 p-3 
              border border-gray-200 rounded-md bg-gray-100 
              text-xs whitespace-pre-wrap"
        >
          {JSON.stringify(connections, null, 2)}
        </pre> */}

        {/* Members table */}
        <table className="MemberTable w-full border-collapse text-sm my-3">
          <tbody>
            {/* One row per member */}
            {members?.map(m => {
              const isAdmin = team.memberIsAdmin(m.userName)
              return (
                <Fragment key={m.userName}>
                  <tr className="border-t border-b group ">
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

                    <td>{connections[m.userName]}</td>

                    {/* Connection status/toggle: Laptop */}
                    <td>
                      <div className="flex items-center">
                        {/* <span className="mr-2">💻</span> */}
                        <ConnectionToggle></ConnectionToggle>
                      </div>
                    </td>
                    {/* Connection status/toggle: Phone*/}
                    {/*
                     */}

                    {/* Remove button */}
                    <td>
                      <button
                        title="Remove member from team"
                        className="group-hover group-hover:opacity-100 opacity-0 font-bold"
                        children="❌"
                      />
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
interface PeerWithTeamProps {
  team: auth.Team
  user: auth.User
  device: DeviceInfo
  connections: Record<string, string>
}
