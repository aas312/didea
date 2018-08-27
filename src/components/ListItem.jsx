import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { drizzleConnect } from 'drizzle-react'
import { Button, ButtonToolbar, Panel } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { IPFSMarkdown } from './IPFSMarkdown'

class ListItem extends Component {
  constructor(props, context) {
    super(props)
    this.contract = context.drizzle.contracts.DIdea
    this.web3 = context.drizzle.web3
    this.states = [
      'Created',
      'Published',
      'Abandoned',
    ]

    this.handlePublish = this.handlePublish.bind(this)
    this.handleAbandon = this.handleAbandon.bind(this)
    this.handleVote = this.handleVote.bind(this)
    this.handleRemoveVote = this.handleRemoveVote.bind(this)
  }

  handlePublish() {
    this.contract.methods.publishIdea.cacheSend(this.props.index, { from: this.props.account })
  }

  handleAbandon() {
    this.contract.methods.abandonIdea.cacheSend(this.props.index, { from: this.props.account })
  }

  handleVote() {
    const stake = this.web3.utils.toWei("0.05", "ether")
    this.contract.methods.addVote.cacheSend(this.props.index, { value: stake, from: this.props.account })
  }

  handleRemoveVote() {
    const gasLimit = "100000"
    this.contract.methods.removeVote.cacheSend(this.props.index, { from: this.props.account, gasLimit })
  }

  render() {
    const isOwner = (this.props.account.toLowerCase() === this.props.owner.toLowerCase())
    const { voted } = this.props
    const buttons = []

    if (this.props.state === 1 && !isOwner && !voted) {
      buttons.push(<Button key={0} bsSize="small" onClick={this.handleVote}>Vote</Button>)
    }

    if (this.props.state === 1 && !isOwner && voted) {
      buttons.push(<Button key={1} bsSize="small" onClick={this.handleRemoveVote}>Remove Vote</Button>)
    }

    if (this.props.state === 0 && isOwner) {
      buttons.push(<Button key={3} bsSize="small" onClick={this.handlePublish}>Publish</Button>)
    }

    if ((this.props.state in [0, 1]) && isOwner) {
      buttons.push(<Button key={4} bsSize="small" onClick={this.handleAbandon}>Abandon</Button>)
    }

    return (
      <Panel>
        <Panel.Body>
          <h2><Link to={`/ideas/${this.props.index}`}>{this.props.title}</Link></h2>
          {this.props.state === 0 ? (<Link to={`/edit/${this.props.index}`}>Edit</Link>) : null}
          <ul>
            <li><strong>Index</strong>: {this.props.index}</li>
            <li><strong>Owner</strong>: {this.props.owner}</li>
            <li><strong>Status</strong>: {this.states[this.props.state]}</li>
            <li><strong>Votes</strong>: {this.props.votes}</li>
          </ul>
          {this.props.loadURL ? (
            <IPFSMarkdown url={this.props.url} />
          ) : null
          }
        </Panel.Body>
        <Panel.Footer>
          <ButtonToolbar>
            {buttons}
          </ButtonToolbar>
        </Panel.Footer>
      </Panel>
    )
  }
}

ListItem.contextTypes = {
  drizzle: PropTypes.object,
}

ListItem.propTypes = {
  index: PropTypes.number.isRequired,
  account: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  votes: PropTypes.number.isRequired,
  state: PropTypes.number.isRequired,
  owner: PropTypes.string.isRequired,
  voted: PropTypes.bool.isRequired,
  loadURL: PropTypes.bool,
}

ListItem.defaultProps = {
  loadURL: false,
}

const mapStateToProps = state => ({
  contract: state.contracts.DIdea,
})

const ListItemContainer = drizzleConnect(ListItem, mapStateToProps)

export { ListItemContainer }
