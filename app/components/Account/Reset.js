import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { resetPassword } from '../../actions/auth'
import Messages from '../Messages'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    maxWidth: '500px',
    marginLeft: '50%',
    transform: 'translateX(-50%)'
  }),
  textField: {
    display: 'block'
  },
  fullButton: {
    width: '100%'
  }
})


class Reset extends React.Component {
  constructor (props) {
    super(props)
    this.state = { password: '', confirm: '' }
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleReset (event) {
    event.preventDefault()
    this.props.dispatch(resetPassword(this.state.password, this.state.confirm, this.props.params.token))
  }

  render () {
    return (
      <div className='container'>
        <Messages messages={this.props.messages} />
        <form onSubmit={this.handleReset.bind(this)}>
          <h4>Reset Password</h4>
          <label htmlFor='password'>New Password</label>
          <input type='password' name='password' id='password' placeholder='New password' value={this.state.password} onChange={this.handleChange.bind(this)} autoFocus />
          <label htmlFor='confirm'>Confirm Password</label>
          <input type='password' name='confirm' id='confirm' placeholder='Confirm password' value={this.state.confirm} onChange={this.handleChange.bind(this)} />
          <br />

          <button type='submit'>Change Password</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(withStyles(styles)(Reset))
