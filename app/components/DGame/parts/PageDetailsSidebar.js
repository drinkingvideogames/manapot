import React from 'react'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import SaveIcon from 'material-ui-icons/Save'
import Drawer from 'material-ui/Drawer'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import List, { ListSubheader } from 'material-ui/List'
import { BlockPicker } from 'react-color'

const styles = theme => ({
  sidebar: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 150,
    position: 'fixed',
    right: theme.spacing.unit * 5,
    top: theme.spacing.unit * 10
  },
  drawerContent: {
    textAlign: 'center',
    padding: theme.spacing.unit * 2
  },
  itemContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerItem: {
    display: 'inline-block',
    margin: theme.spacing.unit,
    position: 'relative'
  },
  detailHeading: {
    paddingBottom: theme.spacing.unit
  },
  textField: {
    left: '50%',
    position: 'relative',
    transform: 'translateX(-50%)'
  }
})

class PageDetailsSidebar extends React.Component {
  constructor (props) {
    super(props)
    if (props.dgame) {
      const { name, url, mainColour, bgColour } = props.dgame
      this.state = { name, url, mainColour, bgColour, open: false }
    } else {
      this.state = {
        name: '',
        url: '',
        mainColour: '#2196f3',
        bgColour: '#FFFFFF',
        open: false
      }
    }
  }

  handleOpen () {
    this.setState({ open: true })
  }

  handleClose () {
    this.setState({ open: false })
  }

  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleColourChange (field, colour) {
    this.setState({ [field]: colour.hex }, () => {
      const { mainColour, bgColour } = this.state
      document.body.querySelector('#app > div > div > header').style = `background: ${mainColour}`
      document.body.style = `background: ${bgColour}`
    })
  }

  render () {
    const { classes, changeLayout } = this.props
    const { name, url, mainColour, bgColour, open } = this.state
    return (
      <div>
        <Paper className={classes.sidebar}>
            <List>
                <ListSubheader>
                    <div>Game Details</div>
                </ListSubheader>
                <Button raised color="primary" aria-label="details" onClick={this.handleOpen.bind(this)}>Edit</Button>
            </List>
        </Paper>
        <Drawer
          anchor="bottom"
          open={open}
          onRequestClose={this.handleClose.bind(this)}
          ModalProps={{ backdropInvisible: true }}
        >
          <div className={classes.drawerContent}>
            <Typography type="display1">Details</Typography>
            <div className={classes.itemContainer}>
              <span className={classes.drawerItem}>
                <TextField
                  id="name"
                  name="name"
                  label="Name"
                  margin="normal"
                  className={classes.textField}
                  value={name}
                  onChange={this.handleChange.bind(this)}
                />
              </span>
              <span className={classes.drawerItem}>
                <TextField
                  id="url"
                  name="url"
                  label="Url"
                  margin="normal"
                  className={classes.textField}
                  value={url}
                  onChange={this.handleChange.bind(this)}
                />
              </span>
              <span className={classes.drawerItem}>
                <Typography className={classes.detailHeading} type="caption">Main Colour</Typography>
                <BlockPicker
                  color={mainColour}
                  onChangeComplete={this.handleColourChange.bind(this, 'mainColour')}
                  colors={['#1976d2', '#2196f3', '#D9E3F0', '#F47373', '#697689', '#37D67A', '#555555', '#dce775', '#ff8a65', '#ba68c8']}
                  triangle="hide"
                />
              </span>
              <span className={classes.drawerItem}>
                <Typography className={classes.detailHeading} type="caption">Background Colour</Typography>
                <BlockPicker
                  color={bgColour}
                  onChangeComplete={this.handleColourChange.bind(this, 'bgColour')}
                  colors={['#1976d2', '#2196f3', '#D9E3F0', '#F47373', '#697689', '#37D67A', '#555555', '#dce775', '#ff8a65', '#ba68c8']}
                  triangle="hide"
                />
              </span>
            </div>
          </div>
        </Drawer>
      </div>
    )
  }
}

export default withStyles(styles)(PageDetailsSidebar)
