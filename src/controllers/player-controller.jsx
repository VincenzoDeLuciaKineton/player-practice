import React, { useContext } from 'react';
import MpdPlayerView from '../views/mpd-player/mpd-player-view'
import { ConfigContext } from '../context/ConfigContext'

const PlayerController = () => {

    const config = useContext(ConfigContext);

    return (
        <div className='player-controller'>
            {config.ready ? <MpdPlayerView /> : null}
        </div>
    )
}

export default PlayerController
