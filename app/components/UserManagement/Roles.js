import React from 'react'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add'
import EditIcon from 'material-ui-icons/Edit'
import Chip from 'material-ui/Chip'
import axios from 'axios'
import Loader from '../lib/MainLoader'
import RoleModal from './RoleModal'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  }),
  toolbarHeader: {
    flex: 1
  },
  permRow: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  perm: {
    margin: theme.spacing.unit
  }
})

class UsersControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = { users: [], loaded: false }
  }

  componentDidMount () {
    axios.get('/api/role')
      .then((res) => {
        this.setState({ loaded: true, roles: res && res.data })
      })
      .catch(console.error)
  }

  handleNew (state) {
    const data = { name: state.name, permissions: [ ...state.selected ] }
    axios('/api/role/', { method: 'POST', credentials: 'same-origin', data })
        .then((res) => {
          console.log('RES', res);
        })
        .catch(console.error)
  }

  render () {
    const { classes } = this.props
    const { roles, loaded } = this.state
    return (
      <Loader loaded={loaded}>
        <div className='container'>
          <Paper className={classes.root}>
            <Toolbar>
              <Typography type="title" color="inherit" className={classes.toolbarHeader}>
                Roles
              </Typography>
              <RoleModal handleSubmit={this.handleNew.bind(this)}>
                <IconButton color='primary'>
                  <AddIcon />
                </IconButton>
              </RoleModal>
            </Toolbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Number of Users</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles && roles.map((role) => (
                  <TableRow key={role._id} role='checkbox' hover>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{'0'}</TableCell>
                    <TableCell className={classes.permRow}>
                      {role.permissions && role.permissions.map((p) => (<Chip key={p} label={p} className={classes.perm} />)) || 'None'}
                    </TableCell>
                    <TableCell>
                      <RoleModal>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </RoleModal>
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </Loader>
    )
  }
}

export default withStyles(styles)(UsersControl)
