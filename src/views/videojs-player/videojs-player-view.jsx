import React, { useState, useEffect, useContext, useRef } from 'react'
import { altair, navigationUtilities } from 'antares'
import './videojs-player-view.css'
import { ConfigContext } from '../../context/ConfigContext'
import { PlayerContext } from '../../context/PlayerContext'
import { ErrorContext } from '../../context/ErrorContext'
import Controls from '../controls/controls'
import SpinnerView from '../spinner/spinner-view'

const VideojsPlayerView = ({ focusTo, resumeSpatialNavigation }) => {

    const [currentTime, setCurrentTime] = useState(null);
    const [duration, setDuration] = useState(null);
    const [buffering, setBuffering] = useState(false);
    const [showLoader, setShowLoader] = useState(true);

    const { url, readyToPlay, setReadyToPlay } = useContext(ConfigContext);
    const { parentFocusable, setDisplayPlayer } = useContext(PlayerContext);
    const { setShowErrorModal, setErrorMessage } = useContext(ErrorContext);

    const videoElement = useRef(null);
    const bufferingRef = useRef(null);

    useEffect(() => {

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

        if (url) {
            let player = window.videojs(videoElement.current, {
                controls: false,
                sources: [{ src: url, type: 'application/x-mpegURL' }]
            });
            player.ready(() => {
                videoElement.current.play();
            });

            if (videoElement.current) {
                videoElement.current.addEventListener('abort', () => { onPlayerEvent('abort') });
                videoElement.current.addEventListener('canplay', () => { onPlayerEvent('canplay') });
                videoElement.current.addEventListener('canplaythrough', () => { onPlayerEvent('canplaythrough') });
                videoElement.current.addEventListener('durationchange', () => { onPlayerEvent('durationchange') });
                videoElement.current.addEventListener('emptied', () => { onPlayerEvent('emptied') });
                videoElement.current.addEventListener('ended', () => { onPlayerEvent('ended') });
                videoElement.current.addEventListener('error', () => { onPlayerEvent('error') });
                videoElement.current.addEventListener('loadeddata', () => { onPlayerEvent('loadeddata') });
                videoElement.current.addEventListener('loadedmetadata', () => { onPlayerEvent('loadedmetadata') });
                videoElement.current.addEventListener('loadstart', () => { onPlayerEvent('loadstart') });
                videoElement.current.addEventListener('pause', () => { onPlayerEvent('pause') });
                videoElement.current.addEventListener('play', () => { onPlayerEvent('play') });
                videoElement.current.addEventListener('playing', () => { onPlayerEvent('playing') });
                videoElement.current.addEventListener('progress', () => { onPlayerEvent('progress') });
                videoElement.current.addEventListener('ratechange', () => { onPlayerEvent('ratechange') });
                videoElement.current.addEventListener('seeked', () => { onPlayerEvent('seeked') });
                videoElement.current.addEventListener('seeking', () => { onPlayerEvent('seeking') });
                videoElement.current.addEventListener('stalled', () => { onPlayerEvent('stalled') });
                videoElement.current.addEventListener('suspend', () => { onPlayerEvent('suspend') });
                videoElement.current.addEventListener('timeupdate', () => { onPlayerEvent('timeupdate') });
                videoElement.current.addEventListener('volumechange', () => { onPlayerEvent('volumechange') });
                videoElement.current.addEventListener('waiting', () => { onPlayerEvent('waiting') });
            }
        }

        return () => {
            if (videoElement.current) {
                videoElement.current.removeEventListener('abort', () => { onPlayerEvent('abort') });
                videoElement.current.removeEventListener('canplay', () => { onPlayerEvent('canplay') });
                videoElement.current.removeEventListener('canplaythrough', () => { onPlayerEvent('canplaythrough') });
                videoElement.current.removeEventListener('durationchange', () => { onPlayerEvent('durationchange') });
                videoElement.current.removeEventListener('emptied', () => { onPlayerEvent('emptied') });
                videoElement.current.removeEventListener('ended', () => { onPlayerEvent('ended') });
                videoElement.current.removeEventListener('error', () => { onPlayerEvent('error') });
                videoElement.current.removeEventListener('loadeddata', () => { onPlayerEvent('loadeddata') });
                videoElement.current.removeEventListener('loadedmetadata', () => { onPlayerEvent('loadedmetadata') });
                videoElement.current.removeEventListener('loadstart', () => { onPlayerEvent('loadstart') });
                videoElement.current.removeEventListener('pause', () => { onPlayerEvent('pause') });
                videoElement.current.removeEventListener('play', () => { onPlayerEvent('play') });
                videoElement.current.removeEventListener('playing', () => { onPlayerEvent('playing') });
                videoElement.current.removeEventListener('progress', () => { onPlayerEvent('progress') });
                videoElement.current.removeEventListener('ratechange', () => { onPlayerEvent('ratechange') });
                videoElement.current.removeEventListener('seeked', () => { onPlayerEvent('seeked') });
                videoElement.current.removeEventListener('seeking', () => { onPlayerEvent('seeking') });
                videoElement.current.removeEventListener('stalled', () => { onPlayerEvent('stalled') });
                videoElement.current.removeEventListener('suspend', () => { onPlayerEvent('suspend') });
                videoElement.current.removeEventListener('timeupdate', () => { onPlayerEvent('timeupdate') });
                videoElement.current.removeEventListener('volumechange', () => { onPlayerEvent('volumechange') });
                videoElement.current.removeEventListener('waiting', () => { onPlayerEvent('waiting') });
                console.log('UNMOUNTING EVENTS')
            }
            setReadyToPlay(false);
            videoElement.current = null;
            console.log('Player unmounted');
        }
    }, [])

    const onPlayerEvent = (event) => {
        if (event !== 'timeupdate') {
            console.log('Event from the videojs player: ', event);
        }

        switch (event) {

            case 'durationchange':
                if (videoElement.current.duration > 0) {
                    setDuration(videoElement.current.duration);
                }
                break;

            case 'ended':
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
                break;

            case 'loadeddata':
                setShowLoader(false);
                setReadyToPlay(true);
                break;

            case 'playing':
                clearTimeout(bufferingRef.current);
                bufferingRef.current = null;
                console.log('Resetting the buffering countdown')
                setBuffering(false);
                if (!readyToPlay) {
                    setReadyToPlay(true);
                }
                break;

            case 'timeupdate':
                if (videoElement.current) {
                    setCurrentTime(parseInt(videoElement.current.currentTime));
                }
                break;

            case 'waiting':
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
                break
        }
    }

    return (
        <div className='video-and-controls'>
            <video
                id="my-video"
                className="video-js"
                ref={videoElement}
            >
                <source src={url} type='application/x-mpegURL' />
            </video>
            {duration > 0 && !showLoader ?
                (buffering ?
                    <SpinnerView /> :
                    <Controls
                        instanceOfPlayer={videoElement.current}
                        currentTime={currentTime}
                        setCurrentTime={setCurrentTime}
                        duration={duration} />) :
                null}
        </div>
    )
}

export default navigationUtilities(VideojsPlayerView)
