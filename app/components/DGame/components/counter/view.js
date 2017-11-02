import React from 'react'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import AddIcon from 'material-ui-icons/Add'

class Counter extends React.Component {
  constructor (props) {
    super(props)
    this.state = { counter: 0 }
  }

  increment () {
    let { counter } = this.state
    counter += 1
    this.setState({ counter })
  }

  render () {
    const { counter } = this.state
    return (
      <Typography type='display2'>
          Counter: {counter}
          <IconButton onClick={this.increment.bind(this)}>
              <AddIcon />
          </IconButton>
      </Typography>
    )
  }
}

export default Counter
