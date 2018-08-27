import React, { Component } from 'react'
import { ListContainer } from '../components/ListContainer'

class HomePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stateFilter: [1],
    }

  }

  render() {
    return (
      <main>
        <h1>Ideas</h1>
        <ListContainer onlyInState={this.state.stateFilter}/>
      </main>
    )
  }
}

export { HomePage }
export default HomePage
