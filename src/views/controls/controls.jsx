import React, { useState, useEffect } from 'react'
import { AntaresHorizontalList, AntaresFocusable, navigationUtilities } from 'antares'
import './controls.css'


const Controls = (props) => {

    const [playerState, setPlayerState] = useState('pause')

    useEffect(() => {
        props.focusTo('play-button')
    }, [])

    useEffect(() => {
        console.log('currentTime from the controls: ', props.currentTime)
    }, [props.currentTime])

    const playOrPause = () => {
        if (playerState === 'pause') {
            setPlayerState('play')
            props.player.play()
        } else if (playerState === 'play') {
            setPlayerState('pause')
            props.player.pause();
        }
    }



    const onRewind = () => {
        console.log('rewind')
        props.setCurrentTime(props.currentTime += 40)
    }

    const onFastForward = () => {
        console.log('fast forward');
        props.setCurrentTime(props.currentTime += 40)
    }

    return (
        <AntaresHorizontalList containerClassname='controls-outer'
            innerClassname='controls-inner'
            forceFocus={true} fixed={true}
            innerWidth={1280}>
            <AntaresFocusable
                classname='controls-button rewind'
                focusableId='rewind-button'
                focusedClassname='controls-button-focused'
                index={0} onEnterDown={onRewind}>
                <span>Rewind</span>
            </AntaresFocusable>
            <AntaresFocusable
                classname='play-button controls-button'
                focusedClassname='controls-button-focused'
                focusableId='play-button'
                index={1}
                onEnterDown={playOrPause}>
                <span>{playerState === 'play' ? 'Pause' : 'Play'}</span>
            </AntaresFocusable>
            <AntaresFocusable classname='controls-button rewind'
                focusableId='fast-forward-button'
                focusedClassname='controls-button-focused'
                index={2}
                onEnterDown={onFastForward}>
                <span>Fast Forward</span>
            </AntaresFocusable>
        </AntaresHorizontalList>
    )
}

export default navigationUtilities(Controls)
