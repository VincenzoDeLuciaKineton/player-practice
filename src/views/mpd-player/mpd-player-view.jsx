import React, { useEffect, useContext } from 'react'
import { ConfigContext } from '../../context/ConfigContext'
import './mpd-player-view.css'
import Controls from '../controls/controls'
import ProgressBarView from '../progress-bar/progress-bar-view'
import { PlayerContext } from '../../context/PlayerContext'

const MpdPlayerView = () => {

    const config = useContext(ConfigContext)
    const { setDuration, setCurrentTime, instanceOfPlayer, setInstanceOfPlayer } = useContext(PlayerContext)

    useEffect(() => {
        const dashjs = window.dashjs
        const initializedPlayer = dashjs.MediaPlayer().create()
        if (config.url) {
            initializedPlayer.initialize(document.getElementById('videoPlayer'), config.url, true);
            setInstanceOfPlayer(initializedPlayer)
            document.getElementById('videoPlayer').addEventListener('play', onPlay)
            document.getElementById('videoPlayer').addEventListener('pause', onPause)
            document.getElementById('videoPlayer').addEventListener('playing', onPlaying)
            document.getElementById('videoPlayer').addEventListener('timeupdate', onTimeUpdate)
            document.getElementById('videoPlayer').addEventListener('durationchange', onDurationChange)


        }

        return () => {
            if (instanceOfPlayer) {
                document.getElementById('videoPlayer').removeEventListener('play', onPlay)
                document.getElementById('videoPlayer').removeEventListener('pause', onPause)
                document.getElementById('videoPlayer').removeEventListener('playing', onPlaying)
                document.getElementById('videoPlayer').removeEventListener('timeupdate', onTimeUpdate)
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
        /* console.log('Setting currentTime to: ', document.getElementById('videoPlayer').currentTime) */
    }

    const onDurationChange = () => {
        console.log('duration: ', document.getElementById('videoPlayer').duration)
        if (document.getElementById('videoPlayer').duration > 0) {
            setDuration(document.getElementById('videoPlayer').duration)
        }
    }


    return (
        <div className='video-and-controls'>
            <video id="videoPlayer"></video>
            <ProgressBarView />
            <Controls />
        </div>
    )
}

export default MpdPlayerView;
