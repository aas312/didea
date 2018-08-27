import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ListItemContainer } from './ListItem'
import { Link } from 'react-router-dom'

class List extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts
    this.web3 = context.drizzle.web3
    this.dataKey = this.contracts.DIdea.methods.ideasCount.cacheCall()

    this.state = {
      count: 0,
      ideas: [],
      account: this.props.account,
    }

    this.refreshData = this.refreshData.bind(this)
  }

  refreshData() {
    const countKey = this.contracts.DIdea.methods.ideasCount.cacheCall()

    if ((countKey in this.props.ideasCount)) {
      const count = parseInt(this.props.ideasCount[countKey].value)

      if (count !== this.state.count || this.state.account.toLowerCase() != this.props.account.toLowerCase()) {
        let ideas = []
        
        for (let i = 0; i < count; i ++) {
          let ideaKey = this.contracts.DIdea.methods.ideas.cacheCall(i)
          let votedKey = this.contracts.DIdea.methods.voted.cacheCall(this.props.account, i)
          ideas.push({ key: ideaKey, votedKey } )
        }

        return this.setState({
          ...this.state,
          count,
          ideas,
          account: this.props.account,
        })
      }
    }
  }

  componentDidMount() {
    this.refreshData()
  }

  componentDidUpdate() {
    this.refreshData()
  }

  render() {
    let ideas = []
    
    for (let i = 0; i < this.state.count; i++) {
      const { key, votedKey } = this.state.ideas[i]

      if (!(key in this.props.ideas)) {
        continue
      }
    
      let idea = {
        index: parseInt(this.props.ideas[key].value.index),
        state: parseInt(this.props.ideas[key].value.state),
        votes: parseInt(this.props.ideas[key].value.votes),
        url: this.props.ideas[key].value.url,
        title: this.props.ideas[key].value.title,
        owner: this.props.ideas[key].value.owner,
        voted: true,
      }
    
      if ((votedKey in this.props.voted)) {
        idea.voted = this.props.voted[votedKey].value
      }

      ideas.push(idea)
    }

    ideas = ideas.filter(idea => {
      const belongsToOwner = (idea.owner.toLowerCase() === this.props.account.toLowerCase()) 
      const isVoted = idea.voted
      const hasState = this.props.onlyInState.includes(idea.state)

      if (this.props.onlyOwner && !belongsToOwner) {
        return false
      }

      if (this.props.onlyVoted && !isVoted) {
        return false
      }

      return hasState
    })

    if (ideas.length === 0) {
      return (
        <main>
          <h3>No ideas</h3>
          <Link to="/create">Submit one!</Link>
        </main>
      )
    }

    ideas = ideas.sort((a, b) => b.votes - a.votes)

    return (
      <main>
        {ideas.map(idea =>
          <ListItemContainer
            key={idea.index}
            index={idea.index}
            votes={idea.votes}
            owner={idea.owner}
            state={idea.state}
            url={idea.url}
            title={idea.title}
            voted={idea.voted}
            account={this.props.account}
          />
        )}
      </main>
    )
  }
}

List.contextTypes = {
  drizzle: PropTypes.object,
}

List.propTypes = {
  onlyOwner: PropTypes.bool,
  onlyInState: PropTypes.array,
  onlyVoted: PropTypes.bool,
}

List.defaultProps = {
  onlyOwner: false,
  onlyInState: [0, 1, 2],
  onlyVoted: false,
}

export { List }
