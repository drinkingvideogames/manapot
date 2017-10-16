import React from 'react'
import { DragDropContextProvider, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import SaveIcon from 'material-ui-icons/Save'
import uuid from 'uuid'
import ComponentsSidebar from './parts/ComponentsSidebar'

const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16
  })
})

const items = []

const pageTarget = {
  drop (props, monitor, component) {
    const item = monitor.getItem()
    component.props.onDrop.call(component, component.layoutRefs)
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

class Page extends React.Component {
    constructor (props) {
        super(props)
        this.layoutRefs = {}
    }

    render () {
        const { connectDropTarget, classes, layout, removeFromPage } = this.props
        return connectDropTarget(
            <div>
                <Paper className={classes.paper}>
                    {layout && layout.length > 0 ? null : <div style={{ textAlign: 'center' }}>Drag items here to build the page</div>}
                    {layout.map((component, i) => {
                        const toRender = React.createElement(component.edit, {
                            componentId: component.componentId,
                            destroy: () => { if (removeFromPage) removeFromPage(i) },
                            ref: (ref) => { this.layoutRefs[component.componentId] = ref }
                        })
                        return (<div className={`component ${component.classes || ''}`} key={component.componentId}>{toRender}</div>)
                    })}
                </Paper>
            </div>
        )
    }
}

const PageContent = withStyles(styles)(DropTarget('component', pageTarget, collect)(Page))

class NewDrinkingGame extends React.Component {
    constructor (props) {
        super(props)
        this.state = { layout: [] }
    }

    changeLayout (component) {
        const { layout } = this.state
        this.setState({ layout: layout.concat(component) })
    }

    removeFromLayout (i) {
        const { layout } = this.state
        const layoutClone = [].concat(layout)
        layoutClone.splice(i, 1)
        this.setState({ layout: layoutClone })
    }

    updateState (states) {
        this.states = states
    }

    handleAction () {
        console.log('saving', this.state.layout.map((comp) => (this.states[comp.componentId])))
    }

    render () {
        const { classes } = this.props
        const { layout } = this.state
        return (
            <DragDropContextProvider backend={HTML5Backend}>
                <div className='container'>
                    <PageContent onDrop={this.updateState.bind(this)} layout={layout} removeFromPage={this.removeFromLayout.bind(this)} />
                    <ComponentsSidebar changeLayout={this.changeLayout.bind(this)}/>
                    <Button fab color="primary" aria-label="new" onClick={this.handleAction.bind(this)}>
                        <SaveIcon />
                    </Button>
                </div>
            </DragDropContextProvider>
        )
    }
}

export default NewDrinkingGame
