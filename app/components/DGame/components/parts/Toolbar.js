import React from 'react'
import IconButton from 'material-ui/IconButton'
import ClearIcon from 'material-ui-icons/Clear'
import DragIcon from 'material-ui-icons/DragHandle'

export default function Toolbar ({ settings, canDrag, canDelete, onDelete }) {
    return (
        <div className="toolbar">
            {settings}
            { canDrag ? <IconButton><DragIcon /></IconButton> : null }
            { canDelete ? <IconButton onClick={onDelete}><ClearIcon /></IconButton> : null }
        </div>
    )
}
