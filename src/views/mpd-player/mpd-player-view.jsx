import React, { useState, useEffect, useContext } from 'react'
import { ConfigContext } from '../../context/ConfigContext'
import './mpd-player-view.css'
import Controls from '../controls/controls'

const MpdPlayerView = () => {

    const [player, setPlayer] = useState(null)
    const [currentTime, setCurrentTime] = useState(0);

    const config = useContext(ConfigContext)

    useEffect(() => {
        const dashjs = window.dashjs
        const initializedPlayer = dashjs.MediaPlayer().create()
        if (config.url) {
            initializedPlayer.initialize(document.getElementById('videoPlayer'), config.url, true);
            setPlayer(initializedPlayer)
            document.getElementById('videoPlayer').addEventListener('play', onPlay)
            document.getElementById('videoPlayer').addEventListener('pause', onPause)
            document.getElementById('videoPlayer').addEventListener('playing', onPlaying)
            document.getElementById('videoPlayer').addEventListener('timeupdate', onTimeUpdate)


            return () => {
                if (player) {
                    document.getElementById('videoPlayer').removeEventListener('play', onPlay)
                    document.getElementById('videoPlayer').removeEventListener('pause', onPause)
                    document.getElementById('videoPlayer').removeEventListener('playing', onPlaying)
                    document.getElementById('videoPlayer').removeEventListener('timeupdate', onTimeUpdate)
                }
            }

        }
    }, [])

    const onPlay = () => {
        console.log('Play')
    }

    const onPause = () => {
        console.log('PAUSE EVENT FROM THE VIDEO TAG')
    }

    const onPlaying = () => {
        console.log('Playing')
    }

    const onTimeUpdate = () => {
        setCurrentTime(document.getElementById('videoPlayer').currentTime)
        console.log('Setting currentTime to: ', document.getElementById('videoPlayer').currentTime)
    }


    return (
        <div className='video-and-controls'>
            <video id="videoPlayer"></video>
            <Controls player={player} currentTime={currentTime} setCurrentTime={setCurrentTime} />
        </div>
    )
}

export default MpdPlayerView;
