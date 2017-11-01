import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import { signup, login } from '../../actions/auth'
import { facebookLogin, twitterLogin, googleLogin } from '../../actions/oauth'
import Messages from '../Messages'
import { FacebookButton, GoogleButton, TwitterButton } from './Buttons'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    maxWidth: '500px',
    marginLeft: '50%',
    transform: 'translateX(-50%)'
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
  fullButton: {
    width: '100%'
  }
})

class AuthForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = { name: '', email: '', password: '', purpose: props.route.purpose || 'Signup' }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ purpose: nextProps.route.purpose })
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSignup (event) {
    event.preventDefault()
    const action = (this.state.purpose === 'Signup') ? signup : login
    const args = (this.state.purpose === 'Signup')
      ? [ this.state.name, this.state.email, this.state.password ]
      : [ this.state.email, this.state.password ]
    this.props.dispatch(action.apply(this, args))
  }

  handleFacebook () {
    this.props.dispatch(facebookLogin())
  }

  handleTwitter () {
    this.props.dispatch(twitterLogin())
  }

  handleGoogle () {
    this.props.dispatch(googleLogin())
  }

  render () {
    const classes = this.props.classes
    return (
      <div className='container'>
        <Paper className={classes.root}>
          <Messages messages={this.props.messages} />
          <form onSubmit={this.handleSignup.bind(this)}>
            <Typography type='display1'>{ this.state.purpose === 'Signup' ? 'Create an account' : 'Log In' }</Typography>
            { this.state.purpose === 'Signup' ? (
              <TextField
                className={classes.textField}
                label='Name'
                placeholder='Name'
                type='text'
                margin='normal'
                value={this.state.name}
                onChange={this.handleChange.bind(this)}
                name='name'
                autoFocus={this.state.purpose === 'Signup'}
                required
                InputClassName='auth-text-field'
              />
            ) : null
          }
            <TextField
              className={classes.textField}
              label='Email'
              placeholder='Email'
              type='email'
              margin='normal'
              value={this.state.email}
              onChange={this.handleChange.bind(this)}
              name='email'
              autoFocus={this.state.purpose !== 'Signup'}
              required
              InputClassName='auth-text-field'
            />
            <TextField
              className={classes.textField}
              label='Password'
              placeholder='Password'
              type='password'
              margin='normal'
              value={this.state.password}
              onChange={this.handleChange.bind(this)}
              name='password'
              required
              InputClassName='auth-text-field'
            />
            { this.state.purpose === 'Signup'
          ? <Typography>By signing up, you agree to the <Link to='/'>Terms of Service</Link>.</Typography>
          : <Typography><Link to='/forgot'>Forgot your password?</Link></Typography>
          }
            { this.state.purpose === 'Signup'
          ? <Button raised color='primary' type='submit' className={classes.fullButton}>Create an account</Button>
          : <Button raised color='primary' type='submit' className={classes.fullButton}>Log in</Button>
          }
          </form>
          <hr />
          <FacebookButton onClick={this.handleFacebook.bind(this)} style={{ width: '33%' }}/>
          <TwitterButton onClick={this.handleTwitter.bind(this)} style={{ width: '33%' }}/>
          <GoogleButton onClick={this.handleGoogle.bind(this)} style={{ width: '33%' }}/>
          { this.state.purpose === 'Signup'
        ? <Typography>Already have an account? <Link to='/login'>Log in</Link></Typography>
        : <Typography>Don't have an account? <Link to='/signup'>Sign up</Link></Typography>
        }
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

export default connect(mapStateToProps)(withStyles(styles)(AuthForm))
