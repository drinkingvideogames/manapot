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
  },
  smallCard: {
    height: 180,
    width: 150
  },
  smallMedia: {
    height: 100
  },
  smallName: {
    lineHeight: '24px',
    fontSize: 18
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
    const { classes, game, small } = this.props
    const { hovered } = this.state
    const classNames = {
      card: small ? classes.smallCard : classes.card,
      media: small ? classes.smallMedia : classes.media,
      name: small ? classes.smallName : null
    }
    return (
      <Link to={`/game/${game && game.url}`}>
        <Card
          raised={hovered}
          className={classNames.card}
          onMouseEnter={this.onMouseEnter.bind(this)}
          onMouseLeave={this.onMouseLeave.bind(this)}
        >
          { game && game.banner && game.banner.file && game.banner.file.url ? (
              <CardMedia
                className={classNames.media}
                image={`${game.banner && game.banner.file && game.banner.file.url}`}
                title={game.name}
              />
            ) : null
          }
          <CardContent>
            <Typography className={classNames.name} type='headline' component='h2'>
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
