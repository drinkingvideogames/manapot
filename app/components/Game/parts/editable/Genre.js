import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Avatar from 'material-ui/Avatar'
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import AddIcon from 'material-ui-icons/Add'
import TextField from 'material-ui/TextField'
import axios from 'axios'

class GenreDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      openNew: false
    }
  }

  handleRequestClose () {
    this.props.onRequestClose(this.props.selectedValue)
  };

  handleListItemClick (value) {
    if (value === 'addNew') {
      this.setState({ openNew: true })
    } else {
      this.props.onRequestClose(value)
    }
  };

  handleRequestCloseNewGenre (action, value) {
    this.setState({ openNew: false }, () => {
      if (action === 'create') this.props.onRequestClose(value)
    })
  }

  render () {
    const { classes, onRequestClose, selectedValue, genres, ...props } = this.props
    return (
      <Dialog onRequestClose={this.handleRequestClose.bind(this)} {...props}>
        <NewGenreDialog
          open={this.state.openNew}
          onRequestClose={this.handleRequestCloseNewGenre.bind(this)}
        />
        <DialogTitle>Select Genre</DialogTitle>
        <div>
          <List>
            {(genres || []).map(genre => (
              <ListItem button onClick={() => this.handleListItemClick(genre)} key={genre._id}>
                <ListItemText primary={genre.name} />
              </ListItem>
            ))}
            <ListItem button onClick={() => this.handleListItemClick('addNew')}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Add genre' />
            </ListItem>
          </List>
        </div>
      </Dialog>
    )
  }
}

class NewGenreDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleCreate () {
    const { onRequestClose } = this.props
    axios.post('/api/genre', this.state)
      .then(() => {
        onRequestClose('create', this.state.name)
      })
      .catch(console.error)
  }

  render () {
    const { onRequestClose, ...props } = this.props
    return (
      <Dialog onRequestClose={() => { onRequestClose('cancel') }} {...props}>
        <DialogTitle>Create Genre</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
              label='Name'
              placeholder='Name'
              type='text'
              margin='normal'
              value={this.state.name}
              onChange={this.handleChange.bind(this)}
              name='name'
              autoFocus
              required
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { onRequestClose('cancel') }}>Cancel</Button>
          <Button raised color='primary' onClick={this.handleCreate.bind(this)}>Create</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

GenreDialog.propTypes = {
  onRequestClose: PropTypes.func,
  selectedValue: PropTypes.object
}

class SimpleDialogDemo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      genres: []
    }
  }

  componentDidMount (props) {
    const { genre } = this.props
    axios.get('/api/genre')
      .then((res) => {
        const genres = res && res.data
        let selectedValue
        if (genre && genres) {
          selectedValue = genres.find((g) => (g._id === genre._id))
        }
        this.setState({ genres, selectedValue })
      })
      .then(console.error)
  }

  handleClickOpen () {
    this.setState({
      open: true
    })
  };

  handleRequestClose (value) {
    this.setState({ selectedValue: value, open: false }, () => {
      this.props.onChange({ genre: value })
    })
  };

  render () {
    const { selectedValue, open, genres } = this.state
    return (
      <div className={this.props.className}>
        <Button raised color='accent' onClick={this.handleClickOpen.bind(this)}>{selectedValue && selectedValue.name || 'Select a genre'}</Button>
        <GenreDialog
          genres={genres}
          selectedValue={selectedValue}
          open={open}
          onRequestClose={this.handleRequestClose.bind(this)}
        />
      </div>
    )
  }
}

export default SimpleDialogDemo
