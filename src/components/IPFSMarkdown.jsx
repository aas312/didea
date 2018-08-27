import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import axios from 'axios'

class IPFSMarkdown extends Component {
  constructor(props) {
    super(props)
    this.baseURL = 'https://ipfs.infura.io/ipfs'

    this.state = {
      content: "",
      loading: true,
      error: false,
    }
  }

  componentDidMount() {
    axios.get(`${this.baseURL}/${this.props.url}`)
      .then(({ data }) => {
        this.setState({
          ...this.state,
          loading: false,
          content: data,
        })
      })
      .catch(() => {
        this.setState({
          ...this.state,
          loading: false,
          error: true,
        })
      })
  }

  render() {
    return (
      <Markdown skipHtml scapeHtml source={this.state.content} />
    )
  }
}

IPFSMarkdown.propTypes = {
  url: PropTypes.string.isRequired,
}

export { IPFSMarkdown }
export default IPFSMarkdown
