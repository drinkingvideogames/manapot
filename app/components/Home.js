import React from 'react'
import { connect } from 'react-redux'
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles'
import Messages from './Messages'
import DrinkCard from './DrinkCard'

const styles = theme => ({
  container: {
    marginTop: '20px'
  }
})

class Home extends React.Component {
  render () {
    const classes = this.props.classes;
    return (
      <Grid container className={classes.container}>
        <Messages messages={this.props.messages} />
        <Grid item xs={12}>
          <Grid container justify="center" spacing={8}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
              <Grid key={value} item>
                <DrinkCard />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Home))
