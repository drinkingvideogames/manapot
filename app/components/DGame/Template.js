import React from 'react'
import axios from 'axios'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Loader from '../lib/MainLoader'
import components from './components'


const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16
  })
})

class DrinkingGameTemplate extends React.Component {
    constructor (props) {
        super(props)
        this.state = { loaded: false, game: {} }
    }

    componentDidMount () {
        const { params } = this.props
        axios.get(`/api/drink/url/${params.dgame}`)
          .then((res) => {
            this.setState({ loaded: true, game: res.data || {} }, () => {
                const { game } = this.state
                if (game.mainColour) document.body.querySelector('#app > div > div > header').style = `background: ${game.mainColour}`
                if (game.bgColour) document.body.style = `background: ${game.bgColour}`
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
        return (<div className="view-component" key={componentId}>{toRender}</div>)
    }

    render () {
        const { classes } = this.props
        const { loaded, game } = this.state
        return (
            <Loader loaded={loaded}>
                <div className="container">
                    <Paper className={classes.paper}>
                        {game.layout && game.layout.map(this.hydrateComponent.bind(this))}
                    </Paper>
                </div>
            </Loader>
        )
    }
}

export default withStyles(styles)(DrinkingGameTemplate)
