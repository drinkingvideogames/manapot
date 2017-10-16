import React from 'react'
import { Editor, EditorState } from 'draft-js'
import Toolbar from '../parts/Toolbar'

class EditTextComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = { editorState: EditorState.createEmpty() }
        this.onChange = (editorState) => this.setState({ editorState })
    }

    handleDestroy () {
        const { destroy } = this.props
        if (destroy) destroy()
    }

    render () {
        return(
            <div>
                <Editor editorState={this.state.editorState} onChange={this.onChange} />
                <Toolbar
                    canDrag
                    canDelete
                    onDelete={this.handleDestroy.bind(this)}
                />
            </div>
        )
    }
}

export default EditTextComponent
