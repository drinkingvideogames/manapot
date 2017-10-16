import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Loader from '../lib/MainLoader'
import NewGame from './New'
import { refreshGames } from '../../actions/games'

class EditGame extends React.Component {
  constructor (props) {
    super(props)
    this.state = { loaded: false, game: {} }
  }

  componentDidMount () {
    const { params } = this.props
    axios.get(`/api/game/url/${params.game}`)
      .then((res) => {
        const game = this.transformServerDataToClientData(res.data && res.data[0])
        this.setState({ loaded: true, game })
      })
      .catch(console.error)
  }

  transformServerDataToClientData (data) {
    if (!data) return {}
    data.banner = {
      preview: `/uploads/${data.images && data.images.banner && data.images.banner[0].filename}`
    }
    data.genre = { _id: data.genreId }
    return data
  }

  cleanData (data) {
    data.delete('genre')
    data.delete('images')
    data.append('images', JSON.stringify(this.state.game.images))
    if (this.state.game.banner && this.state.game.banner.hasOwnProperty('path')) {
      data.delete('banner')
    }
    return data
  }

  handleSave (data) {
    const { history, games } = this.props
    const { game } = this.state
    const cleanedData = this.cleanData(data)
    axios(`/api/game/${game._id}`, { method: 'PUT', credentials: 'same-origin', data: cleanedData })
      .then((res) => {
        if (res.statusText === 'OK' && res.data ) {
          dispatch(refreshGames(games))
          history.replaceState(`/game/${res.data.url}`)
        }
      })
      .catch(console.error)
  }

  render () {
    const { loaded, game } = this.state
    const { params } = this.props
    console.log('rendering edit game')
    return (
      <Loader loaded={loaded}>
        {loaded ? <NewGame params={params} game={game} handleAction={this.handleSave.bind(this)} /> : null}
      </Loader>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    games: state.games
  }
}

export default connect(mapStateToProps)(EditGame)
