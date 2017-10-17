import React from 'react'
import Typography from 'material-ui/Typography'
import ContentEditable from '../../../lib/ContentEditable'
import Toolbar from '../parts/Toolbar'

class EditHeadingComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = { text: 'Heading', type: 'display2' }
    }

    handleTextChange (e, text) {
        this.setState({ text })
    }

    handleTextClick (e) {
        const { text } = this.state
        if (!text) this.setState({ text: 'Heading' })
    }

    handleTextBlur (e) {
        const { text } = this.state
        if (text === '') {
            this.setState({ text: 'Heading' })
        }
    }

    handleDestroy () {
        const { destroy } = this.props
        if (destroy) destroy()
    }

    render () {
        const { connectDragSource } = this.props
        const { text, type } = this.state
        return (
            <div>
                <Typography type={type} className='editable'>
                    <ContentEditable
                        html={text}
                        onClick={this.handleTextClick.bind(this)}
                        onChange={this.handleTextChange.bind(this)}
                        onBlur={this.handleTextBlur.bind(this)}
                        name='text'
                        contentEditable='plaintext-only'
                    />
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

export default EditHeadingComponent
