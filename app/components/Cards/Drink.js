import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

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
    this.state = { hovered: false }
  }

  onMouseEnter () {
    this.setState({ hovered: true })
  }

  onMouseLeave () {
    this.setState({ hovered: false })
  }

  render () {
    const { classes, drink } = this.props
    const { hovered } = this.state
    return (
      <Link to={`/game/${drink && drink.game && drink.game.url}/${drink && drink.url}`}>
        <Card
          raised={hovered}
          className={classes.card}
          onMouseEnter={this.onMouseEnter.bind(this)}
          onMouseLeave={this.onMouseLeave.bind(this)}
        >
          { drink && drink.game && drink.game.images && drink.game.images.banner ? (
              <CardMedia
                className={classes.media}
                image={`/uploads/${drink.game.images.banner[0].filename}`}
                title={drink.name}
              />
            ) : null
          }
          <CardContent>
            <Typography type='headline' component='h1'>
              {drink && drink.game && drink.game.name}{' '}|
            </Typography>
            <Typography type='headline' component='h2'>
              {drink && drink.name}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    )
  }
}

DrinkCard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DrinkCard)
