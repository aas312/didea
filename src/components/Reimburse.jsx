import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Panel } from 'react-bootstrap'

class Reimburse extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Panel>
        <Panel.Body>
          <h3 className="text-center">{this.props.amount}</h3>
          <h3 className="text-center">{this.props.text}</h3>
          <Button disabled={this.props.amount === 0} block onClick={()=> this.props.callback()}>Reimburse</Button>
        </Panel.Body>
      </Panel>
    )
  }
}

Reimburse.propTypes = {
  amount: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
}

export { Reimburse }
export default Reimburse
