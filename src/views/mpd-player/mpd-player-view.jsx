import React, { useState, useEffect, useContext } from 'react'
import { ConfigContext } from '../../context/ConfigContext'
import './mpd-player-view.css'
import Controls from '../controls/controls'

const MpdPlayerView = () => {

    const [player, setPlayer] = useState(null)

    const config = useContext(ConfigContext)

    useEffect(() => {
        const dashjs = window.dashjs
        const initializedPlayer = dashjs.MediaPlayer().create()
        if (config.url) {
            initializedPlayer.initialize(document.getElementById('videoPlayer'), config.url, true);
            setPlayer(initializedPlayer)
            document.getElementById('videoPlayer').addEventListener('play', onPlay)
            document.getElementById('videoPlayer').addEventListener('pause', onPause)
        }
    }, [])

    const onPlay = () => {
        console.log('PLAY EVENT FROM THE VIDEO TAG')
    }

    const onPause = () => {
        console.log('PAUSE EVENT FROM THE VIDEO TAG')
    }


    return (
        <div className='video-and-controls'>
            <video id="videoPlayer"></video>
            <Controls player={player} />
        </div>
    )
}

export default MpdPlayerView;
