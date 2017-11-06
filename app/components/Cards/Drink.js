import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import ArrowUpwardIcon from 'material-ui-icons/ArrowUpward'
import ArrowDownwardIcon from 'material-ui-icons/ArrowDownward'
import Typography from 'material-ui/Typography'
import axios from 'axios'

const styles = {
  card: {
    maxWidth: 345
  },
  media: {
    height: 200
  }
}

class DrinkCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hovered: false, vote: null }
  }

  componentDidMount () {
    const { drink, votable, user, token } = this.props

    if (votable && user && token) {
      axios(`/api/drink/${drink._id}/vote/`, { method: 'GET', credentials: 'same-origin' })
        .then((res) => {
          if (res.statusText === 'OK' && res.data ) {
            this.setState({ vote: res.data })
          }
        })
        .catch(console.error)
    }
  }

  onMouseEnter () {
    this.setState({ hovered: true })
  }

  onMouseLeave () {
    this.setState({ hovered: false })
  }

  handleVote (voteType) {
    return (e) => {
      e.preventDefault()
      e.stopPropagation()
      const { drink } = this.props
      axios(`/api/drink/${drink._id}/vote/${voteType}`, { method: 'POST', credentials: 'same-origin' })
        .then((res) => {
          if (res.statusText === 'OK' && res.data ) {
            this.setState({ vote: { vote: voteType } })
          }
        })
        .catch(console.error)
    }
  }

  render () {
    const { classes, drink, game, votable, user, token } = this.props
    const { hovered, vote } = this.state
    return (
      <Link to={`/game/${game.url}/drink/${drink.url}`}>
        <Card
          raised={hovered}
          className={classes.card}
          onMouseEnter={this.onMouseEnter.bind(this)}
          onMouseLeave={this.onMouseLeave.bind(this)}
          style={{ background: drink.bgColour }}
        >
          <CardContent>
            <Typography type='headline' component='h2' style={{ color: drink.mainColour }}>
              {drink && drink.name}
            </Typography>
            <Typography type="subheading" color="secondary">
              <Link to={`/user/${drink && drink.createdBy && drink.createdBy.name}`}>{drink && drink.createdBy && drink.createdBy.name}</Link>
            </Typography>
          </CardContent>
          {votable
          ? <CardActions>
              <IconButton onClick={user && token ? this.handleVote('up') : console.log}>
                <ArrowUpwardIcon style={{ color: vote && vote.vote === 'up' ? '#1976d2' : '' }} />
              </IconButton>
              <IconButton onClick={user && token ? this.handleVote('down') : console.log}>
                <ArrowDownwardIcon style={{ color: vote && vote.vote === 'down' ? '#1976d2' : '' }} />
              </IconButton>
            </CardActions>
          : null
          }
        </Card>
      </Link>
    )
  }
}

DrinkCard.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user
  }
}

export default connect(mapStateToProps)(withStyles(styles)(DrinkCard))
