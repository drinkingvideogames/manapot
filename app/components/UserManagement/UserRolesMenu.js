import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    background: theme.palette.background.paper,
  },
});

class SimpleListMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      anchorEl: null,
      open: false,
      selectedIndex: 0
    }
  }

  handleClickListItem (event) {
    this.setState({ open: true, anchorEl: event.currentTarget })
  }

  handleMenuItemClick (event, index) {
    this.setState({ selectedIndex: index, open: false }, () => {
      const { onChange, options } = this.props
      if (onChange) onChange(options[index], options, index)
    })
  }

  handleRequestClose () {
    this.setState({ open: false })
  }

  render () {
    const { options, classes } = this.props
    const { anchorEl, open, selectedIndex } = this.state
    return (
      <div className={classes.root}>
        <List>
          <ListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label="When device is locked"
            onClick={this.handleClickListItem.bind(this)}
          >
            <ListItemText
              primary="User Role"
              secondary={options && options[selectedIndex].name}
            />
          </ListItem>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={open}
          onRequestClose={this.handleRequestClose.bind(this)}
        >
          {options && options.map((option, index) => (
            <MenuItem
              key={option._id}
              selected={index === selectedIndex}
              onClick={event => this.handleMenuItemClick(event, index)}
            >
              {option.name}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

SimpleListMenu.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleListMenu)
