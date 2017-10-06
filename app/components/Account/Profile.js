import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Chip from 'material-ui/Chip'
import fontColorContrast from 'font-color-contrast'
import { updateProfile, changePassword, deleteAccount } from '../../actions/auth'
import { link, unlink } from '../../actions/oauth'
import Messages from '../Messages'
import { FacebookButton, GoogleButton, TwitterButton } from './Buttons'
import hashCode from '../../lib/hashCode'
import intToHex from '../../lib/intToHex'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  }),
  facebook: {
    color: '#3b5998'
  },
  twitter: {
    color: '#00b6f1'
  },
  google: {
    color: '#df4a32'
  },
  textField: {
    display: 'block'
  },
  button: {
    display: 'block'
  },
  roleRow: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  role: {
    margin: theme.spacing.unit
  }
})

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: props.user.email,
      name: props.user.name,
      gravatar: props.user.gravatar,
      password: '',
      confirm: ''
    }
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleProfileUpdate (event) {
    event.preventDefault()
    this.props.dispatch(updateProfile(this.state, this.props.token))
  }

  handleChangePassword (event) {
    event.preventDefault()
    this.props.dispatch(changePassword(this.state.password, this.state.confirm, this.props.token))
  }

  handleDeleteAccount (event) {
    event.preventDefault()
    this.props.dispatch(deleteAccount(this.props.token))
  }

  handleLink (provider) {
    this.props.dispatch(link(provider))
  }

  handleUnlink (provider) {
    this.props.dispatch(unlink(provider))
  }

  render () {
    const { classes, user, messages } = this.props
    const { email, name, gravatar, password, confirm } = this.state
    const facebookLinkedAccount = user.facebook ? (
      <FacebookButton filled onClick={this.handleUnlink.bind(this, 'facebook')}>Unlink your Facebook account</FacebookButton>
    ) : (
      <FacebookButton onClick={this.handleLink.bind(this, 'facebook')}>Link your Facebook account</FacebookButton>
    )
    const twitterLinkedAccount = user.twitter ? (
      <TwitterButton filled onClick={this.handleUnlink.bind(this, 'twitter')}>Unlink your Twitter account</TwitterButton>
    ) : (
      <TwitterButton onClick={this.handleLink.bind(this, 'twitter')}>Link your Twitter account</TwitterButton>
    )
    const googleLinkedAccount = user.google ? (
      <GoogleButton filled onClick={this.handleUnlink.bind(this, 'google')}>Unlink your Google account</GoogleButton>
    ) : (
      <GoogleButton onClick={this.handleLink.bind(this, 'google')}>Link your Google account</GoogleButton>
    )
    return (
      <div className='container'>
        <Paper className={classes.root}>
          <Messages messages={messages} />
          <Typography type='display1'>Profile Information</Typography>
          <form onSubmit={this.handleProfileUpdate.bind(this)}>
            <TextField
              className={classes.textField}
              type='email'
              name='email'
              id='email'
              margin='normal'
              placeholder='Email'
              label='Email'
              value={email}
              onChange={this.handleChange.bind(this)}
            />
            <TextField
              className={classes.textField}
              type='text'
              name='name'
              id='name'
              margin='normal'
              placeholder='Name'
              label='Name'
              value={name}
              onChange={this.handleChange.bind(this)}
            />
            <label>Gravatar</label>
            <img src={this.state.gravatar} className='gravatar' width='100' height='100' />
            <Button className={classes.button} raised type='submit'>Update Profile</Button>
          </form>
        </Paper>
        <Paper className={classes.root}>
          <Typography type='display1'>Change Password</Typography>
          <form onSubmit={this.handleChangePassword.bind(this)}>
            <TextField
              className={classes.textField}
              type='password'
              name='password'
              id='password'
              margin='normal'
              placeholder='Password'
              label='Password'
              value={password}
              onChange={this.handleChange.bind(this)}
            />
            <TextField
              className={classes.textField}
              type='password'
              name='confirm'
              id='confirm'
              margin='normal'
              placeholder='Confirm Password'
              label='Confirm Password'
              value={confirm}
              onChange={this.handleChange.bind(this)}
            />
            <Button className={classes.button} raised type='submit'>Change Password</Button>
          </form>
        </Paper>
        <Paper className={classes.root}>
          <Typography type='display1'>Link Accounts</Typography>
          {facebookLinkedAccount}
          {twitterLinkedAccount}
          {googleLinkedAccount}
        </Paper>
        <Paper className={classes.root}>
          <Typography type='display1'>Roles</Typography>
          <div className={classes.roleRow}>
            { user.roles && user.roles.length > 0
              ? user.roles.map((role, i) => (
                  <Chip
                    key={(role && role.name) || i}
                    label={role && role.name}
                    className={classes.role}
                    style={{ backgroundColor: `#${intToHex(hashCode(role.name))}`, color: fontColorContrast(`#${intToHex(hashCode(role.name))}`) }}
                  />
                ))
              : <div>Guest</div>
            }
          </div>
        </Paper>
        <Paper className={classes.root}>
          <Typography type='display1'>Delete Account</Typography>
          <form onSubmit={this.handleDeleteAccount.bind(this)}>
            <p>You can delete your account, but keep in mind this action is irreversible.</p>
            <Button className={classes.button} raised type='submit'>Delete my account</Button>
          </form>
        </Paper>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user,
    messages: state.messages
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Profile))
