import React, { Component } from 'react'
import { Grid } from 'react-bootstrap'
import { drizzleConnect } from 'drizzle-react'
import { IdeaFormContainer } from '../components/IdeaForm'

class CreateIdea extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Grid>
        <h1>New Idea</h1>
        <IdeaFormContainer />
      </Grid>
    )
  }
}

const CreateIdeaPage = drizzleConnect(CreateIdea, null)

export { CreateIdeaPage }
