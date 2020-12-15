import { objects } from 'friendly-words'
import { Button, Select } from '@windmill/react-ui'
import React, { useRef, useState } from 'react'
import { useTeam } from './TeamContext'
import { UserInfo, users } from './users'
import { randomElement } from './randomElement'

export const Invite: React.FC = () => {
  const { team } = useTeam()
  const select = useRef() as React.MutableRefObject<HTMLSelectElement>
  type State = 'inactive' | 'collectingInformation' | 'done'
  const [state, setState] = useState<State>('inactive')
  const [seed, setSeed] = useState<string>()
  const [userName, setUserName] = useState<string>()

  const activate = () => {
    setState('collectingInformation')
  }

  const done = () => {
    setState('inactive')
  }

  const invite = () => {
    const userName = select.current.value
    setUserName(userName)

    const randomSeed = team.teamName + '-' + [objects, objects].map(randomElement).join('-')
    setSeed(randomSeed)

    // TODO store id so we can revoke the invitation
    const { id } = team.invite(userName, { invitationSeed: randomSeed })

    setState('done')
  }

  switch (state) {
    case 'inactive':
      return (
        <div className="flex gap-2">
          <Button size="small" className="my-2 mr-2" onClick={activate}>
            Invite someone
          </Button>
          <Button size="small" className="my-2 mr-2">
            Add a device
          </Button>
        </div>
      )
    case 'collectingInformation':
      const isMember = (user: UserInfo) =>
        team
          .members()
          .map(m => m.userName)
          .includes(user.name)

      const nonMembers = Object.values(users).filter(u => !isMember(u))

      return (
        <>
          <p>Who do you want to invite?</p>
          <div className="flex gap-2">
            <Select ref={select} className="mt-1 w-full">
              {nonMembers.map(u => (
                <option key={u.name} value={u.name}>
                  {u.emoji} {u.name}
                </option>
              ))}
            </Select>
            <Button className="mt-1 w-full" onClick={invite}>
              Invite
            </Button>
          </div>
          <Button size="small" layout="outline" className="mt-1" onClick={done}>
            Cancel
          </Button>
        </>
      )

    case 'done':
      return (
        <>
          <p className="my-2 font-bold">Here's the invite!</p>
          <p className="my-2">Copy this code and send it to {userName}:</p>
          <pre className="my-2 border border-gray-200 rounded-md p-3 bg-gray-100 text-xs whitespace-pre-wrap">
            {seed}
          </pre>
          <div className="text-right">
            <Button className="mt-1" onClick={done}>
              OK
            </Button>
          </div>
        </>
      )
  }
}

// TODO add "copy" button using clipboard.js or something https://clipboardjs.com
// TODO wire up connection
// TODO style invited members who haven't joined yet
