import React, { useEffect, useRef } from 'react'

const Controls = ({ player }) => {

    useEffect(() => {
        console.log('player being passed to the controls: ', player)
    })

    const playerState = useRef();

    const play = () => {
        playerState.current = 'play'
        player.play()
    }

    const pause = () => {
        playerState.current = 'pause'
        player.pause();
    }

    return (
        <div className='controls'>
            <button className='play-button controls-button' onClick={play}>Play</button>
            <button className='pause-button controls-button' onClick={pause}>Pause</button>
        </div>
    )
}

export default Controls
