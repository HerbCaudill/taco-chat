import ClipboardJS from 'clipboard'
import { Button, Select } from '@windmill/react-ui'
import { UserInfo, users } from '../users'
import { useTeam } from './TeamContext'

import { FC, useRef, useState, useEffect } from 'react'

/*
TODO implement different levels of invitation security

From most secure to least secure:

- named invitation with unique secret code

- named invitation with shared secret code

- anyone who has shared secret code can join
- named invitation, no secret code

- anyone who knows team name can join
nnec
*/
export const Invite: FC = () => {
  type State = 'inactive' | 'requestingName' | 'done'

  const [state, setState] = useState<State>('inactive')
  const [seed, setSeed] = useState<string>()
  const [userName, setUserName] = useState<string>()

  const { team } = useTeam()

  const select = useRef() as React.MutableRefObject<HTMLSelectElement>
  const copyInvitationSeed = useRef() as React.MutableRefObject<HTMLButtonElement>

  useEffect(() => {
    if (copyInvitationSeed?.current && seed) new ClipboardJS(copyInvitationSeed.current)
  }, [copyInvitationSeed, seed])

  const activate = () => {
    setState('requestingName')
  }

  const done = () => {
    setState('inactive')
  }

  const invite = () => {
    const userName = select.current.value
    setUserName(userName)

    const invitationSeed = `${team.teamName}-${randomSeed()}`
    setSeed(invitationSeed)

    // TODO store id so we can revoke the invitation
    const { id } = team.invite(userName, { invitationSeed })

    setState('done')
  }

  switch (state) {
    case 'inactive':
      return (
        <div className="flex gap-2">
          <Button size="small" className="my-2 mr-2" onClick={activate}>
            Invite someone
          </Button>

          {/* TODO: add a device */}
          <Button size="small" className="my-2 mr-2">
            Add a device
          </Button>
        </div>
      )

    case 'requestingName':
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
            {/* Dropdown with names & emoji */}
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
          <pre
            className="my-2 p-3 
              border border-gray-200 rounded-md bg-gray-100 
              text-xs whitespace-pre-wrap"
            children={seed}
          />
          <div className="mt-1 text-right">
            <Button ref={copyInvitationSeed} onClick={done} data-clipboard-text={seed}>
              Copy
            </Button>
          </div>
        </>
      )
  }
}

// TODO: style invited members who haven't joined yet

const randomSeed = () => '0000'.replace(/0/g, () => Math.floor(Math.random() * 10).toString())
