import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import { forgotPassword } from '../../actions/auth'
import Messages from '../Messages'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  })
})

class Forgot extends React.Component {
  constructor (props) {
    super(props)
    this.state = { email: '' }
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleForgot (event) {
    event.preventDefault()
    this.props.dispatch(forgotPassword(this.state.email))
  }

  render () {
    const classes = this.props.classes
    return (
      <div className='container'>
        <Paper className={classes.root}>
          <Messages messages={this.props.messages} />
          <form onSubmit={this.handleForgot.bind(this)}>
            <Typography type='display1'>Forgot Password</Typography>
            <Typography>Enter your email address below and we'll send you password reset instructions.</Typography>
            <TextField
              type='email'
              name='email'
              label='Email'
              placeholder='Email'
              margin='normal'
              value={this.state.email}
              onChange={this.handleChange.bind(this)}
              autoFocus
              required
          />
            <br />
            <Button type='submit'>Reset Password</Button>
          </form>
        </Paper>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Forgot))
