import { createMuiTheme } from 'material-ui/styles'
import blue from 'material-ui/colors/blue'

const muiTheme = createMuiTheme({
  palette: {
    primary: Object.assign(
        blue,
        { A400: '#0074b7' }
    ),
    secondary: Object.assign(
        blue,
        { A400: '#0074b7' }
    )
  },
  overrides: {
    MuiListSubheader: {
        root: {
            lineHeight: '30px'
        }
    }
  }
})

export default muiTheme
