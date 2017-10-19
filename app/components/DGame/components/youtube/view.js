import React from 'react'

class YoutubeView extends React.Component {
    componentDidMount () {
        this.loadYTVideo()
    }

    loadYTVideo () {
        function createPlayer () {
            const { componentId, hydrationState } = this.props
            const { videoId } = hydrationState
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

    render () {
        const { componentId, hydrationState } = this.props
        const { videoId } = hydrationState
        return (
            <div style={{ position: 'relative', height: '360px' }}>
                <div id={`ytplayer-${componentId}`} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}></div>
            </div>
        )
    }
}

export default YoutubeView
