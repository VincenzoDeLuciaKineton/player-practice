import React, { useState } from 'react';
import MpdPlayerView from '../views/mpd-player/mpd-player-view'
import Controls from '../views/controls/controls'

const PlayerController = () => {
    const [player, setPlayer] = useState(null);

    return (
        <div className='video-and-controls'>
            <MpdPlayerView setPlayer={setPlayer} />
            { player.isReady ? <Controls /> : null}
        </div>
    )
}

export default PlayerController
