import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import DashboardIcon from 'material-ui-icons/Dashboard'
import Button from 'material-ui/Button'
import SaveIcon from 'material-ui-icons/Save'
import TextField from 'material-ui/TextField'
import axios from 'axios'
import EditableBanner from './parts/editable/Banner'
import { refreshGames } from '../../actions/games'

const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16
  }),
  center: {
    textAlign: 'center'
  },
  saveButton: {
    position: 'fixed',
    right: '6vw',
    top: '10vh'
  }
})

class NewGame extends React.Component {
  constructor (props) {
    super(props)
    this.state = Object.assign({ name: 'Game Name' }, props.game)
  }

  componentWillReceiveProps (props) {
    this.setState(props.game)
  }

  handleGameChange (newState) {
    this.setState(newState)
  }

  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  cleanState () {
    return Object.assign({}, this.state, {
      genreId: this.state.genre && this.state.genre._id
    })
  }

  handleAction () {
    const data = this.getGameState()
    if (this.props.handleAction) {
      this.props.handleAction(data)
    } else {
      this.handleSave(data)
    }
  }

  getGameState () {
    const { user } = this.props
    const data = new FormData()
    const cleanedState = this.cleanState()
    const preserveFields = [ 'banner' ]
    Object.keys(cleanedState).forEach((key) => {
      let value = cleanedState[key]
      if (!preserveFields.includes(key)) {
        value = (typeof value === 'object' ? JSON.stringify(value) : value)
      }
      data.append(key, value)
    })
    data.delete('genre')
    return data
  }

  handleSave (data) {
    const { history, dispatch, games } = this.props
    axios('/api/game/', { method: 'POST', data })
      .then((res) => {
        if (res.statusText === 'OK' && res.data ) {
          dispatch(refreshGames(games))
          history.replaceState(`/game/${res.data.url}`)
        }
      })
      .catch(console.error)
  }

  render () {
    const classes = this.props.classes
    return (
      <div className='container'>
        <EditableBanner game={this.state} onChange={this.handleGameChange.bind(this)} />
        <Paper className={classes.paper + ' ' + classes.center}>
          <DashboardIcon />
          <Typography>Drinking games will load here.</Typography>
        </Paper>
        <Paper className={classes.paper + ' ' + classes.center}>
          <Typography type="display1">Other details</Typography>
          <TextField
            label='Url'
            placeholder='/url'
            type='text'
            margin='normal'
            value={this.state.url}
            onChange={this.handleChange.bind(this)}
            name='url'
            required
          />
        </Paper>
        <Button fab color="accent" aria-label="save" className={classes.saveButton} onClick={this.handleAction.bind(this)}>
          <SaveIcon />
        </Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    games: state.games
  }
}

export default connect(mapStateToProps)(withStyles(styles)(NewGame))
