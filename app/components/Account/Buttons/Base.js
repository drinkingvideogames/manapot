import React from 'react'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import Icon from 'material-ui/Icon'

function BaseButton ({ icon, classes, filled, ...props }) {
  return (
    <IconButton className={filled ? classes && classes.block : classes && classes.normal} {...props}>
      <Icon className={`fa fa-${icon}`} />
    </IconButton>
  )
}

function BaseButtonWrap ({ styles, ...props }) {
  const Component = withStyles(styles)(BaseButton)
  return (<Component {...props} />)
}

export default BaseButtonWrap
