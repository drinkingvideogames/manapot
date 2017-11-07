const INITIAL_STATE = {
  mainColour: '#ffffff',
  mainBg: '#2196f3',
  bg: '#ffffff'
}

export function styles (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'RESET_STYLES':
      document.body.style = ''
      return Object.assign({}, INITIAL_STATE)
    case 'REPLACE_STYLES':
      if (action.styles.bg) document.body.style = `background: ${action.styles.bg}`
      return Object.assign({}, action.styles)
    default:
      return state
  }
}
