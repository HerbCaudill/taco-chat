import { FC } from 'react'
import { useMermaid } from '../hooks/useMermaid'

export const Mermaid: FC<{ chart: string; config: any }> = ({ chart, config = {} }) => {
  const svg = useMermaid('exampleID', chart, config)
  if (!svg) {
    return <div>...</div>
  } else {
    return <div className="Mermaid" dangerouslySetInnerHTML={{ __html: svg }} />
  }
}
