import React from 'react'
import Typography from 'material-ui/Typography'
import { Editor, EditorState, convertFromRaw } from 'draft-js'

export default ({ hydrationState }) => {
    const { raw } = hydrationState
    if (raw && raw.blocks && !raw.entityMap) {
        raw.entityMap = {}
    }
    return(
        raw && raw.blocks && raw.entityMap ? <Editor editorState={EditorState.createWithContent(convertFromRaw(raw))} readOnly /> : null
    )
}
