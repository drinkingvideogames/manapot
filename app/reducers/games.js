const INITIAL_STATE = {
  loaded: false,
  items: [],
  query: ''
}

export function games (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'LOAD_GAMES':
      return Object.assign({}, state, { loaded: true, items: [...action.games], query: action.query })
    case 'FILTER_GAMES':
      return Object.assign({}, state, { loaded: true, items: [...action.games], query: action.query })
    case 'REFRESH_GAMES':
      return Object.assign({}, state, { loaded: true, items: [...action.games] })
    default:
      return state
  }
}
