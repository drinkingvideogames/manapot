import React from 'react'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'

class Picker extends React.Component {
  constructor (props) {
    super(props)
    this.state = { newOption: '', option: null, options: [ 'Add options' ], toClear: true }
  }

  componentDidMount () {
    const { setOnFinish } = require('./renderRoulette')
    setOnFinish((index, text) => {
      this.setState({ option: index })
    })
    this.updateWheel()
  }

  select () {
    const { spin } = require('./renderRoulette')
    spin()
  }

  clear () {
    this.setState({ options: [ 'Add options' ], toClear: true }, this.updateWheel.bind(this))
  }

  updateWheel () {
    const { drawRouletteWheel, setOptions } = require('./renderRoulette')
    const { options } = this.state
    setOptions(options)
    drawRouletteWheel()
  }

  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit (e) {
    const { newOption } = this.state
    if (e.key === 'Enter' && newOption) this.addOption()
  }

  addOption () {
    const { newOption, options, toClear } = this.state
    const newOptions = toClear ? [].concat([ newOption ]) : [].concat(options).concat([ newOption ])
    this.setState({ newOption: '', options: newOptions, toClear: false }, this.updateWheel.bind(this))
  }

  render () {
    const { newOption, option, options, toClear } = this.state
    const selectedOption = (!toClear && Number.isInteger(option) && options[option]) || 'Add some names, and press the button!'
    return (
      <div>
        <Grid container spacing={24} style={{ flexGrow: 1 }}>
          <Grid item xs={12}>
            <Typography type="display1">{selectedOption}</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="dense"
              id="newOption"
              name="newOption"
              label="Option"
              type="text"
              value={newOption}
              onChange={this.handleChange.bind(this)}
              onKeyPress={this.handleSubmit.bind(this)}
            />
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'center' }}>
            <Button color="primary" raised onClick={this.addOption.bind(this)}>Add!</Button>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'center' }}>
            <Button color="primary" raised onClick={this.select.bind(this)}>Random!</Button>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'center' }}>
            <Button color="primary" raised onClick={this.clear.bind(this)}>Clear</Button>
          </Grid>
          <canvas id="canvas" width="500" height="500"></canvas>
        </Grid>
      </div>
    )
  }
}

export default Picker
