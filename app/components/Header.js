import React from 'react'
import PropTypes from 'prop-types'
import { IndexLink, Link } from 'react-router'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
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
  }
})

class Header extends React.Component {
  handleLogout (event) {
    event.preventDefault()
    this.props.dispatch(logout())
  }

  render () {
    const { user } = this.props
    const classes = this.props.classes
    const rightNav = this.props.token ? (
      <div className={classes.navRight}>
        <IndexLink to='/contact'><Button color='contrast'>Contact</Button></IndexLink>
        <Link to='/account'>
          <Button color='contrast'>
            {user.name || user.email}
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
        <AppBar position='static'>
          <Toolbar>
            <IconButton color='contrast' aria-label='Menu'>
              <MenuIcon />
            </IconButton>
            <Typography type='title'>
              <IndexLink to='/' className={classes.white}>
                Manapot
              </IndexLink>
            </Typography>
            <GameAutosuggest />
            <div className={classes.navLeft}>
              {user && user.permissions && user.permissions.includes('admin:all') ? (
                [ <IndexLink to='/users' key='users'><Button color='contrast'>Users</Button></IndexLink>,
                  <IndexLink to='/users/roles' key='roles'><Button color='contrast'>Roles</Button></IndexLink>
                ]
              ) : null}
            </div>
            {rightNav}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(Header))
