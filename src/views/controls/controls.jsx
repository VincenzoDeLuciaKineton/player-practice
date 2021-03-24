import React, { useState } from 'react'

const Controls = ({ player }) => {

    const [playerState, setPlayerState] = useState('pause')

    const play = () => {
        setPlayerState('play')
        player.play()
    }

    const pause = () => {
        setPlayerState('pause')
        player.pause();
    }

    const onRewind = () => {
        console.log('rewind')
    }

    const onFastForward = () => {
        console.log('fast forward')
    }

    return (
        <div className='controls'>
            <button className='controls-button rewind' onClick={onRewind}>Rewind</button>
            {playerState === 'pause' ? <button className='play-button controls-button' onClick={play}>Play</button> :
                <button className='pause-button controls-button' onClick={pause}>Pause</button>}
            <button className='controls-button rewind' onClick={onFastForward}>Fast Forward</button>
        </div>
    )
}

export default Controls
