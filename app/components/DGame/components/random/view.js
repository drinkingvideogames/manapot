import React from 'react'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

class RandomView extends React.Component {
  constructor (props) {
    super(props)
    this.state = { option: null }
  }

  select () {
    const { hydrationState } = this.props
    const { options } = hydrationState
    const option = Math.floor(Math.random() * options.length)
    this.setState({ option })
  }

  render () {
    const { componentId, hydrationState } = this.props
    const { option } = this.state
    const { options } = hydrationState
    const selectedOption = options[option] && options[option].text || 'Click to get something!'

    return (
      <div>
        <Typography className={`${componentId}-text`} type="display1">{selectedOption}</Typography>
        <Button color="primary" raised onClick={this.select.bind(this)}>Random!</Button>
      </div>
    )
  }
}

export default RandomView
