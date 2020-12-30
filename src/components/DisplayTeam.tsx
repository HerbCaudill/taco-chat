import * as auth from '@localfirst/auth'
import { CardBody } from '@windmill/react-ui'
import { Fragment, FC, useEffect, useState } from 'react'
import { ConnectionManager } from '../ConnectionManager'
import { users } from '../users'
import { CardLabel } from './CardLabel'
import { ConnectionToggle } from './ConnectionToggle'
import { Invite } from './Invite'
import { TeamProvider } from './TeamContext'

export const DisplayTeam: FC<PeerWithTeamProps> = ({ team }) => {
  const [members, setMembers] = useState(team?.members())

  useEffect(() => {
    setMembers(team.members())
    team.on('updated', () => setMembers(team.members()))
    return () => {
      team.removeAllListeners
    }
  }, [team])

  return (
    <TeamProvider value={team}>
      <CardBody>
        {/* Team name */}
        <CardLabel>Team</CardLabel>
        <p>{team.teamName}</p>

        {/* Members table */}
        <table className="w-full border-collapse text-sm my-3">
          <tbody>
            {/* One row per member */}
            {members?.map(m => {
              return (
                <Fragment key={m.userName}>
                  <tr className="border-t border-b group ">
                    {/* Admin icon, if admin */}
                    <td>{team.memberIsAdmin(m.userName) ? '👑' : ''}</td>

                    {/* Name & emoji */}
                    <td className="p-2">
                      {users[m.userName].emoji} {m.userName}
                    </td>

                    {/* Connection status/toggle: Laptop */}
                    <td>
                      <div className="flex items-center">
                        <span className="mr-2">💻</span>
                        <ConnectionToggle></ConnectionToggle>
                      </div>
                    </td>

                    {/* Connection status/toggle: Phone*/}
                    <td>
                      <div className="flex items-center">
                        <span className="mr-2">📱</span>
                        <ConnectionToggle disabled></ConnectionToggle>
                      </div>
                    </td>

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
        <Invite />
      </CardBody>
    </TeamProvider>
  )
}
interface PeerWithTeamProps {
  team: auth.Team
  user: auth.User
  connectionManager: ConnectionManager
}
