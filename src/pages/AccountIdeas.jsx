import React, { Component } from 'react'
import { ListContainer } from './../components/ListContainer'
import { Form, FormGroup, FormControl } from 'react-bootstrap'

class AccountIdeas extends Component {
  constructor(props) {
    super(props)

    this.updateFilter = this.updateFilter.bind(this)

    this.filters = [
      [0, 1, 2],
      [0],
      [1],
      [2],
    ]

    this.state = {
      filter: 0,
    }
  }

  updateFilter(e) {
    this.setState({
      ...this.state,
      filter: parseInt(e.target.value),
    })
  }

  render() {
    return (
      <main>
        <h1>My Ideas</h1>
        <Form>
          <FormGroup>
            <FormControl componentClass="select" value={this.state.filter} onChange={this.updateFilter}>
              <option value={0}>Display All</option>
              <option value={1}>Only Created</option>
              <option value={2}>Only Published</option>
              <option value={3}>Only Abandoned</option>
            </FormControl>
          </FormGroup>
        </Form>
        <ListContainer onlyOwner onlyInState={this.filters[this.state.filter]} />
      </main>
    )
  }
}

export { AccountIdeas }
