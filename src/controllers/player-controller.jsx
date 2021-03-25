import React, { useContext } from 'react';
import MpdPlayerView from '../views/mpd-player/mpd-player-view'
import LoaderView from '../views/loader/loader-view'
import { ConfigContext } from '../context/ConfigContext'
import { PlayerContextProvider } from '../context/PlayerContext'

const PlayerController = () => {

    const config = useContext(ConfigContext);

    return (
        <PlayerContextProvider className='player-controller'>
            {!config.ready ? <LoaderView /> :
                config.neededPlayer === 'dashjs' ? <MpdPlayerView /> :
                    config.neededPlayer === 'videojs' ? <span>You need a videojs player</span> : <span>Format not supported by the player</span>}
        </PlayerContextProvider>
    )
}

export default PlayerController
