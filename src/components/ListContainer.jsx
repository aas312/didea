import { List } from './List'
import { drizzleConnect } from 'drizzle-react'

const mapStateToProps = state => {
  return {
    account: state.account.current,
    ideasCount: state.contracts.DIdea.ideasCount,
    ideas: state.contracts.DIdea.ideas,
    voted: state.contracts.DIdea.voted,
    contract: state.contracts.DIdea,
  }
}

const ListContainer = drizzleConnect(List, mapStateToProps)

export { ListContainer }
