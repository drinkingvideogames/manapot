import React from 'react'
import PropTypes from 'prop-types'
import { IndexLink, Link } from 'react-router'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Hidden from 'material-ui/Hidden'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import LastPageIcon from 'material-ui-icons/LastPage'
import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import List, { ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from 'material-ui/List'
import Drawer from 'material-ui/Drawer'
import { logout } from '../actions/auth'
import GameAutosuggest from './lib/GameAutosuggest'

const styles = theme => ({
  white: {
    color: '#FFFFFF'
  },
  navLeft: {
    marginLeft: '24px'
  },
  navRight: {
    position: 'absolute',
    right: '24px'
  },
  sidebar: {
    maxWidth: '80vw',
    width: '300px'
  }
})

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false }
  }

  handleLogout (event) {
    event.preventDefault()
    this.setState({ open: false }, () => {
      this.props.dispatch(logout())
    })
  }

  toggleSidebar (open) {
    this.setState({ open })
  }

  renderSidebar () {
    const { open } = this.state
    const { classes, user, token } = this.props
    return (
      <Drawer open={open} onRequestClose={this.toggleSidebar.bind(this, false)}>
        <List className={classes.sidebar}>
          { user && token ? (
            <Link to='/account'>
              <ListItem button onClick={this.toggleSidebar.bind(this, false)}>
                <ListItemAvatar>
                  <Avatar src={user && (user.picture || user.gravatar)} />
                </ListItemAvatar>
                <ListItemText primary={user.name} />
                <ListItemSecondaryAction>
                  <IconButton onClick={this.handleLogout.bind(this)}>
                    <LastPageIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Link>
          ): null}
          {user && token && user.permissions && user.permissions.includes('admin:all') ? ([
          <Link to='/users' key='sidebarUsers' onClick={this.toggleSidebar.bind(this, false)}>
            <ListItem button>
              <ListItemText primary="Users" />
            </ListItem>
          </Link>,
          <Link to='/users/roles' key='sidebarRoles' onClick={this.toggleSidebar.bind(this, false)}>
            <ListItem button>
              <ListItemText primary="Roles" />
            </ListItem>
          </Link>
          ]) : null
          }
          {token ? ([
            <Link to='/contact' key='sidebarContact' onClick={this.toggleSidebar.bind(this, false)}>
              <ListItem button>
                <ListItemText primary="Contact" />
              </ListItem>
            </Link>,
            <ListItem button onClick={this.handleLogout.bind(this)} key='sidebarLogout'>
              <ListItemText primary="Logout" />
            </ListItem>
          ]) : ([
            <Link to='/login' onClick={this.toggleSidebar.bind(this, false)} key='loginBtn'>
              <ListItem button>
                <ListItemText primary="Log in" />
              </ListItem>
            </Link>,
            <Link to='/signup' onClick={this.toggleSidebar.bind(this, false)} key='signupBtn'>
              <ListItem button>
                <ListItemText primary="Sign up" />
              </ListItem>
            </Link>
          ])}
        </List>
      </Drawer>
    )
  }

  render () {
    const { user, controlledStyles } = this.props
    const classes = this.props.classes
    const rightNav = this.props.token ? (
      <div className={classes.navRight}>
        <Link to='/contact'><Button color='contrast'>Contact</Button></Link>
        <Link to='/account'>
          <Button color='contrast'>
            {user ? user.name || user.email : 'Unknown user'}
          </Button>
        </Link>
        <a href='#' onClick={this.handleLogout.bind(this)}><Button color='contrast'>Logout</Button></a>
      </div>
    ) : (
      <div className={classes.navRight}>
        <Link to='/login'><Button color='contrast'>Log in</Button></Link>
        <Link to='/signup'><Button color='contrast'>Sign up</Button></Link>
      </div>
    )

    return (
      <div >
        <AppBar position='static' style={{ backgroundColor: controlledStyles && controlledStyles.mainBg }}>
          <Toolbar>
            <Hidden mdUp>
            <IconButton color='contrast' aria-label='Menu' onClick={this.toggleSidebar.bind(this, true)}>
              <MenuIcon />
            </IconButton>
            </Hidden>
            <Typography type='title'>
              <IndexLink to='/' className={classes.white}>
                Manapot
              </IndexLink>
            </Typography>
            <Hidden smDown>
            <GameAutosuggest />
            </Hidden>
            <Hidden xsDown>
            <div className={classes.navLeft}>
              {user && user.permissions && user.permissions.includes('admin:all') ? (
                [ <Link to='/users' key='users'><Button color='contrast'>Users</Button></Link>,
                  <Link to='/users/roles' key='roles'><Button color='contrast'>Roles</Button></Link>
                ]
              ) : null}
            </div>
            </Hidden>
            <Hidden xsDown>
            {rightNav}
            </Hidden>
          </Toolbar>
        </AppBar>
        {this.renderSidebar()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user,
    controlledStyles: state.styles
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(Header))
