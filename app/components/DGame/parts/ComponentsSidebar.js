import React from 'react'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, { ListSubheader } from 'material-ui/List'
import components from '../components'
import ComponentDragItem from './ComponentDragItem'

const styles = theme => ({
  root: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 150,
    position: 'fixed',
    right: theme.spacing.unit * 5,
    top: theme.spacing.unit * 10
  }
})

const ComponentSidebar = ({ classes, changeLayout }) => {
    return (
        <Paper className={classes.root}>
            <List>
                <ListSubheader>Components</ListSubheader>
                {Object.keys(components).map((compName) => (
                    <ComponentDragItem key={compName} componentKey={compName} component={components[compName]} changeLayout={changeLayout} />
                ))}
            </List>
        </Paper>
    )
}

export default withStyles(styles)(ComponentSidebar)
