import React from 'react'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import AddIcon from 'material-ui-icons/Add'
import Toolbar from '../parts/Toolbar'

class EditRandomSelectorComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = { options: [ { text: 'Option' } ] }
    }

    handleNew () {
        const { options } = this.state
        this.setState({ options: options.concat([ { text: 'Option' } ]) })
    }

    handleDestroy () {
        const { destroy } = this.props
        if (destroy) destroy()
    }

    render () {
        const { options } = this.state
        return (
            <div>
                <Grid container justify='center' align='center'>
                    <Grid item xs={6}>
                        <Grid container justify='center' align='center' spacing={24}>
                            {options.map((option, i) => (
                                <Grid item key={`${i}-${option.text}`}><Typography display='display1'>{option.text}</Typography></Grid>
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
                />
            </div>
        )
    }
}

export default EditRandomSelectorComponent
