import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import axios from 'axios'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import EditIcon from 'material-ui-icons/Edit'
import Loader from '../lib/MainLoader'
import components from './components'

const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16
  }),
  editButton: {
    position: 'fixed',
    right: '6vw',
    top: '10vh'
  }
})

class DrinkingGameTemplate extends React.Component {
  constructor (props) {
    super(props)
    this.state = { loaded: false, dgame: {} }
  }

  componentDidMount () {
    const { params } = this.props
    axios.get(`/api/drink/url/${params.dgame}`)
      .then((res) => {
        this.setState({ loaded: true, dgame: res.data || {} }, () => {
          const { dgame } = this.state
          this.props.dispatch({ type: 'REPLACE_STYLES', styles: { mainBg: dgame.mainColour, bg: dgame.bgColour } })
        })
      })
      .catch(console.error)
  }

  hydrateComponent({ componentKey, componentId, state }) {
    const component = components[componentKey]
    const toRender = React.createElement(component.view, {
      componentId,
      hydrationState: state
    })
    return (<div className={`view-component ${component.classes || ''}`} key={componentId}>{toRender}</div>)
  }

  render () {
    const { classes, user } = this.props
    const { loaded, loadedGame, dgame } = this.state
    return (
      <Loader loaded={loaded}>
        <div className="container">
          <Paper className={classes.paper}>
            {dgame && dgame.layout && dgame.layout.map(this.hydrateComponent.bind(this))}
          </Paper>
          { user && user.permissions && user.permissions.includes('drinkinggame:edit') ?
            <Link to={`/game/${dgame && dgame.game && dgame.game.url}/drink/${dgame.url}/edit`}>
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

export default connect(mapStateToProps)(withStyles(styles)(DrinkingGameTemplate))
