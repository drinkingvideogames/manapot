import React from 'react'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import List, { ListSubheader, ListItem } from 'material-ui/List'
import { BlockPicker } from 'react-color'

const styles = theme => ({
    root: {
        textAlign: 'center',
        width: '100%',
        maxWidth: '16vw',
        position: 'fixed',
        left: theme.spacing.unit * 5,
        top: theme.spacing.unit * 10
    },
        detailHeading: {
        width: '50%'
    },
    textField: {
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)'
    }
})

class PageDetailsSidebar extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            name: '',
            url: '',
            mainColour: '#2196f3',
            bgColour: '#FFFFFF'
        }
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
        const { name, url, mainColour, bgColour } = this.state
        return (
            <Paper className={classes.root}>
                <List>
                    <ListSubheader>Details</ListSubheader>
                    <ListItem>
                        <TextField
                          id="name"
                          name="name"
                          label="Name"
                          margin="normal"
                          className={classes.textField}
                          value={name}
                          onChange={this.handleChange.bind(this)}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                          id="url"
                          name="url"
                          label="Url"
                          margin="normal"
                          className={classes.textField}
                          value={url}
                          onChange={this.handleChange.bind(this)}
                        />
                    </ListItem>
                    <ListItem>
                        <Typography className={classes.detailHeading} type="caption">Main Colour</Typography>
                        <BlockPicker
                            color={mainColour}
                            onChangeComplete={this.handleColourChange.bind(this, 'mainColour')}
                            colors={['#1976d2', '#2196f3', '#D9E3F0', '#F47373', '#697689', '#37D67A', '#555555', '#dce775', '#ff8a65', '#ba68c8']}
                            triangle="hide"
                        />
                    </ListItem>
                    <ListItem>
                        <Typography className={classes.detailHeading} type="caption">Background Colour</Typography>
                        <BlockPicker
                            color={bgColour}
                            onChangeComplete={this.handleColourChange.bind(this, 'bgColour')}
                            colors={['#1976d2', '#2196f3', '#D9E3F0', '#F47373', '#697689', '#37D67A', '#555555', '#dce775', '#ff8a65', '#ba68c8']}
                            triangle="hide"
                        />
                    </ListItem>
                </List>
            </Paper>
        )
    }
}

export default withStyles(styles)(PageDetailsSidebar)
