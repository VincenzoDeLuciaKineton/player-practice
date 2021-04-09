import React, { useContext } from 'react';
import { ConfigContext } from '../context/ConfigContext'
import { PlayerContext } from '../context/PlayerContext'
import DashPlayerView from '../views/dash-player/dash-player-view'
import VideojsPlayerView from '../views/videojs-player/videojs-player-view'
import LoaderView from '../views/loader/loader-view'

const PlayerController = () => {

    const { readyToPlay } = useContext(ConfigContext);
    const { neededPlayer, displayPlayer } = useContext(PlayerContext)

    return (
        displayPlayer ? <div className='player-controller'>
            {readyToPlay ? null : <LoaderView />}
            {neededPlayer === 'dashjs' ? <DashPlayerView /> : neededPlayer === 'videojs' ? <VideojsPlayerView /> : null}
        </div> : null
    )
}

export default PlayerController
