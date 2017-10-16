import React from 'react'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import SettingsIcon from 'material-ui-icons/Settings'
import TextField from 'material-ui/TextField'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'

class SettingsYoutubeComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = { open: false, videoId: props.videoId }
    }

    handleRequestOpen () {
        this.setState({ open: true })
    }

    handleRequestClose (save) {
        const { handleSave } = this.props
        if (save && handleSave) {
            handleSave(this.state, () => {
                this.setState({ open: false })
            })
        } else {
            this.setState({ open: false })
        }
    }

    handleChange (e) {
        this.setState({ [e.target.name]: e.target.value.trim() })
    }

    render () {
        const { videoId } = this.state
        return (
            <span>
                <IconButton onClick={this.handleRequestOpen.bind(this)}><SettingsIcon /></IconButton>
                <Dialog open={this.state.open} onRequestClose={this.handleRequestClose.bind(this)}>
                    <DialogTitle>Youtube Component Settings</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            fullWidth
                            margin="dense"
                            id="videoId"
                            name="videoId"
                            label="Youtube ID"
                            type="text"
                            value={videoId}
                            onChange={this.handleChange.bind(this)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleRequestClose.bind(this)} color="primary">
                            Cancel
                        </Button>
                        <Button raised onClick={this.handleRequestClose.bind(this)} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </span>
        )
    }
}

export default SettingsYoutubeComponent
