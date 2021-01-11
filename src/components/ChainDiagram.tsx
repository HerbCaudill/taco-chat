import { isMergeLink, isRootLink, TeamLink, TeamSignatureChain } from '@localfirst/auth'
import { FC } from 'react'
import { theme } from '../mermaid.theme'
import { users } from '../users'
import { Mermaid } from './Mermaid'

const LINE_BREAK = '\n'

export const ChainDiagram: FC<{ chain: TeamSignatureChain }> = ({ chain }) => {
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

  const chartLines = chartHeader.concat(chartNodes).concat(chartEdges)

  const chart = chartLines.join(LINE_BREAK)
  return (
    <div>
      <div>
        <Mermaid config={theme} chart={chart} />
      </div>
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
    return replaceNamesWithEmoji(`("<span class='author'>${author}</span><b>${type}</b><br/> ")`)
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
