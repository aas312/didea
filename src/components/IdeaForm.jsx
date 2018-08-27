import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { drizzleConnect } from 'drizzle-react'
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

class IdeaForm extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      title: '',
      url: '',
    }

    this.web3 = context.drizzle.web3
    this.contracts = context.drizzle.contracts
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleURLChange = this.handleURLChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value })
  }

  handleURLChange(e) {
    this.setState({ url: e.target.value })
  }

  handleFormSubmit() {
    const stake = this.web3.utils.toWei("0.1", "ether")
    this.contracts.DIdea.methods.createIdea.cacheSend(this.state.title, this.state.url, { value: stake, from: this.props.account })

    this.setState({ title: '', url: '' }) 
  }

  render() {
    return(
      <form>
        <FormGroup
          controlId="ideaTitle"
        >
          <ControlLabel>Idea Title</ControlLabel>
          <FormControl
            type="text"
            value={this.state.title}
            placeholder="Enter Title"
            onChange={this.handleTitleChange}
          />
        </FormGroup>
        <FormGroup
          controlId="ideaURL"
        >
          <ControlLabel>Idea IPFS Hash</ControlLabel>
          <FormControl
            type="text"
            value={this.state.url}
            placeholder="Enter IPFS URL"
            onChange={this.handleURLChange}
          />
        </FormGroup>
        <Button onClick={this.handleFormSubmit}>Submit</Button>
      </form>
    )
  }
}

IdeaForm.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => ({
  account: state.account.current,
})

const IdeaFormContainer = drizzleConnect(IdeaForm, mapStateToProps)

export { IdeaFormContainer }
