import React from 'react'
import CollectionIcon from 'material-ui-icons/Collections'
import Toolbar from '../parts/Toolbar'
import { AssetControl } from '../../../Asset'

class EditImageComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = Object.assign({ image: null }, props.initialState)
    }

    handleChange (images, tmpImages) {
        this.setState({ image: images[0] || tmpImages[0] || null })
    }

    handleDestroy () {
        const { destroy } = this.props
        if (destroy) destroy()
    }

    render () {
        const { connectDragSource } = this.props
        const { image } = this.state
        return (
            <div>
                <AssetControl onChange={this.handleChange.bind(this)}>
                    {image && (image.file || image.preview) ? <img src={image.file ? image.file.url : image.preview} /> : <div className='placeholder'><CollectionIcon /></div>}
                </AssetControl>
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
