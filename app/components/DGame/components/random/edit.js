import React from 'react'
import uuid from 'uuid'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Chip from 'material-ui/Chip'
import IconButton from 'material-ui/IconButton'
import AddIcon from 'material-ui-icons/Add'
import Toolbar from '../parts/Toolbar'
import ContentEditable from '../../../lib/ContentEditable'

class EditRandomSelectorComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = Object.assign({ options: [ { id: uuid(), text: 'Option' } ] }, props.initialState)
    }

    handleNew () {
        const { options } = this.state
        this.setState({ options: options.concat([ { id: uuid(), text: 'Option' } ]) })
    }

    handleDestroy () {
        const { destroy } = this.props
        if (destroy) destroy()
    }

    handleTextChange (i, e, text) {
        const { options } = this.state
        const tempOptions = [].concat(options)
        tempOptions[i].text = text
        this.setState({ options: tempOptions })
    }

    handleTextClick (i, e) {
        const { options } = this.state
        if (options[i].text === 'Option') {
            const tempOptions = [].concat(options)
            tempOptions[i].text = ''
            this.setState({ options: tempOptions })
        }
    }

    handleTextBlur (i, e) {
        const { options } = this.state
        if (options[i].text === '') {
            const tempOptions = [].concat(options)
            tempOptions[i].text = 'Option'
            this.setState({ options: tempOptions })
        }
    }

    render () {
        const { connectDragSource } = this.props
        const { options } = this.state
        return (
            <div>
                <Grid container justify='center' align='center'>
                    <Grid item xs={6}>
                        <Grid container justify='center' align='center' spacing={24}>
                            {options.map((option, i) => (
                                <Grid item key={`${i}-${option.id}`}>
                                    <div className='chip'>
                                        {options.id}
                                        <ContentEditable
                                            singleLine
                                            html={option.text}
                                            onClick={/*this.handleTextClick.bind(this, i)*/console.log}
                                            onChange={this.handleTextChange.bind(this, i)}
                                            onBlur={/*this.handleTextBlur.bind(this, i)*/console.log}
                                            name='text'
                                            contentEditable='plaintext-only'
                                        />
                                    </div>
                                </Grid>
                            ))}
                            <Grid item>
                                <IconButton onClick={this.handleNew.bind(this)}>
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
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

export default EditRandomSelectorComponent
