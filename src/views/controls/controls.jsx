import React, { useEffect, useRef, useState, useContext } from 'react'
import { AntaresHorizontalList, AntaresFocusable, navigationUtilities, addKeydownEvent, removeKeydownEvent } from 'antares'
import './controls.css'
import { PlayerContext } from '../../context/PlayerContext'
import { ConfigContext } from '../../context/ConfigContext'
import ProgressBarView from '../progress-bar/progress-bar-view'


// Import degli asset 
import Pause from "../assets/images/pause-default.png";
import Play from "../assets/images/play-default.png";
import Rewind from "../assets/images/bw-default.png";
import FastForward from "../assets/images/fw-default.png";
import HighlightedPlay from "../assets/images/play-focus.png";
import HighlightedPause from "../assets/images/pause-focus.png";
import HighlightedFastForward from "../assets/images/fw-focus.png";
import HighlightedRewind from "../assets/images/bw-focus.png";

const Controls = ({ instanceOfPlayer, playerState, duration, currentTime, focusTo, resumeSpatialNavigation, pauseSpatialNavigation }) => {
    //Contesti utilizzati: valori e funzioni comuni a più componenti/pagine 
    const { setReadyToPlay, controlsCountdownFromConfig } = useContext(ConfigContext)
    const { setDisplayPlayer, parentFocusable } = useContext(PlayerContext);

    //Stati: valori pertinenti al singolo componente/pagina il cui cambiamento causa un re-render
    const [displayControls, setDisplayControls] = useState(true)
    const [skipRate, setSkipRate] = useState(1);
    const [isHighlighted, setIsHighlighted] = useState({
        play: true,
        forward: false,
        rewind: false,
    });

    //Ref: valorri relativi al componente/pagina indipendenti dal ciclo di vita
    const isPlayingRef = useRef(false)
    const skipRef = useRef(null);
    const controlRef = useRef('play')
    const controlsCountdownRef = useRef(null)
    let onKeyDown = undefined;

    //Funzione che resetta il countdown per nascondere i controlli
    const resetControlsCountdown = () => {
        console.log('Controls countdown restarted')
        clearTimeout(controlsCountdownRef.current);
        controlsCountdownRef.current = null;
        controlsCountdownRef.current = setTimeout(() => {
            setDisplayControls(false);
            pauseSpatialNavigation();
            console.log('resetControlsCountdown displayControls: ', displayControls)
        }, controlsCountdownFromConfig)
    }

    // useEffect di mount
    useEffect(() => {
        focusTo('play-button');
        resetControlsCountdown();

        return () => {
            clearTimeout(controlsCountdownRef.current);
            controlsCountdownRef.current = null;
        }

    }, [])
    ///////////////////////////////////////////////////

    //Comportamento dei controlli, differenziato tra quando essi sono visibili e quando non lo sono 
    const onKeyDownHandler = (e) => {
        if (
            e.keyCode === 37 ||
            e.keyCode === 39 ||
            e.keyCode === 38 ||
            e.keyCode === 40
        ) {
            console.log('Resetting controls timeout')
            if (!displayControls) {
                setDisplayControls(true);
                resetControlsCountdown();
            } else {
                resumeSpatialNavigation();
                resetControlsCountdown();
            }

        }
        if (e.keyCode === 8 || e.keyCode === 461) {
            if (displayControls) {
                setDisplayControls(false);
            } else {
                focusTo(parentFocusable);
                console.log('parentFocusable: ', parentFocusable);
                resumeSpatialNavigation();
                setReadyToPlay(false);
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
    //////////////////////////////////////////////////////

    //Funzionalità del tasto Play
    const playOrPause = () => {
        if (!displayControls) {
            setDisplayControls(true);
            resetControlsCountdown();
        } else {
            resetControlsCountdown();
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
    }

    //Funzionalità del tasto rewind
    const onRewind = () => {
        if (!displayControls) {
            resetControlsCountdown()
        } else {
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
    }

    //Funzionalità del tasto fast forward
    const onFastForward = () => {
        if (!displayControls) {
            resetControlsCountdown()
        } else {
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
    }


    //Gestione estetica del focus sui tasti
    const highlightRewind = () => {
        setIsHighlighted({ play: false, forward: false, rewind: true });
    };

    const highlightPlay = () => {
        setIsHighlighted({ play: true, forward: false, rewind: false });
    };

    const highlightFastForward = () => {
        setIsHighlighted({ play: false, forward: true, rewind: false });
    };
    ///////////////////////////////////////


    //Render del componente
    return (
        <div className={`${displayControls ? 'fade-in' : 'fade-out'} controls-and-progress-bar`}>
            <ProgressBarView duration={duration} currentTime={currentTime} />
            <AntaresHorizontalList containerClassname='controls-outer'
                innerClassname='controls-inner'
                forceFocus={true}
                remainInFocus={true}
                fixed={true}
                innerWidth={1280}
            >
                <AntaresFocusable
                    classname='controls-button rewind'
                    focusableId='rewind-button'
                    focusedClassname='controls-button-focused'
                    index={0}
                    onEnterDown={onRewind}
                    onFocus={highlightRewind}>
                    <img alt='rewind-icon' src={isHighlighted.rewind ? HighlightedRewind : Rewind} />
                    <span className='rewind-skiprate'>{`x${skipRate}`}</span>
                </AntaresFocusable>
                <AntaresFocusable
                    classname='play-button controls-button'
                    focusedClassname='controls-button-focused'
                    focusableId='play-button'
                    index={1}
                    onEnterDown={playOrPause}
                    onFocus={highlightPlay}>
                    <img alt='play/pause icon' src={playerState === 'playing' ? isHighlighted.play ? HighlightedPause : Pause : isHighlighted.play ? HighlightedPlay : Play} className='controls-icon' />
                </AntaresFocusable>
                <AntaresFocusable classname='controls-button fast-forward'
                    focusableId='fast-forward-button'
                    focusedClassname='controls-button-focused'
                    index={2}
                    onEnterDown={onFastForward}
                    onFocus={highlightFastForward}>
                    <span className='fast-forward-skiprate'>{`x${skipRate}`}</span>
                    <img alt='fast-forward-icon' src={isHighlighted.forward ? HighlightedFastForward : FastForward} className='controls-icon' />
                </AntaresFocusable>
            </AntaresHorizontalList>
        </div >
    )
}

export default navigationUtilities(Controls)
