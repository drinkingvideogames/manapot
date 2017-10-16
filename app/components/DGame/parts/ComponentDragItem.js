import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import { withStyles } from 'material-ui/styles'
import { ListItem, ListItemText } from 'material-ui/List'
import Chip from 'material-ui/Chip'
import uuid from 'uuid'

const itemSource = {
    beginDrag (props) {
        const { component } = props
        const componentId = uuid()
        return { component: Object.assign({ componentId }, component) }
    },
    endDrag (props, monitor) {
        const { component } = monitor.getItem()
        const dropped = monitor.didDrop()

        if (!dropped) return

        props.changeLayout(component)
    }
}

const styles = theme => ({
  root: {
    backgroundColor: 'transparent',
    display: 'inline-block',
    margin: theme.spacing.unit
  },
  chip: {
    cursor: 'pointer'
  }
})

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

const DragItem = ({ connectDragSource, connectDragPreview, component, classes }) => {
    connectDragPreview(<div>Drag me</div>)
    return connectDragSource(
        <div className={classes.root}>
            <Chip className={classes.chip} label={component.name} />
        </div>
    )
}

DragItem.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default DragSource('component', itemSource, collect)(withStyles(styles)(DragItem))
