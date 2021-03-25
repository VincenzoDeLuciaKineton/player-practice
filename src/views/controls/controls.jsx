import React, { useState, useEffect, useContext } from 'react'
import { AntaresHorizontalList, AntaresFocusable, navigationUtilities } from 'antares'
import './controls.css'
import { PlayerContext } from '../../context/PlayerContext'

const Controls = (props) => {

    const [playerState, setPlayerState] = useState('pause')
    const { instanceOfPlayer, duration, setDuration, currentTime, setCurrentTime } = useContext(PlayerContext)

    useEffect(() => {
        props.focusTo('play-button')
    }, [])

    useEffect(() => {
        const progress = Math.floor((currentTime / duration) * 100)
        console.log('progress: ', progress, '%')
    }, [currentTime])

    const playOrPause = () => {
        if (playerState === 'pause') {
            setPlayerState('play')
            instanceOfPlayer.play()
        } else if (playerState === 'play') {
            setPlayerState('pause')
            instanceOfPlayer.pause();
        }
    }

    const onRewind = () => {
        document.getElementById('videoPlayer').currentTime -= 40
        console.log('rewind to: ', document.getElementById('videoPlayer').currentTime)
    }

    const onFastForward = () => {
        document.getElementById('videoPlayer').currentTime += 40
        console.log('fast forward to: ', document.getElementById('videoPlayer').currentTime);
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
