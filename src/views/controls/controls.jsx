import React, { useEffect, useRef, useState, useContext } from 'react'
import { AntaresHorizontalList, AntaresFocusable, navigationUtilities, addKeydownEvent, removeKeydownEvent } from 'antares'
import './controls.css'
import { PlayerContext } from '../../context/PlayerContext'
import ProgressBarView from '../progress-bar/progress-bar-view'
import { ConfigContext } from '../../context/ConfigContext'

const Controls = ({ focusTo, instanceOfPlayer, playerState, duration, currentTime }) => {

    const { setUrl } = useContext(ConfigContext)
    const { setDisplayPlayer, parentFocusable } = useContext(PlayerContext);

    const [displayControls, setDisplayControls] = useState(true)
    const [skipRate, setSkipRate] = useState(1);

    const isPlayingRef = useRef(false)
    const skipRef = useRef(null);
    const controlRef = useRef('play')
    const controlsCountdownRef = useRef(null)
    let onKeyDown = undefined;


    useEffect(() => {
        focusTo('play-button')
        controlsCountdownRef.current = setTimeout(() => {
            setDisplayControls(false)
        }, 5000)

        return () => {
            clearTimeout(controlsCountdownRef.current);
            controlsCountdownRef.current = null;
        }

    }, [])

    useEffect(() => {
        console.log('PlayerState from the controls: ', playerState)
    }, [playerState])

    useEffect(() => {
        if (instanceOfPlayer) {
            instanceOfPlayer.play()
        }
    }, [instanceOfPlayer])


    const onKeyDownHandler = (e) => {
        if (
            e.keyCode === 37 ||
            e.keyCode === 39 ||
            e.keyCode === 38 ||
            e.keyCode === 40 ||
            e.keyCode === 13
        ) {
            console.log('Resetting controls timeout')
            setDisplayControls(true);
            clearTimeout(controlsCountdownRef.current);
            controlsCountdownRef.current = null;
            controlsCountdownRef.current = setTimeout(() => {
                setDisplayControls(false);
            }, 5000)
        }
        if (e.keyCode === 8 || e.keyCode === 461) {
            if (displayControls) {
                setDisplayControls(false);
            } else {
                focusTo(parentFocusable)
                setUrl(null)
                setDisplayPlayer(false);
            }
        }

    }

    useEffect(() => {
        if (!onKeyDown) {
            onKeyDown = addKeydownEvent(onKeyDownHandler);
        }
        return () => {
            removeKeydownEvent(onKeyDown);
        };
    }, [onKeyDownHandler]);

    const playOrPause = () => {
        clearInterval(skipRef.current)
        skipRef.current = null
        setSkipRate(1)
        if (!isPlayingRef.current) {
            isPlayingRef.current = true
            instanceOfPlayer.play()
        } else {
            isPlayingRef.current = false
            instanceOfPlayer.pause()
        }
    }

    const onRewind = () => {
        controlRef.current = 'rewind';
        if (controlRef.current !== 'rewind') {
            clearInterval(skipRef.current)
            skipRef.current = null
            setSkipRate(1)
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
            instanceOfPlayer.currentTime -= 10 * skipRate
        }, 1000)
        console.log('rewind to: ', instanceOfPlayer.currentTime);
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
            instanceOfPlayer.currentTime += 10 * skipRate
        }, 1000)
        console.log('fast forward to: ', instanceOfPlayer.currentTime);
    }

    return (
        <div className='controls-and-progress-bar' style={{ visibility: `${displayControls ? 'visible' : 'hidden'}` }}>
            <ProgressBarView duration={duration} currentTime={currentTime} />
            <AntaresHorizontalList containerClassname='controls-outer'
                innerClassname='controls-inner'
                forceFocus={true}
                fixed={true}
                innerWidth={1280}
            >
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
        </div>
    )
}

export default navigationUtilities(Controls)
