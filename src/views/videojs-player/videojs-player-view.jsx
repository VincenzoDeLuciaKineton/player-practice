import React, { useState, useEffect, useContext, useRef } from 'react'
import { navigationUtilities } from 'antares'
import './videojs-player-view.css'
import { ConfigContext } from '../../context/ConfigContext'
import Controls from '../controls/controls'

const VideojsPlayerView = ({ resumeSpatialNavigation }) => {

    const [currentTime, setCurrentTime] = useState(null);

    const { url, readyToplay, setReadyToPlay } = useContext(ConfigContext);

    const videoElement = useRef(null);

    useEffect(() => {
        console.log('url: ', url)
        if (url) {
            let player = window.videojs(videoElement.current, {
                controls: false,
                sources: [{ src: url, type: 'application/x-mpegURL' }]
            });
            player.ready(() => {
                player.play();
            });

            player.on('canplaythrough', () => {
                console.log('Loader needs to unmount now');
                setReadyToPlay(true);
            })
        }


    }, [])

    return (
        <div className='video-and-controls'>
            <video
                id="my-video"
                className="video-js"
                ref={videoElement}
            >
                <source src={url} type='application/x-mpegURL' />
            </video>
            <Controls instanceOfPlayer={videoElement.current} currentTime={currentTime} setCurrentTime={setCurrentTime} />
        </div>
    )
}

export default navigationUtilities(VideojsPlayerView)
