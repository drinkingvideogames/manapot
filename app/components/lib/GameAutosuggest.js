import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar'
import { MenuItem } from 'material-ui/Menu'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { withStyles } from 'material-ui/styles'
import { filterGames, loadGames } from '../../actions/games'

function renderInput (inputProps) {
  const { classes, autoFocus, value, ref, ...other } = inputProps

  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...other
      }}
    />
  )
}

function renderSuggestion (suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query)
  const parts = parse(suggestion.label, matches)
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {suggestion.icon && <Avatar style={{ float: 'left', marginRight: '10px', marginTop: '5px' }} src={suggestion.icon} />}
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={index} style={{ fontWeight: 300, lineHeight: '50px' }}>
              {part.text}
            </span>
          ) : (
            <strong key={index} style={{ fontWeight: 500, lineHeight: '50px' }}>
              {part.text}
            </strong>
          )
        })}
      </div>
    </MenuItem>
  )
}

function renderSuggestionsContainer (options) {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  )
}

function getSuggestionValue (suggestion) {
  return suggestion.label
}

function getSuggestions (dispatch, items, value) {
  const inputValue = value.trim().toLowerCase()
  dispatch(filterGames(inputValue))
  const inputLength = inputValue.length
  let count = 0

  return inputLength === 0
    ? []
    : items.map((i) => ({ label: i.name, icon: i.banner && i.banner.file && i.banner.file.url })).filter(suggestion => {
        const keep =
          count < 3 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue

        if (keep) {
          count += 1
        }

        return keep
      })
}

const styles = (theme) => ({
  container: {
    position: 'relative',
    marginLeft: theme.spacing.unit * 5,
    width: 400
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 999
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  input: {
    color: '#ffffff'
  },
  textField: {
    width: '100%'
  },
})

class IntegrationAutosuggest extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: '', suggestions: [] }
  }

  componentDidUpdate (prevProps, prevState) {
    const { dispatch } = this.props
    const { value } = this.state
    if (prevState.value !== value && value === '') {
      dispatch(loadGames())
    }
  }

  handleSuggestionsFetchRequested ({ value }) {
    const { dispatch, games } = this.props
    this.setState({
      suggestions: getSuggestions(dispatch, games.items, value)
    })
  }

  handleSuggestionsClearRequested () {
    const { dispatch } = this.props
    const { value } = this.state
    if (value) dispatch(filterGames(value))
    this.setState({
      suggestions: [],
    })
  }

  handleChange (event, { newValue }) {
    this.setState({
      value: newValue
    })
  }

  render () {
    const { classes, games } = this.props
    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested.bind(this)}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested.bind(this)}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          autoFocus: true,
          classes,
          placeholder: 'Search for a game...',
          value: this.state.value,
          onChange: this.handleChange.bind(this)
        }}
      />
    )
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return {
    games: state.games
  }
}

export default connect(mapStateToProps)(withStyles(styles)(IntegrationAutosuggest))
