import React from 'react'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import AddIcon from 'material-ui-icons/Add'
import Toolbar from '../parts/Toolbar'

class EditCounterComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = { label: 'Counter' }
    }

    handleDestroy () {
        const { destroy } = this.props
        if (destroy) destroy()
    }

    render () {
        const { connectDragSource } = this.props
        const { label } = this.state
        return (
            <div>
                <Typography type='display2'>
                    {label}: 0
                    <IconButton>
                        <AddIcon />
                    </IconButton>
                </Typography>
                <Toolbar
                    canDrag
                    canDelete
                    onDelete={this.handleDestroy.bind(this)}
                    connectDragSource={connectDragSource}
                />
            </div>
        )
    }
}

export default EditCounterComponent
