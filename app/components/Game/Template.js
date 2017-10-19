import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import EditIcon from 'material-ui-icons/Edit'
import axios from 'axios'
import Loader from '../lib/MainLoader'
import DrinkCard from '../Cards/Drink'

const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16
  }),
  center: {
    textAlign: 'center'
  },
  bannerContainer: {
    position: 'relative'
  },
  bannerTitle: {
    position: 'absolute',
    bottom: '20px',
    left: '20px'
  },
  bannerGenre: {
    position: 'absolute',
    bottom: '20px',
    right: '20px'
  },
  bannerImage: {
    boxSizing: 'border-box',
    height: '200px',
    position: 'relative',
    width: '100%',
    padding: '10px',
    textAlign: 'center',
    background: 'rgba(20, 20, 20, 0.2)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center'
  },
  editButton: {
    position: 'fixed',
    right: '6vw',
    top: '10vh'
  }
})

class Template extends React.Component {
  constructor (props) {
    super(props)
    this.state = { loaded: false, loadedGames: false, game: {}, games: [] }
  }

  componentDidMount () {
    const { params } = this.props
    axios.get(`/api/game/url/${params.game}`)
      .then((res) => {
        this.setState({ loaded: true, game: res.data[0] || {} })
        axios.get(`/api/drink/game/${res.data[0]._id}`)
          .then((res) => {
            this.setState({ loadedGames: true, games: res.data || [] })
          })
          .catch(console.error)
      })
      .catch(console.error)
  }

  renderDrinkingGames () {
    const { user } = this.props
    const { game, games } = this.state
    const NoGamesMessage = (<Grid item><Typography>There don't appear to be any drinking games for this game yet!</Typography></Grid>);
    const NewGamePrompt = (
      <Grid item key='newgameprompt'>
        <Link to={`/game/${game.url}/drink/new`}>
          <Button fab color="primary" aria-label="new">
            <AddIcon />
          </Button>
        </Link>
      </Grid>
    )
    let Games = games.map((dgame) => (
      <Grid item key={dgame._id}>
        <DrinkCard game={game} drink={dgame} />
      </Grid>
    ))
    if (user) Games = Games.concat(NewGamePrompt);
    return games && games.length > 0 ? Games : (user ? NewGamePrompt : NoGamesMessage)
  }

  renderDrinkingGameContainer () {
    const { game } = this.state
    return game && Object.keys(game).length > 0
      ? this.renderDrinkingGames()
      : <Grid item><Typography>Couldn't find a game</Typography><Link to='/'><Button>Go Home</Button></Link></Grid>
  }

  render () {
    const { classes, user } = this.props
    const { loaded, game } = this.state
    return (
      <Loader loaded={loaded}>
        <div className='container'>
          <div className={classes.bannerContainer}>
            <div className={classes.bannerImage} style={{ backgroundImage: `url(/uploads/${game && game.images && game.images.banner[0].filename})` }}>
            </div>
            <div className={classes.bannerTitle}>
              <Typography type='display1'>
                {game && game.name}
              </Typography>
            </div>
          </div>
          <Paper className={classes.paper + ' ' + classes.center}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container justify='center' spacing={8}>
                  { this.renderDrinkingGameContainer() }
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          { user && user.permissions && user.permissions.includes('game:edit') ?
            <Link to={`/game/${game.url}/edit`}>
              <Button fab color="accent" aria-label="save" className={classes.editButton}>
                <EditIcon />
              </Button>
            </Link> :
            null
          }
        </div>
      </Loader>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Template))
