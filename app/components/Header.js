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

import { logout } from '../actions/auth'

const styles = theme => ({
  root: {

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
    const classes = this.props.classes;
    const rightNav = this.props.token ? (
      <div className={classes.navRight}>
        <Button color="contrast">
          <img className='avatar' src={this.props.user.picture || this.props.user.gravatar} />
          {' '}{this.props.user.name || this.props.user.email || this.props.user.id}{' '}
        </Button>
        <Link to='/account'><Button color="contrast">My Account</Button></Link>
        <a href='#' onClick={this.handleLogout.bind(this)}><Button color="contrast">Logout</Button></a>
      </div>
    ) : (
      <div className={classes.navRight}>
        <Link to='/login'><Button color="contrast">Log in</Button></Link>
        <Link to='/signup'><Button color="contrast">Sign up</Button></Link>
      </div>
    )
    // return (
    //   <div className='container'>
    //     <ul className='list-inline'>
    //       <li><IndexLink to='/'>Home</IndexLink></li>
    //       <li><Link to='/contact'>Contact</Link></li>
    //     </ul>
    //     {rightNav}
    //   </div>
    // )

    return (
      <div >
        <AppBar position="static">
          <Toolbar>
            <IconButton color="contrast" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography type="title" color="inherit">
              Manapot
            </Typography>
            <div className={classes.navLeft}>
              <IndexLink to='/'><Button color="contrast">Home</Button></IndexLink>
              <IndexLink to='/contact'><Button color="contrast">Contact</Button></IndexLink>
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
  classes: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(withStyles(styles)(Header))
