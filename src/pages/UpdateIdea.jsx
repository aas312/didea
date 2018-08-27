import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { UpdateForm } from '../components/UpdateForm'

class UpdateIdea extends Component {
  constructor(props, context) {
    super(props)

    this.contract = context.drizzle.contracts.DIdea
    this.ideaKey = ''
    this.contract = context.drizzle.contracts.DIdea

    this.refreshData = this.refreshData.bind(this)
  }

  componentDidMount() {
    this.refreshData()
  }

  componentDidUpdate() {
    this.refreshData()
  }

  refreshData() {
    const index = parseInt(this.props.match.params.index)
    const ideaKey = this.contract.methods.ideas.cacheCall(index)

    if (ideaKey !== this.ideaKey) {
      this.ideaKey = ideaKey
    }
  }

  render() {
    if (!(this.ideaKey in this.props.ideas)) {
      return (<span>Loading</span>)
    }

    const rawIdea = this.props.ideas[this.ideaKey].value

    const idea = {
      index: parseInt(rawIdea.index),
      votes: parseInt(rawIdea.votes),
      state: parseInt(rawIdea.state),
      title: rawIdea.title,
      url: rawIdea.url,
      owner: rawIdea.owner,
    }

    const isNotOwner = (idea.owner.toLowerCase() !== this.props.account.toLowerCase())

    if (idea.state !== 0 || isNotOwner) {
      return(<h1 className="text-center">Not allowed</h1>)
    }

    return (
      <main>
        <h1>Update idea</h1>
        <UpdateForm 
          title={idea.title}
          index={idea.index}
          url={idea.url}
          account={this.props.account}
        />
      </main>
    )
  }
}

UpdateIdea.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => ({
  account: state.account.current,
  ideas: state.contracts.DIdea.ideas,
})

const UpdateIdeaPage = drizzleConnect(UpdateIdea, mapStateToProps)

export { UpdateIdeaPage }
export default UpdateIdeaPage
