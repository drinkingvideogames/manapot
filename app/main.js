import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import muiTheme from './customTheme'
import configureStore from './store/configureStore'
import getRoutes from './routes'

const store = configureStore(window.INITIAL_STATE)

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={muiTheme}>
      <Router history={browserHistory} routes={getRoutes(store)} />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app')
)
