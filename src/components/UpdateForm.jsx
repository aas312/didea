import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

class Form extends Component {
  constructor(props, context) {
    super(props)

    this.contract = context.drizzle.contracts.DIdea
    this.state = {
      title: this.props.title,
      url: this.props.url,
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleURLChange = this.handleURLChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  handleTitleChange(e) {
    this.setState({
      ...this.state,
      title: e.target.value,
    })
  }

  handleURLChange(e) {
    this.setState({
      ...this.state,
      url: e.target.value,
    })
  }

  handleFormSubmit() {
    this.contract.methods.updateIdea
      .cacheSend(
        this.props.index,
        this.state.title,
        this.state.url,
        {
          from: this.state.account,
        }
      )
  }

  render() {
    return (
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

Form.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  account: PropTypes.string.isRequired,
}

Form.contextTypes = {
  drizzle: PropTypes.object,
}

const UpdateForm = drizzleConnect(Form)

export { UpdateForm }
export default UpdateForm
