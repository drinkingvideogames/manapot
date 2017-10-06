import React from 'react'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import { FormGroup, FormControlLabel, FormLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import axios from 'axios'

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
    this.state = { open: false, loaded: false, roles: {}, selected: new Set(), name: '' }
  }

  componentDidMount () {
    axios.get('/api/role/permissions')
      .then((res) => {
        this.setState({ loaded: true, roles: res && res.data })
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

  changeRole (e) {
    const role = e.target.value
    const { selected } = this.state
    const method = e.target.checked ? 'add' : 'delete'
    selected[method](role)
  }

  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    const { classes, children } = this.props
    const { open, roles, name } = this.state
    const embellishedChildren = React.Children.map(children, (child) => (
      React.cloneElement(child, { onClick: this.handleClickOpen.bind(this) })
    ))
    const title = `${this.props.role ? 'Edit' : 'New'} Role`
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
                placeholder='Role Name'
                label='Role Name'
                onChange={this.handleChange.bind(this)}
              />
              <FormLabel component="legend" className={classes.formHeading}>Permissions</FormLabel>
              {roles && roles.object && Object.keys(roles.object).map((role) => (
                <FormGroup row key={role}>
                  <FormLabel component="legend" className={classes.formHeading}>{role}</FormLabel>
                  {roles.object[role].map((perm) => (
                    <FormControlLabel
                      key={perm}
                      control={<Checkbox value={`${role}:${perm}`} />}
                      onChange={this.changeRole.bind(this)}
                      className={classes.checkboxLabel}
                      label={perm}
                    />
                  ))}
                </FormGroup>
              ))}
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
