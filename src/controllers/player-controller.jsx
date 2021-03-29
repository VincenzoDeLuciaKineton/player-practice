import React, { useContext, useEffect } from 'react';
import { ConfigContext } from '../context/ConfigContext'
import { PlayerContext } from '../context/PlayerContext'
import MpdPlayerView from '../views/mpd-player/mpd-player-view'
import LoaderView from '../views/loader/loader-view'

const PlayerController = () => {

    const { url, readyToPlay } = useContext(ConfigContext);
    const { neededPlayer, setNeededPlayer } = useContext(PlayerContext)

    useEffect(() => {
        if (url && url.endsWith('.mpd')) {
            setNeededPlayer('dashjs')
        } else if (url && url.endsWith('.m3u8')) {
            setNeededPlayer('videojs')
        }
    })

    return (
        <div className='player-controller'>
            {!readyToPlay ? <LoaderView /> :
                neededPlayer === 'dashjs' ? <MpdPlayerView /> :
                    neededPlayer === 'videojs' ? <span>You need a videojs player</span> : <span>Format not supported by the player</span>}
        </div>
    )
}

export default PlayerController
