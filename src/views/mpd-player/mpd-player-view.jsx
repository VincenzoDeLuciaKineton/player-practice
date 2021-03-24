import React, { useEffect } from 'react';
import './mpd-player-view.css'

const MpdPlayerView = ({ setPlayer }) => {

    const dashjs = window.dashjs;
    const player = dashjs.MediaPlayer().create();


    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/config.json`).then(res => {
            return res.json();
        }).then(res => {
            player.initialize(document.querySelector("#videoPlayer"), res.url, true);
            console.log('player object: ', player)
            setPlayer(player)
        })
    }, [])

    return (
        <video id="videoPlayer"></video>
    )
}

export default MpdPlayerView;
