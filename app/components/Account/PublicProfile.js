import React from 'react'
import axios from 'axios'
import { withStyles } from 'material-ui/styles'
import Avatar from 'material-ui/Avatar'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import Loader from '../lib/MainLoader'
import GameCard from '../Cards/Game'
import DrinkCard from '../Cards/Drink'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  }),
  avatar: {
    display: 'inline-block',
    marginRight: theme.spacing.unit
  }
})

class PublicProfile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      user: {},
      loadedGames: false,
      games: [],
      loadedDrinks: false,
      drinks: []
    }
  }

  componentDidMount () {
    const { params } = this.props
    const { user } = params
    axios(`/api/user/profile/${user}`)
      .then((res) => {
        if (res.statusText === 'OK' && res.data ) {
          this.setState({ loaded: true, user: res.data })
        }
      })
      .catch(console.error)
    axios(`/api/user/games/${user}`)
      .then((res) => {
        if (res.statusText === 'OK' && res.data ) {
          this.setState({ loadedGames: true, games: res.data })
        }
      })
      .catch(console.error)
    axios(`/api/user/drinks/${user}`)
      .then((res) => {
        if (res.statusText === 'OK' && res.data ) {
          this.setState({ loadedDrinks: true, drinks: res.data })
        }
      })
      .catch(console.error)
  }

  render () {
    const { classes } = this.props
    const { loaded, user, loadedGames, games, loadedDrinks, drinks } = this.state
    return (
      <div className="container">
        <Loader loaded={loaded}>
          <Paper className={classes.root}>
            <Typography type="display2"><Avatar className={classes.avatar} src={user.picture || user.gravatar} />{user.name}</Typography>
          </Paper>
        </Loader>
        <Loader loaded={loadedGames}>
          <Paper className={classes.root}>
            <Typography type="display1">{games.length} Game{games.length === 0 ? '' : 's'}</Typography>
            <Grid item xs={12}>
              <Grid container justify='center' spacing={8}>
                {games.map(game => (
                  <Grid key={game._id + (+(new Date()))} item>
                    <GameCard game={game} small />
                  </Grid>
                ))}
                { games.length === 0
                ? (<Grid item>There are no games currently for {user.name}, sorry about that.</Grid>)
                : null
                }
              </Grid>
            </Grid>
          </Paper>
        </Loader>
        <Loader loaded={loadedDrinks}>
          <Paper className={classes.root}>
            <Typography type="display1">{drinks.length} Drinking Game{drinks.length === 0 ? '' : 's'}</Typography>
            <Grid item xs={12}>
              <Grid container justify='center' spacing={8}>
                {drinks.map(drink => (
                  <Grid key={drink._id + (+(new Date()))} item>
                    <DrinkCard game={drink.game} drink={drink} />
                  </Grid>
                ))}
                { drinks.length === 0
                ? (<Grid item>There are no drinking games currently for {user.name}, sorry about that.</Grid>)
                : null
                }
              </Grid>
            </Grid>
          </Paper>
        </Loader>
      </div>
    )
  }
}

export default withStyles(styles)(PublicProfile)
