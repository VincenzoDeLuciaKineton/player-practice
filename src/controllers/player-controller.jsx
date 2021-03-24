import React, { useState, useEffect } from 'react';
import MpdPlayerView from '../views/mpd-player/mpd-player-view'
import Controls from '../views/controls/controls'

const PlayerController = () => {
    const [content, setContent] = useState();
    const [player, setPlayer] = useState();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/config.json`).then(res => {
            return res.json();
        }).then((res) => {
            console.log('video url: ', res.url)
            setContent(res.url)
            setReady(true);
        })
    })

    return (
        <div className='video-and-controls'>
            <MpdPlayerView content={content} setPlayer={setPlayer} />
            <Controls player={player} />
        </div>
    )
}

export default PlayerController
