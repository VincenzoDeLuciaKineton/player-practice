import React, { useEffect, useRef, useState } from 'react'
import { AntaresHorizontalList, AntaresFocusable, navigationUtilities } from 'antares'
import './controls.css'

const Controls = (props) => {

    const [displayControls, setDisplayControls] = useState(true)
    const [skipRate, setSkipRate] = useState(1);

    const isPlayingRef = useRef(false)
    const skipRef = useRef(null);
    const controlRef = useRef('play')


    useEffect(() => {
        props.focusTo('play-button')
    }, [])

    useEffect(() => {
        console.log('PlayerState from the controls: ', props.playerState)
    }, [props.playerState])

    useEffect(() => {
        if (props.instanceOfPlayer) {
            props.instanceOfPlayer.play()
        }
    }, [props.instanceOfPlayer])

    const playOrPause = () => {
        clearInterval(skipRef.current)
        skipRef.current = null
        setSkipRate(0)
        if (!isPlayingRef.current) {
            isPlayingRef.current = true
            props.instanceOfPlayer.play()
        } else {
            isPlayingRef.current = false
            props.instanceOfPlayer.pause()
        }
    }

    const onRewind = () => {
        controlRef.current = 'rewind';
        if (controlRef.current !== 'rewind') {
            clearInterval(skipRef.current)
            skipRef.current = null
            setSkipRate(0)
        }
        clearInterval(skipRef.current)
        skipRef.current = null
        switch (skipRate) {
            default:
                return
            case 0:
                setSkipRate(1);
                break
            case 1:
                setSkipRate(2);
                break
            case 2:
                setSkipRate(4)
        }
        skipRef.current = setInterval(() => {
            props.instanceOfPlayer.currentTime -= 10 * skipRate
        }, 1000)
        console.log('rewind to: ', props.instanceOfPlayer.currentTime);
    }

    const onFastForward = () => {
        controlRef.current = 'fast-forward';
        if (controlRef.current !== 'fast-forward') {
            clearInterval(skipRef.current)
            skipRef.current = null
            setSkipRate(0)
        }
        switch (skipRate) {
            default:
                return
            case 0:
                setSkipRate(1);
                break
            case 1:
                setSkipRate(2);
                break
            case 2:
                setSkipRate(4)
        }
        skipRef.current = setInterval(() => {
            props.instanceOfPlayer.currentTime += 10 * skipRate
        }, 1000)
        console.log('fast forward to: ', props.instanceOfPlayer.currentTime);
    }

    return (
        <AntaresHorizontalList containerClassname='controls-outer'
            innerClassname='controls-inner'
            forceFocus={true} fixed={true}
            innerWidth={1280}
            style={{ opacity: `${displayControls ? 1 : 0}` }}>
            <AntaresFocusable
                classname='controls-button rewind'
                focusableId='rewind-button'
                focusedClassname='controls-button-focused'
                index={0}
                onEnterDown={onRewind}>
                <span>Rewind {`x${skipRate}`}</span>
            </AntaresFocusable>
            <AntaresFocusable
                classname='play-button controls-button'
                focusedClassname='controls-button-focused'
                focusableId='play-button'
                index={1}
                onEnterDown={playOrPause}>
                <span>Play/Pause</span>
            </AntaresFocusable>
            <AntaresFocusable classname='controls-button rewind'
                focusableId='fast-forward-button'
                focusedClassname='controls-button-focused'
                index={2}
                onEnterDown={onFastForward}>
                <span>Fast Forward {`x${skipRate}`}</span>
            </AntaresFocusable>
        </AntaresHorizontalList>
    )
}

export default navigationUtilities(Controls)
