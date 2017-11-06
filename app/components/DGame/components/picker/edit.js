import React from 'react'
import Typography from 'material-ui/Typography'
import Toolbar from '../parts/Toolbar'

class EditNamePickerComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = {}
    }

    handleDestroy () {
        const { destroy } = this.props
        if (destroy) destroy()
    }

    render () {
        const { connectDragSource } = this.props
        return (
            <div>
                <Typography type='display1'>
                    Roulette Will Appear Here
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

export default EditNamePickerComponent
