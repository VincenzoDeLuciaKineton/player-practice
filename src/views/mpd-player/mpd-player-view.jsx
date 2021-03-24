import React, { useEffect } from 'react';
import './mpd-player-view.css'

const MpdPlayerView = () => {
    const dashjs = window.dashjs;

    const url = "https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd";
    useEffect(() => {
        const player = dashjs.MediaPlayer().create();
        player.initialize(document.querySelector("#videoPlayer"), url, true);
    }, [])

    return (
        <div className='player-view'>
            <video id="videoPlayer" controls></video>
        </div>
    )
}

export default MpdPlayerView;
