import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import { Grid, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { ListItemContainer } from '../components/ListItem'

class Idea extends Component {
  constructor(props, context) {
    super(props)
    this.contract = context.drizzle.contracts.DIdea
    this.ideaKey = null
    this.votedKey = null

    this.refreshKey = this.refreshKey.bind(this)
  }

  componentDidMount() {
    this.refreshKey()
  }

  componentDidUpdate() {
    this.refreshKey()
  }

  refreshKey() {
    const index = parseInt(this.props.match.params.index)
    const ideaKey = this.contract.methods.ideas.cacheCall(index)
    const votedKey = this.contract.methods.voted.cacheCall(this.props.account, index)

    if (ideaKey !== this.ideaKey) {
      this.ideaKey = ideaKey
    }

    if (votedKey !== this.votedKey) {
      this.votedKey = votedKey
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
      url: rawIdea.url,
      owner: rawIdea.owner,
      title: rawIdea.title,
      voted: false,
    }

    if ((this.votedKey in this.props.voted)) {
      idea.voted = this.props.voted[this.votedKey].value
    }

    return (
      <main>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1>Idea #{idea.index}</h1>
            </Col>
          </Row>
        </Grid>
        <Grid>
          <Row>
            <Col xs={12}>
              <ListItemContainer
                index={idea.index}
                account={this.props.account}
                state={idea.state}
                votes={idea.votes}
                voted={idea.voted}
                title={idea.title}
                owner={idea.owner}
                url={idea.url}
                loadURL
                >
              </ListItemContainer>
            </Col>
          </Row>
        </Grid>
      </main>
    )
  }
}

Idea.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => ({
  ideas: state.contracts.DIdea.ideas,
  voted: state.contracts.DIdea.voted,
  account: state.account.current,
})

const IdeaPage = drizzleConnect(Idea, mapStateToProps)

export { IdeaPage }
export default IdeaPage
