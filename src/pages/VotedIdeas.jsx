import React, { Component } from 'react'
import { ListContainer } from './../components/ListContainer'
import { Grid, Row, Col } from 'react-bootstrap'

class VotedIdeas extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <main>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1>Voted Ideas</h1>
            </Col>
          </Row>
        </Grid>
        <Grid>
          <Row>
            <Col xs={12}>
              <ListContainer onlyVoted />
            </Col>
          </Row>
        </Grid>
      </main>
    )
  }
}

export { VotedIdeas }
