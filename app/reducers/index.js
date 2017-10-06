import { combineReducers } from 'redux'
import messages from './messages'
import auth from './auth'
import games from './games'

export default combineReducers({
  messages,
  auth,
  games
})
