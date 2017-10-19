import React from 'react'
import { Editor, EditorState, convertToRaw } from 'draft-js'
import Toolbar from '../parts/Toolbar'

class EditTextComponent extends React.Component {
    constructor (props) {
        super(props)
        const editorState = EditorState.createEmpty()
        this.state = { editorState: editorState, raw: convertToRaw(editorState.getCurrentContent()) }
        this.onChange = (editorState) => this.setState({ editorState, raw: convertToRaw(editorState.getCurrentContent()) })
    }

    handleDestroy () {
        const { destroy } = this.props
        if (destroy) destroy()
    }

    render () {
        console.log(this.state.raw)
        const { connectDragSource } = this.props
        return(
            <div>
                <Editor editorState={this.state.editorState} onChange={this.onChange} />
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

export default EditTextComponent
