import React from 'react'
import IconButton from 'material-ui/IconButton'
import ClearIcon from 'material-ui-icons/Clear'
import DragIcon from 'material-ui-icons/DragHandle'

export default function Toolbar ({ settings, canDrag, canDelete, onDelete, connectDragSource }) {
    return (
        <div className="toolbar">
            {settings}
            { canDrag && connectDragSource ? connectDragSource(<span><DragIcon /></span>) : null }
            { canDelete ? <IconButton onClick={onDelete}><ClearIcon /></IconButton> : null }
        </div>
    )
}
