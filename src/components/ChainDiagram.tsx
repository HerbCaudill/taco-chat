import {
  isMergeLink,
  isRootLink,
  LinkBody,
  RootAction,
  TeamAction,
  TeamActionLink,
  TeamLink,
  TeamSignatureChain,
} from '@localfirst/auth'
import { FC } from 'react'
import { theme } from '../mermaid.theme'
import { users } from '../users'
import { Mermaid } from './Mermaid'

const LINE_BREAK = '\n'

export const ChainDiagram: FC<{ chain: TeamSignatureChain; id: string }> = ({ chain, id }) => {
  const chartHeader = [
    `graph TD`,
    `classDef merge fill:#fc3,font-weight:bold,stroke-width:3px,text-align:center`,
  ]

  const chartNodes = Object.keys(chain.links).map(hash => {
    const link = chain.links[hash]
    const id = getId(hash)
    return `${id}${mermaidNodeFromLink(link)}`
  })

  const chartEdges = Object.keys(chain.links).flatMap(hash => {
    const link = chain.links[hash]
    return mermaidEdgeFromLink(link)
  })

  const chart = chartHeader.concat(chartNodes).concat(chartEdges).join(LINE_BREAK)

  return (
    <div className="ChainDiagram">
      <Mermaid config={theme} chart={chart} id={id} />
    </div>
  )
}

const replaceNamesWithEmoji = (s: string) => {
  for (const userName in users) {
    const { emoji } = users[userName]
    const rx = new RegExp(userName, 'gi')
    s = s.replace(rx, emoji)
  }
  return s
}

const getId = (s: string) => s.replace(/^[A-Za-z0-9]/g, '').slice(0, 5)

const mermaidNodeFromLink = (link: TeamLink) => {
  if (isMergeLink(link)) {
    return `{" "}:::merge`
  } else {
    const author = link.signed.userName

    const type = link.body.type
    return replaceNamesWithEmoji(
      `("<span class='author'>${author}</span><b>${type}</b><br/>${truncateHashes(
        actionSummary(link.body)
      )} ")`
    )
  }
}

const mermaidEdgeFromLink = (link: TeamLink) => {
  if (isRootLink(link)) {
    return ''
  } else if (isMergeLink(link)) {
    return link.body.map(hash => `${getId(hash)} --> ${getId(link.hash)}`)
  } else {
    return `${getId(link.body.prev)} --> ${getId(link.hash)}`
  }
}

const actionSummary = (action: LinkBody<TeamAction>) => {
  switch (action.type) {
    case 'ADD_MEMBER':
      return action.payload.member.userName
    case 'REMOVE_MEMBER':
      return action.payload.userName
    case 'ADD_ROLE':
      return action.payload.roleName
    case 'ADD_MEMBER_ROLE':
      return `${action.payload.userName} ${action.payload.roleName}`
    case 'REMOVE_MEMBER_ROLE':
      return `${action.payload.userName} ${action.payload.roleName}`
    case 'ADD_DEVICE':
      return action.payload.device.deviceId
    case 'REMOVE_DEVICE':
      return action.payload.deviceId
    case 'INVITE':
      return action.payload.invitation.id
    case 'REVOKE_INVITATION':
      return action.payload.id
    case 'ADMIT':
      return `${action.payload.userName} (${action.payload.id})`
    case 'CHANGE_MEMBER_KEYS':
    case 'CHANGE_DEVICE_KEYS':
      return action.payload.keys.name
    // return '' //JSON.stringify(action.payload.keys)
    default:
      return ''
  }
}

const truncateHashes = (s: string) => s.replace(hashRx, s => s.slice(0, 5))
const hashRx = /(?:[A-Za-z0-9+/=]{12,100})?/gm
