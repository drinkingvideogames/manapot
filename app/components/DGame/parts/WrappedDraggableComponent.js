import React from 'react'
import { findDOMNode } from 'react-dom'
import { DropTarget, DragSource } from 'react-dnd'

const componentTarget = {
    drop (props, monitor, targetComponent) {
        let { i, component } = monitor.getItem()
        const dragIndex = i
        let hoverIndex = props.i
        if (dragIndex === hoverIndex) return
        if (!dragIndex) {
            const hoverBoundingRect = findDOMNode(targetComponent).getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            if (hoverClientY > hoverMiddleY) hoverIndex += 1
        }
        props.moveItem(dragIndex, hoverIndex, getWrappedComponentInstance(component))
        i = hoverIndex
    },
    hover (props, monitor, targetComponent) {
        let { i, component } = monitor.getItem()
        const newItem = !!!i
        const dragIndex = i
        const hoverIndex = props.i
        if (dragIndex === hoverIndex) return
        const hoverBoundingRect = findDOMNode(targetComponent).getBoundingClientRect()
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        const clientOffset = monitor.getClientOffset()
        const hoverClientY = clientOffset.y - hoverBoundingRect.top
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return
    }
}

const componentSource = {
    beginDrag ({ component, i }) {
        return { component, i }
    }
}

function collectComponentTarget (connect) {
    return { connectDropTarget: connect.dropTarget() }
}

function collectComponentSource (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    }
}

class DraggableComponent extends React.Component {
    render () {
        const { component, i, remove, connectDragSource, connectDragPreview, connectDropTarget  } = this.props
        const toRender = React.createElement(component.edit, {
            componentId: component.componentId,
            destroy: () => { if (remove) remove(i) },
            ref: (comp) => { this.component = comp },
            connectDragSource
        })
        return connectDragPreview(connectDropTarget(<div className={`component ${component.classes || ''}`}>{toRender}</div>))
    }
}

function getWrappedComponentInstance (wrappedComp) {
    return (wrappedComp && wrappedComp.decoratedComponentInstance && wrappedComp.decoratedComponentInstance.decoratedComponentInstance) || wrappedComp
}

const WrappedDraggableComponent = DropTarget('component', componentTarget, collectComponentTarget)(DragSource('component', componentSource, collectComponentSource)(DraggableComponent))

export default WrappedDraggableComponent
