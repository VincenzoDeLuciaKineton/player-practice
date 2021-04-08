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
                videoElement.current.play();
            });

            if(videoElement.current){
                videoElement.current.addEventListener('play', ()=>{onPlayerEvent('play')});
                videoElement.current.addEventListener('playing', ()=>{onPlayerEvent('playing')});
                videoElement.current.addEventListener('progress', ()=>{onPlayerEvent('progress')});
            }
        }


    }, [])

    const onPlayerEvent=(event)=>{
        console.log('Event from the videojs player: ', event);
        if (event==='playing'){
            setReadyToPlay(true);
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
            <Controls instanceOfPlayer={videoElement.current} currentTime={currentTime} setCurrentTime={setCurrentTime} />
        </div>
    )
}

export default navigationUtilities(VideojsPlayerView)
