import fetch from '../lib/fetch'

export function loadGames () {
  return (dispatch) => {
    return fetch('/api/game')
      .then((response) => {
        if (response.ok) {
          return response.json().then((json) => {
            dispatch({
              type: 'LOAD_GAMES',
              games: json.docs,
              query: ''
            })
          })
        } else {
          return response.json().then((json) => {
            dispatch({
              type: 'LOAD_GAMES_FAILURE',
              games: Array.isArray(json) ? json : [json],
              query: ''
            })
          })
        }
      })
  }
}

export function filterGames (query) {
  return (dispatch) => {
    return fetch(`/api/game?q=${encodeURIComponent(query)}`)
      .then((response) => {
        if (response.ok) {
          return response.json().then((json) => {
            dispatch({
              type: 'FILTER_GAMES',
              games: json.docs,
              query
            })
          })
        } else {
          return response.json().then((json) => {
            dispatch({
              type: 'FILTER_GAMES_FAILURE',
              games: Array.isArray(json) ? json : [json],
              query
            })
          })
        }
      })
  }
}

export function refreshGames (currentState) {
  return (dispatch) => {
    return fetch(`/api/game?q=${encodeURIComponent(currentState.query)}`)
      .then((response) => {
        if (response.ok) {
          return response.json().then((json) => {
            dispatch({
              type: 'REFRESH_GAMES',
              games: json.docs
            })
          })
        } else {
          return response.json().then((json) => {
            dispatch({
              type: 'REFRESH_GAMES_FAILURE',
              games: Array.isArray(json) ? json : [json]
            })
          })
        }
      })
  }
}
