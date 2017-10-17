import React from 'react'
import { DropTarget } from 'react-dnd'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import WrappedDraggableComponent from './WrappedDraggableComponent'

const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16
  })
})

const pageTarget = {
  drop (props, monitor, component) {
    const item = monitor.getItem()
    const isOver = monitor.isOver()
    const isOverCurrent = monitor.isOver({ shallow: true })
    component.props.onDrop.call(component, component.layoutRefs)
    if (isOver && isOverCurrent) {
        component.props.changeLayout(item.component)
    }
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true })
  }
}

class Page extends React.Component {
    constructor (props) {
        super(props)
        this.layoutRefs = {}
    }

    render () {
        const { connectDropTarget, classes, layout, removeFromPage, moveItem } = this.props
        return connectDropTarget(
            <div>
                <Paper className={classes.paper}>
                    {layout && layout.length > 0 ? null : <div style={{ textAlign: 'center' }}>Drag items here to build the page</div>}
                    {layout.map((component, i) => {
                        return (
                            <WrappedDraggableComponent
                                component={component}
                                i={i}
                                moveItem={moveItem}
                                remove={removeFromPage}
                                key={component.componentId}
                                ref={(wrappedComp) => {
                                    this.layoutRefs[component.componentId] = getWrappedComponentInstance(wrappedComp)
                                }}
                            />
                        )
                    })}
                </Paper>
            </div>
        )
    }
}

function getWrappedComponentInstance (wrappedComp) {
    return (wrappedComp && wrappedComp.decoratedComponentInstance && wrappedComp.decoratedComponentInstance.decoratedComponentInstance) || wrappedComp
}

const PageContent = withStyles(styles)(DropTarget('component', pageTarget, collect)(Page))

export default PageContent
