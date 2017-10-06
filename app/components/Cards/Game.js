import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

const styles = {
  card: {
    height: 280,
    width: 250
  },
  media: {
    height: 200
  }
}

class GameCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hovered: false }
  }

  onMouseEnter () {
    this.setState({ hovered: true })
  }

  onMouseLeave () {
    this.setState({ hovered: false })
  }

  render () {
    const { classes, game } = this.props
    const { hovered } = this.state
    return (
      <Link to={`/game/${game && game.url}`}>
        <Card
          raised={hovered}
          className={classes.card}
          onMouseEnter={this.onMouseEnter.bind(this)}
          onMouseLeave={this.onMouseLeave.bind(this)}
        >
          { game && game.images && game.images.banner ? (
              <CardMedia
                className={classes.media}
                image={`/uploads/${game.images.banner[0].filename}`}
                title={game.name}
              />
            ) : null
          }
          <CardContent>
            <Typography type='headline' component='h2'>
              {game && game.name}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    )
  }
}

GameCard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(GameCard)
