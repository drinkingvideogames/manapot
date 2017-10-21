import React from 'react'
import axios from 'axios'
import Loader from '../lib/MainLoader'
import New from './New'

class EditDGame extends React.Component {
  constructor (props) {
    super(props)
    this.state = { loaded: false, dgame: {} }
  }

  componentDidMount () {
    const { params } = this.props
    axios.get(`/api/drink/url/${params.dgame}`)
      .then((res) => {
        this.setState({ loaded: true, dgame: res.data || {} }, () => {
          const { dgame } = this.state
          if (dgame.mainColour) document.body.querySelector('#app > div > div > header').style = `background: ${dgame.mainColour}`
          if (dgame.bgColour) document.body.style = `background: ${dgame.bgColour}`
        })
      })
      .catch(console.error)
  }

  handleEdit (data, game) {
    const { history } = this.props
    const { dgame } = this.state
    axios(`/api/drink/${dgame._id}`, { method: 'PUT', credentials: 'same-origin', data })
      .then((res) => {
        history.replace(`/game/${game}/drink/${data.url}`)
      })
      .catch(console.error)
  }

  render () {
    const { params } = this.props
    const { loaded, dgame } = this.state
    return (
      <Loader loaded={loaded}>
        <New dgame={dgame} handleAction={this.handleEdit.bind(this)} params={params} />
      </Loader>
    )
  }
}

export default EditDGame
