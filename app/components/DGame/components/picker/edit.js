import React from 'react'
import Typography from 'material-ui/Typography'
import Toolbar from '../parts/Toolbar'

class EditNamePickerComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = { names: [] }
    }

    handleDestroy () {
        const { destroy } = this.props
        if (destroy) destroy()
    }

    render () {
        const { names } = this.state
        return (
            <div>
                <Typography type='display1'>
                    {names.length} names
                </Typography>
                <Toolbar
                    canDrag
                    canDelete
                    onDelete={this.handleDestroy.bind(this)}
                />
            </div>
        )
    }
}

export default EditNamePickerComponent
