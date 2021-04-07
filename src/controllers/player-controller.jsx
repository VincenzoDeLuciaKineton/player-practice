import React, { useContext, useEffect } from 'react';
import { ConfigContext } from '../context/ConfigContext'
import { PlayerContext } from '../context/PlayerContext'
import DashPlayerView from '../views/dash-player/dash-player-view'
import VideojsPlayerView from '../views/videojs-player/videojs-player-view'
import LoaderView from '../views/loader/loader-view'

const PlayerController = () => {

    const { url, readyToPlay } = useContext(ConfigContext);
    const { neededPlayer, setNeededPlayer, displayPlayer } = useContext(PlayerContext)

    useEffect(() => {
        if (url && url.endsWith('.mpd')) {
            setNeededPlayer('dashjs')
        } else if (url && url.endsWith('.m3u8')) {
            setNeededPlayer('videojs')
        }
    })

    return (
        displayPlayer ? <div className='player-controller'>
            {!readyToPlay ? <LoaderView /> :
                neededPlayer === 'dashjs' ? <DashPlayerView /> :
                    neededPlayer === 'videojs' ? <VideojsPlayerView /> : <span>Format not supported by the player</span>}
        </div> : null
    )
}

export default PlayerController
