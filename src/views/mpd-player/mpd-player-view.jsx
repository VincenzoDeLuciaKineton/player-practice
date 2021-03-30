import React, { useEffect, useContext, useRef, useState } from 'react'
import { ConfigContext } from '../../context/ConfigContext'
import './mpd-player-view.css'
import Controls from '../controls/controls'

const MpdPlayerView = () => {

    const { url, readyToPlay, setReadyToPlay } = useContext(ConfigContext)

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)


    const playerRef = useRef(null);
    const playerStateRef = useRef(null)

    useEffect(() => {
        console.log('Initializing player')
        const dashjs = window.dashjs
        const initializedPlayer = dashjs.MediaPlayer().create()
        if (url && readyToPlay) {
            initializedPlayer.initialize(playerRef.current, url, true);
            playerRef.current.addEventListener('durationchange', onDurationChange)
            playerRef.current.addEventListener('loadeddata', onLoadedData)
            playerRef.current.addEventListener('pause', onPause)
            playerRef.current.addEventListener('play', onPlay)
            playerRef.current.addEventListener('playing', onPlaying)
            playerRef.current.addEventListener('timeupdate', onTimeUpdate)
            playerRef.current.addEventListener('waiting', onWaiting)
        }

        return () => {
            if (playerRef.current) {
                console.log('UNMOUNTING PLAYER EFFECTS')
                playerRef.current.removeEventListener('timeupdate', onTimeUpdate)
                playerRef.current.removeEventListener('durationchange', onDurationChange)
                playerRef.current.removeEventListener('pause', onPause)
                playerRef.current.removeEventListener('play', onPlay)
                playerRef.current.removeEventListener('playing', onPlaying)
                playerRef.current.addEventListener('waiting', onWaiting)
            }
            setReadyToPlay(false);
            playerStateRef.current = null;
            playerRef.current = null;
            initializedPlayer.destroy();
            console.log('Player unmounted')
        }
    }, [])

    const onDurationChange = () => {
        console.log('duration: ', playerRef.current.duration)
        playerStateRef.current = 'durationchange'
        if (playerRef.current.duration > 0) {
            setDuration(playerRef.current.duration)
        }
    }

    const onLoadedData = () => {
        console.log('Event from the player: Loaded Data')
        playerStateRef.current = 'loadeddata'
    }

    const onPlay = () => {
        console.log('Event from the player: play')
        playerStateRef.current = 'play'
    }

    const onPause = () => {
        console.log('Event from the player: pause')
        playerStateRef.current = 'pause'
    }

    const onPlaying = () => {
        console.log('Event from the player: playing')
        playerStateRef.current = 'playing'
    }

    const onTimeUpdate = () => {
        if (playerRef.current) {
            setCurrentTime(parseInt(playerRef.current.currentTime))
            /* playerStateRef.current = 'timeupdate' */
        }
    }

    const onWaiting = () => {
        console.log('Event from the player: playing');
        playerStateRef.current = 'waiting'
    }

    return (
        <div className='video-and-controls'>
            <video id="videoPlayer" ref={playerRef} autoplay='true'></video>
            {duration > 0 ?
                <Controls instanceOfPlayer={playerRef.current} playerState={playerStateRef.current} currentTime={currentTime} duration={duration} /> : null}
        </div>
    )
}

export default MpdPlayerView;
