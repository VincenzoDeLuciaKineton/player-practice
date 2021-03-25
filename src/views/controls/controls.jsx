import React, { useState } from 'react'
import { AntaresHorizontalList, AntaresFocusable } from 'antares'
import './controls.css'


const Controls = ({ player }) => {

    const [playerState, setPlayerState] = useState('pause')

    const playOrPause = () => {
        if (playerState === 'pause') {
            setPlayerState('play')
            player.play()
        } else if (playerState === 'play') {
            setPlayerState('pause')
            player.pause();
        }
    }

    const onRewind = () => {
        console.log('rewind')
    }

    const onFastForward = () => {
        console.log('fast forward')
    }

    return (
        <AntaresHorizontalList containerClassname='controls-outer' innerClassname='controls-inner' forceFocus={true} fixed={true} innerWidth={1280}>
            <AntaresFocusable classname='controls-button rewind' focusableId='rewind-button' focusedClassname='controls-button-focused' onEnterDown={onRewind}>Rewind</AntaresFocusable>
            <AntaresFocusable classname='play-button controls-button' focusedClassname='controls-button-focused' focusableId='play-button' onEnterDown={playOrPause}><span>{playerState === 'play' ? 'Pause' : 'Play'}</span></AntaresFocusable>
            <AntaresFocusable classname='controls-button rewind' focusableId='fast-forward-button' focusedClassname='controls-button-focused' onEnterDown={onFastForward}>Fast Forward</AntaresFocusable>
        </AntaresHorizontalList>
    )
}

export default Controls
