import React from 'react'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import EditIcon from 'material-ui-icons/Edit'
import axios from 'axios'
import UserModal from './UserModal.js'
import Loader from '../lib/MainLoader'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  }),
  toolbarHeader: {
    flex: 1
  }
})

class UsersControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = { users: [], loaded: false }
  }

  componentDidMount () {
    axios.get('/api/user')
      .then((res) => {
        this.setState({ loaded: true, users: res && res.data })
      })
      .catch(console.error)
  }

  handleEdit (state) {
    console.log(state, state.roles)
    axios(`/api/user/${state._id}/roles`, { method: 'PATCH', data: state.roles })
      .then((res) => {
        console.log('okay', res)
      })
      .catch(console.error)

  }

  render () {
    const { classes } = this.props
    const { users, loaded } = this.state
    return (
      <Loader loaded={loaded}>
        <div className='container'>
          <Paper className={classes.root}>
            <Toolbar>
              <Typography type="title" color="inherit" className={classes.toolbarHeader}>
                Users
              </Typography>
            </Toolbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users && users.map((user) => (
                  <TableRow key={user._id} role='checkbox' hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.roles.map((r) => r.name).join(', ') || 'Guest'}</TableCell>
                    <TableCell>
                      <UserModal user={user} handleSubmit={this.handleEdit.bind(this)}>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </UserModal>
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
