import React, { useEffect, useContext, useRef, useState } from 'react'
import './dash-player-view.css'
import { altair, navigationUtilities } from 'antares'
import { ConfigContext } from '../../context/ConfigContext'
import { PlayerContext } from '../../context/PlayerContext'
import Controls from '../controls/controls'
import SpinnerView from '../spinner/spinner-view'
import { ErrorContext } from '../../context/ErrorContext'

const DashPlayerView = ({ focusTo, resumeSpatialNavigation }) => {

    const { readyToPlay, setReadyToPlay } = useContext(ConfigContext);
    const { setDisplayPlayer, videoToPlay, parentFocusable } = useContext(PlayerContext);
    const { setShowErrorModal, setErrorMessage } = useContext(ErrorContext);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showLoader, setShowLoader] = useState(true);
    const [buffering, setBuffering] = useState(false);


    const playerRef = useRef(null);
    const playerStateRef = useRef(null);
    const bufferingRef = useRef(null);

    useEffect(() => {
        console.log('Initializing Dash Player');

        bufferingRef.current = setTimeout(() => {
            console.log('The player did not even start')
            setErrorMessage('Lost connection');
            focusTo('error-button-id');
            setShowErrorModal(true);
        }, 20000)

        if (altair.isHbbTV()) {
            if (window.navigator.userAgent.toUpperCase().indexOf("SAMSUNG") >= 0) {
                if (
                    window.navigator.userAgent.toUpperCase().indexOf("2020") >= 0 ||
                    window.navigator.userAgent.toUpperCase().indexOf("2021") >= 0
                ) {
                    altair.stopBroadcastVideo();
                } else {
                    document.getElementById("mainVideoObject").setChannel(null);
                }
            } else {
                altair.stopBroadcastVideo();
            }
        }

        const dashjs = window.dashjs
        const initializedPlayer = dashjs.MediaPlayer().create();
        if (videoToPlay) {
            initializedPlayer.initialize(playerRef.current, videoToPlay, true);
            playerRef.current.addEventListener('abort', () => { onPlayerEvent('abort') });
            playerRef.current.addEventListener('canplay', () => { onPlayerEvent('canplay') });
            playerRef.current.addEventListener('canplaythrough', () => { onPlayerEvent('canplaythrough') });
            playerRef.current.addEventListener('durationchange', onDurationChange);
            playerRef.current.addEventListener('emptied', () => { onPlayerEvent('emptied') });
            playerRef.current.addEventListener('ended', onEnded);
            playerRef.current.addEventListener('error', () => { onPlayerEvent('error') })
            playerRef.current.addEventListener('loadeddata', onLoadedData);
            playerRef.current.addEventListener('loadstart', () => { onPlayerEvent('loadstart') });
            playerRef.current.addEventListener('pause', () => { onPlayerEvent('pause') });
            playerRef.current.addEventListener('play', () => { onPlayerEvent('play') });
            playerRef.current.addEventListener('playing', onPlaying);
            playerRef.current.addEventListener('progress', onProgress);
            playerRef.current.addEventListener('ratechange', () => { onPlayerEvent('ratechange') });
            playerRef.current.addEventListener('seeked', () => { onPlayerEvent('seeked') });
            playerRef.current.addEventListener('seeking', () => { onPlayerEvent('seeking') });
            playerRef.current.addEventListener('stalled', () => { onPlayerEvent('stalled') });
            playerRef.current.addEventListener('suspend', () => { onPlayerEvent('suspend') });
            playerRef.current.addEventListener('timeupdate', onTimeUpdate);
            playerRef.current.addEventListener('volumechange', () => { onPlayerEvent('volumechange') });
            playerRef.current.addEventListener('waiting', onWaiting);
        }

        return () => {
            if (playerRef.current) {
                console.log('UNMOUNTING PLAYER EFFECTS');
                playerRef.current.removeEventListener('abort', () => { onPlayerEvent('abort') });
                playerRef.current.removeEventListener('canplay', () => { onPlayerEvent('canplay') });
                playerRef.current.removeEventListener('canplaythrough', () => { onPlayerEvent('canplaythrough') });
                playerRef.current.removeEventListener('durationchange', onDurationChange);
                playerRef.current.removeEventListener('emptied', () => { onPlayerEvent('emptied') });
                playerRef.current.removeEventListener('ended', onEnded);
                playerRef.current.removeEventListener('error', () => { onPlayerEvent('error') })
                playerRef.current.removeEventListener('loadeddata', onLoadedData);
                playerRef.current.removeEventListener('loadstart', () => { onPlayerEvent('loadstart') });
                playerRef.current.removeEventListener('pause', () => { onPlayerEvent('pause') });
                playerRef.current.removeEventListener('play', () => { onPlayerEvent('play') });
                playerRef.current.removeEventListener('playing', onPlaying);
                playerRef.current.removeEventListener('progress', onProgress);
                playerRef.current.removeEventListener('ratechange', () => { onPlayerEvent('ratechange') });
                playerRef.current.removeEventListener('seeked', () => { onPlayerEvent('seeked') });
                playerRef.current.removeEventListener('seeking', () => { onPlayerEvent('seeking') });
                playerRef.current.removeEventListener('stalled', () => { onPlayerEvent('stalled') });
                playerRef.current.removeEventListener('suspend', () => { onPlayerEvent('suspend') });
                playerRef.current.removeEventListener('timeupdate', onTimeUpdate);
                playerRef.current.removeEventListener('volumechange', () => { onPlayerEvent('volumechange') });
                playerRef.current.removeEventListener('waiting', onWaiting);
            }
            setReadyToPlay(false);
            playerStateRef.current = null;
            playerRef.current = null;
            initializedPlayer.destroy();
            console.log('Player unmounted');
        }
    }, [])

    const onPlayerEvent = (event) => {
        console.log(`Event from the player: ${event}`);
        playerStateRef.current = event;
    }

    const onDurationChange = () => {
        console.log('duration: ', playerRef.current.duration);
        playerStateRef.current = 'durationchange';
        if (playerRef.current.duration > 0) {
            setDuration(playerRef.current.duration);
        }
    }

    const onEnded = () => {
        console.log('Event from the player: ended');
        playerStateRef.current = 'ended';
        resumeSpatialNavigation();
        focusTo(parentFocusable);
        setReadyToPlay(false);
        setDisplayPlayer(false);

        if (altair.isHbbTV()) {
            if (window.navigator.userAgent.toUpperCase().indexOf("SAMSUNG") >= 0) {
                if (
                    window.navigator.userAgent.toUpperCase().indexOf("2020") >= 0 ||
                    window.navigator.userAgent.toUpperCase().indexOf("2021") >= 0
                ) {
                    altair.startBroadcastVideo();
                } else {
                    document.getElementById("mainVideoObject").setChannel(window.channel);
                }
            } else {
                altair.startBroadcastVideo();
            }
        }
    }

    const onLoadedData = () => {
        console.log('Event from the player: loadeddata')
        playerStateRef.current = 'loadeddata';
        setShowLoader(false);
        setReadyToPlay(true);
    }

    const onPlaying = () => {
        console.log('Event from the player: playing at', playerRef.current.currentTime)
        playerStateRef.current = 'playing';
        clearTimeout(bufferingRef.current);
        bufferingRef.current = null;
        console.log('Resetting the buffering countdown')
        setBuffering(false);
        if (!readyToPlay) {
            setReadyToPlay(true);
        }
    }

    const onProgress = () => {
        console.log('Event from the player: progress');
        playerStateRef.current = 'progress';
        clearTimeout(bufferingRef.current);
        bufferingRef.current = null;
        console.log('Resetting the buffering countdown');

    }

    const onTimeUpdate = () => {
        if (playerRef.current) {
            setCurrentTime(parseInt(playerRef.current.currentTime));
        }
    }

    const onWaiting = () => {
        console.log('Event from the player: waiting');
        playerStateRef.current = 'waiting';
        setBuffering(true);
        console.log('Starting the buffering countdown');
        clearTimeout(bufferingRef.current);
        bufferingRef.current = null;
        bufferingRef.current = setTimeout(() => {
            resumeSpatialNavigation();
            console.log('The player started and then lost connection')
            setErrorMessage('Lost connection');
            focusTo('error-button-id');
            setShowErrorModal(true);
        }, 20000)
    }

    return (
        <div className='video-and-controls'>
            <video id="videoPlayer" ref={playerRef}></video>
            {duration > 0 && !showLoader ?
                (buffering ?
                    <SpinnerView /> :
                    <Controls
                        instanceOfPlayer={playerRef.current}
                        currentTime={currentTime}
                        setCurrentTime={setCurrentTime}
                        duration={duration} />) :
                null}
        </div>
    )
}

export default navigationUtilities(DashPlayerView);
