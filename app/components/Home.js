import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Grid from 'material-ui/Grid'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import Messages from './Messages'
import GameCard from './Cards/Game'
import Loader from './lib/MainLoader'
import { loadGames } from '../actions/games'

const styles = (theme) => ({
  container: {
    marginTop: '20px'
  },
  addIconContainer: {
    padding: `0 ${theme.spacing.unit * 3}px !important`,
    position: 'relative'
  },
  addButton: {
    top: '50%',
    transform: 'translateY(-50%)'
  }
})

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = { loaded: false, games: [] }
  }

  componentDidMount () {
    const { games } = this.props
    if (games && games.items.length === 0) {
      this.props.dispatch(loadGames())
    }
  }

  render () {
    const { classes, messages, games, user } = this.props
    const { loaded, items } = games
    return (
      <Grid container className={classes.container}>
        <Messages messages={messages} />
        <Loader loaded={loaded}>
          <Grid item xs={12}>
            <Grid container justify='center' spacing={8}>
              {items.map(game => (
                <Grid key={game._id + (+(new Date()))} item>
                  <GameCard game={game}/>
                </Grid>
              ))}
              { items.length === 0
              ? (<Grid item>There are no games currently, sorry about that.</Grid>)
              : null
              }
              { user && user.permissions && user.permissions.includes('game:create') ?
              ( <Grid item className={classes.addIconContainer}>
                  <Link to='/game/new'>
                    <Button fab color="primary" aria-label="new" className={classes.addButton}>
                      <AddIcon />
                    </Button>
                  </Link>
                </Grid>
              ) : null
              }
            </Grid>
          </Grid>
        </Loader>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    messages: state.messages,
    games: state.games
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Home))
