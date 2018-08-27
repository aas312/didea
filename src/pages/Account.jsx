import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { Reimburse } from '../components/Reimburse'
import { Grid, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

class Account extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts
    this.state = {
      claimVoteKey: '',
      claimIdeaKey: '',
    }

    this.refreshData = this.refreshData.bind(this)
    this.handleIdeaReimburse = this.handleIdeaReimburse.bind(this)
    this.handleVoteReimburse = this.handleVoteReimburse.bind(this)
  }

  componentDidMount() {
    this.refreshData()
  }

  componentDidUpdate() {
    this.refreshData()
  }

  refreshData() {
    const claimVoteKey = this.contracts.DIdea.methods.votesToReimburse.cacheCall(this.props.account)
    const claimIdeaKey = this.contracts.DIdea.methods.ideasToReimburse.cacheCall(this.props.account)

    if (claimVoteKey != this.state.claimVoteKey) {
      return this.setState({
        ...this.state,
        claimVoteKey,
      })
    }

    if (claimIdeaKey != this.state.claimIdeaKey) {
      return this.setState({
        ...this.state,
        claimIdeaKey,
      })
    }
  }

  handleVoteReimburse() {
    const gasLimit = "70000"
    return this.contracts.DIdea.methods.claimVoteStake.cacheSend({ from: this.props.account, gasLimit })
  }

  handleIdeaReimburse() {
    const gasLimit = "40000"
    return this.contracts.DIdea.methods.claimIdeaStake.cacheSend({ from: this.props.account, gasLimit })
  }

  render() {
    let votesToReimburse = 0
    let ideasToReimburse = 0

    if ((this.state.claimVoteKey in this.props.contract.votesToReimburse)) {
      votesToReimburse = parseInt(this.props.contract.votesToReimburse[this.state.claimVoteKey].value)
    }

    if ((this.state.claimIdeaKey in this.props.contract.ideasToReimburse)) {
      ideasToReimburse = parseInt(this.props.contract.ideasToReimburse[this.state.claimIdeaKey].value)
    }

    return (
      <main>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1>My Account</h1>
              <h4>{this.props.account}</h4>
            </Col>
          </Row>
        </Grid>
        <Grid>
          <Row>
            <Col xs={12}>
              <ul>
                <li><Link to="/account/ideas">My Ideas</Link></li>
                <li><Link to="/voted">Voted Ideas</Link></li>
              </ul>
            </Col>
          </Row>
          <Row>
            <Col md={6} xs={12}>
              <Reimburse
                amount={ideasToReimburse}
                text="Ideas to reimburse"
                callback={this.handleIdeaReimburse}
              />
            </Col>
            <Col md={6} xs={12}>
              <Reimburse
                amount={votesToReimburse}
                text="Votes to reimburse"
                callback={this.handleVoteReimburse}
              />
            </Col>
          </Row>
        </Grid>
      </main>
    )
  }
}

Account.contextTypes = {
  drizzle: PropTypes.object,
}

Account.propTypes = {
  account: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  account: state.account.current,
  contract: state.contracts.DIdea,
})

const AccountPage = drizzleConnect(Account, mapStateToProps) 

export { AccountPage }
export default AccountPage
