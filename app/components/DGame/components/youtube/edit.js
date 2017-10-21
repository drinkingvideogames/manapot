import React from 'react'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import ClearIcon from 'material-ui-icons/Clear'
import DragIcon from 'material-ui-icons/DragHandle'
import Settings from './settings'
import Toolbar from '../parts/Toolbar'

class EditYoutubeComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = Object.assign({ videoId: '' }, props.initialState)
    }

    componentDidMount () {
        this.loadYTVideo()
    }

    componentWillUpdate (nextProps, nextState) {
        const { videoId } = this.state
        if (nextState.videoId !== videoId && this.player) {
            this.player.cueVideoById(nextState.videoId, 0, 'default')
        }
    }

    loadYTVideo () {
        function createPlayer () {
            const { componentId } = this.props
            const { videoId } = this.state
            this.player = new YT.Player(`ytplayer-${componentId}`, {
                height: '360',
                width: '640',
                videoId,
                autoplay: 0
            })
        }

        if (window.YT && window.YT.loaded) {
            createPlayer.call(this)
        } else {
            const tag = document.createElement('script')
            tag.src = "//www.youtube.com/player_api"
            const firstScriptTag = document.getElementsByTagName('script')[0]
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
            window.onYouTubePlayerAPIReady = createPlayer.bind(this)
        }
    }

    handleSettings (settings, cb) {
        this.setState({ videoId: settings.videoId }, cb)
    }

    handleDestroy () {
        const { destroy } = this.props
        if (destroy) destroy()
    }

    render () {
        const { componentId, connectDragSource } = this.props
        const { videoId } = this.state
        return (
            <div style={{ position: 'relative', height: '360px' }}>
                <div id={`ytplayer-${componentId}`} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}></div>
                <Toolbar
                    settings={<Settings handleSave={this.handleSettings.bind(this)} videoId={videoId} />}
                    canDrag
                    canDelete
                    onDelete={this.handleDestroy.bind(this)}
                    connectDragSource={connectDragSource}
                />
            </div>
        )
    }
}

export default EditYoutubeComponent
