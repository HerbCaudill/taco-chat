import * as React from 'react'
import * as taco from 'taco-js'

const TeamContext = React.createContext<TeamContextPayload>(undefined)

export const useTeam = () => {
  const context = React.useContext(TeamContext)
  if (!context) throw new Error(`useTeam must be used within a TeamProvider`)
  const [team, setTeam] = context
  return { team, setTeam }
}

export const TeamProvider: React.FC<{ value: taco.Team }> = props => {
  const { value, ...otherProps } = props
  const [team, setTeam] = React.useState<taco.Team>(value)
  const contextValue = React.useMemo(() => [team, setTeam] as TeamContextPayload, [team])
  return <TeamContext.Provider {...otherProps} value={contextValue} />
}

type TeamContextPayload = [taco.Team, React.Dispatch<React.SetStateAction<taco.Team>>] | undefined
