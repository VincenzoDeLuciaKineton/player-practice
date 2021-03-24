import React, { useEffect, useRef } from 'react';
import './mpd-player-view.css'

const MpdPlayerView = ({ setPlayer }) => {
    const dashjs = window.dashjs;
    const player = useRef(null);

    useEffect(() => {
        player.current = dashjs.MediaPlayer().create();
        fetch(`${process.env.PUBLIC_URL}/config.json`).then(res => {
            return res.json();
        }).then(res => {
            player.current.initialize(document.querySelector("#videoPlayer"), res.mpdUrl, true);
            console.log('player.current: ', player.current)
        })
    })

    return (
        <div className='player-view'>
            <video id="videoPlayer"></video>
        </div>
    )
}

export default MpdPlayerView;
