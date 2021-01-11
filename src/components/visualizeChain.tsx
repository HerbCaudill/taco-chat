import { isMergeLink, isRootLink, TeamLink, TeamSignatureChain } from '@localfirst/auth'
import Mermaid from 'react-mermaid2'
import { theme } from '../mermaid.theme'
import { users } from '../users'

const LINE_BREAK = '\n'

export const visualizeChain = (chain: TeamSignatureChain) => {
  const chartHeader = [
    `graph TD`,
    `classDef merge fill:#fc3,font-weight:bold,stroke-width:3px,text-align:center`,
  ]

  const chartNodes = Object.keys(chain.links).map(hash => {
    const link = chain.links[hash]
    const id = idFromHash(hash)
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
      <pre className="text-xs">{JSON.stringify(chain, null, 2)}</pre>
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

const idFromHash = (s: string) => s.replace(/^[A-Za-z0-9]/g, '').slice(0, 5)

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
    return link.body.map(hash => `${idFromHash(hash)} --> ${idFromHash(link.hash)}`)
  } else {
    return `${idFromHash(link.body.prev)} --> ${idFromHash(link.hash)}`
  }
}
