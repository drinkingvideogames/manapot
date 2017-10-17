import React from 'react'
import CollectionIcon from 'material-ui-icons/Collections'
import Toolbar from '../parts/Toolbar'

class EditImageComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = { image: null }
    }

    handleDestroy () {
        const { destroy } = this.props
        if (destroy) destroy()
    }

    render () {
        const { connectDragSource } = this.props
        return (
            <div>
                <CollectionIcon />
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

export default EditImageComponent