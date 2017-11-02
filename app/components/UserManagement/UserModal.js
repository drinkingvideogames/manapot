import React from 'react'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import { FormGroup, FormControlLabel, FormLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import axios from 'axios'
import UserRolesMenu from './UserRolesMenu'

const styles = theme => ({
  formHeading: {
    display: 'block',
    textTransform: 'capitalize',
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  checkboxLabel: {
    textTransform: 'capitalize'
  }
})

class EditDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = Object.assign({ open: false, loaded: false, availableRoles: [] }, props.user)
  }

  componentDidMount () {
    axios.get('/api/role')
      .then((res) => {
        this.setState({ loaded: true, availableRoles: res && res.data })
      })
      .catch(console.error)
  }

  handleClickOpen () {
    this.setState({ open: true })
  }

  handleRequestClose (save) {
    const { handleSubmit } = this.props
    if (save && handleSubmit) {
      handleSubmit(this.state)
    }
    this.setState({ open: false })
  }

  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  changeRoles (role) {
    if (role) {
      const { roles } = this.state
      const roleSet = new Set(roles)
      roleSet.add(role._id)
      this.setState({ roles: [ ...roleSet ] })
    }
  }

  render() {
    const { classes, children } = this.props
    const { open, _id, name, availableRoles } = this.state
    const embellishedChildren = React.Children.map(children, (child) => (
      React.cloneElement(child, { onClick: this.handleClickOpen.bind(this) })
    ))
    const title = `${_id ? 'Edit' : 'New'} User`
    return (
      <span>
        {embellishedChildren}
        <Dialog open={open} onRequestClose={this.handleRequestClose.bind(this)}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <FormGroup>
              <TextField
                type='text'
                name='name'
                id='name'
                value={name}
                margin='normal'
                placeholder='Username'
                label='Username'
                onChange={this.handleChange.bind(this)}
                disabled={!!_id}
              />
              <UserRolesMenu options={availableRoles} onChange={this.changeRoles.bind(this)} />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose.bind(this)} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleRequestClose.bind(this, true)} raised color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    )
  }
}

export default withStyles(styles)(EditDialog)
