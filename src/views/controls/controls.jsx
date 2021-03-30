import React, { useEffect, useRef, useState, useContext } from 'react'
import './controls.css'
import { AntaresHorizontalList, AntaresFocusable, navigationUtilities, addKeydownEvent, removeKeydownEvent } from 'antares'
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
///////////////////////////////

//Props passate al player, rispettivamente: il player su cui andranno ad agire i controlli, la Ref che registra gli stati del player, la durata del video in riproduzione, il tempo in cui si trova la riproduzione del player, utilities di Antares per la navigazione.
const Controls = ({ instanceOfPlayer, duration, currentTime, setCurrentTime, focusTo, resumeSpatialNavigation, pauseSpatialNavigation }) => {

    //Contesti utilizzati: valori e funzioni comuni a più componenti/pagine 
    const { setReadyToPlay, controlsCountdownFromConfig } = useContext(ConfigContext)
    const { setDisplayPlayer, parentFocusable } = useContext(PlayerContext);

    //Stati: valori pertinenti al singolo componente/pagina il cui cambiamento causa un re-render
    //Variabile di stato che decreta se i controlli siano visibili o meno. Al suo cambiamento è subordinata la visibility dell'intero componente, tramite le animazioni fade-in e fade-out.
    const [displayControls, setDisplayControls] = useState(true)

    //Variabile di stato che decreta se ad essere mostrata è l'icona pause(isPlaying===true) o l'icona play(isPlaying===false).
    const [isPlaying, setIsPlaying] = useState(true);


    //Variabile di stato che regola quale dei controlli sia quello in focus.
    const [isHighlighted, setIsHighlighted] = useState({
        play: true,
        forward: false,
        rewind: false,
    });

    //Ref che indica se il player sia in seeking o meno
    const seekingRef = useRef(false);

    //Ref che decreta di quanto debba andare avanti il fast forward o indietro il rewind per ogni iterazione dell'intervallo.
    const seekrateRef = useRef(0);

    //Ref che indica quale sia il comando che i controlli stanno inviando al player
    const controlRef = useRef('play');

    //Ref a cui viene assegnato il countdown per far scomparire i controlli dopo ogni keypress
    const controlsCountdownRef = useRef(null);

    const seekToRef = useRef(instanceOfPlayer.currentTime);

    //Variabile a cui verranno assegnati i keydownHandler.
    let onKeyDown = undefined;


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

    //useEffect per monitorare gli stati del player
    /* useEffect(() => {
        console.log('playerState: ', playerState);
        console.log('Is the player paused?', instanceOfPlayer.paused);
    }, [playerState, instanceOfPlayer.paused]) */
    ///////////////////////////////////////////////

    //Funzione che resetta il countdown per nascondere i controlli dopo ogni keypress
    const resetControlsCountdown = () => {
        clearTimeout(controlsCountdownRef.current);
        controlsCountdownRef.current = null;
        controlsCountdownRef.current = setTimeout(() => {
            setDisplayControls(false);
            pauseSpatialNavigation();
        }, controlsCountdownFromConfig)
    }
    //////////////////////////////////////////////

    //Comportamento delle frecce direzionali e del tasto Back, differenziato tra quando i controlli sono visibili e quando non lo sono. La navigazione spaziale dei tasti direzionali, tuttavia, è gestita da Antares.
    const onKeyDownHandler = (e) => {
        if (
            e.keyCode === 37 ||
            e.keyCode === 39 ||
            e.keyCode === 38 ||
            e.keyCode === 40
        ) {
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
                /* console.log('parentFocusable: ', parentFocusable); */
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

    //Funzione che ferma le azioni di rewind o fast forward in corso da chiamare prima di cominciare nuove azioni, in modo che le precedenti e le successive non vadano in contrasto.
    const clearControls = () => {
        seekrateRef.current = 0;
        clearInterval(seekingRef.current);
        seekingRef.current = null;
        console.log('CLEARING INTERVAL FROM PLAY BUTTON')
    }

    useEffect(() => {
        console.log('CLEARING THE INTERVAL WITH useEffect')
        clearInterval(seekingRef.current);
        seekingRef.current = false;
    }, [controlRef.current])

    //Funzionalità del tasto Play
    const playOrPause = () => {
        if (!displayControls) {
            setDisplayControls(true);
            resetControlsCountdown();
        } else {
            controlRef.current = 'play';
            clearControls();
            setIsPlaying(!isPlaying)
            resetControlsCountdown();
            if (instanceOfPlayer.paused) {
                instanceOfPlayer.play()
            } else {
                controlRef.current = 'pause'
                instanceOfPlayer.pause()
            }
        }
    }

    //Funzionalità del tasto rewind
    const onRewind = () => {
        if (!displayControls) {
            resetControlsCountdown();
        } else {
            seekingRef.current = true;
            setIsPlaying(false);
            instanceOfPlayer.pause();

            controlRef.current = 'rewind';

            switch (seekrateRef.current) {
                case 0:
                    seekrateRef.current = 2;
                    break;
                case 2:
                    seekrateRef.current = 4;
                    break;
                case 4:
                    seekrateRef.current = 8;
                    break;
                default:
                    return;
            }

            seekingRef.current = setInterval(() => {
                console.log('SKIPPING BACKWARDS');
                instanceOfPlayer.currentTime -= 5 * seekrateRef.current;
                resetControlsCountdown()
                if (seekToRef.current <= 0) {
                    //Comportamento al raggiungimento dello 0 durante il rewind.
                    console.log('LEFT EDGE REACHED');
                    seekToRef.current = instanceOfPlayer.currentTime;
                    controlRef.current = 'play';
                    instanceOfPlayer.play();
                    focusTo('play-button')
                }
            }, 1000)
        }
    }

    //Funzionalità del tasto fast forward
    const onFastForward = () => {
        if (!displayControls) {
            resetControlsCountdown()
        } else {
            seekingRef.current = true;
            setIsPlaying(false);
            instanceOfPlayer.pause();

            if (controlRef.current !== 'fast-forward') {
                clearInterval(seekingRef.current)
                seekingRef.current = null
                seekrateRef.current = 0;
            }

            controlRef.current = 'fast-forward';

            switch (seekrateRef.current) {
                default:
                    seekrateRef.current = 2;
                    break;
                case 2:
                    seekrateRef.current = 4;
                    break
                case 4:
                    seekrateRef.current = 8;
            }

            if (seekingRef.current === null) {
                seekingRef.current = setInterval(() => {
                    seekToRef.current = instanceOfPlayer.currentTime;
                    if (seekToRef.current < duration) {
                        console.log('SKIPPING FORWARD')
                        resetControlsCountdown()
                        seekToRef.current += 5 * seekrateRef.current;
                    } /* else {
                        console.log('RIGHT EDGE REACHED')
                        focusTo(parentFocusable);
                        setReadyToPlay(false);
                        setDisplayPlayer(false);
                        resumeSpatialNavigation();
                    } */

                }, 1000)
            }

            console.log('fast forward to: ', instanceOfPlayer.currentTime);
        }
    }


    //Gestione estetica del focus sui tasti triggerata sull'onFocus dei singoli tasti
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
                    <span className='seekrate rewind-seekrate'
                        style={{
                            opacity: `${controlRef.current === 'rewind' ? '1' : '0'}`,
                            color: `${isHighlighted.rewind ? 'black' : 'black'}`
                        }}>{`x${seekrateRef.current}`}</span>
                </AntaresFocusable>
                <AntaresFocusable
                    classname='play-button controls-button'
                    focusedClassname='controls-button-focused'
                    focusableId='play-button'
                    index={1}
                    onEnterDown={playOrPause}
                    onFocus={highlightPlay}>
                    <img alt='play/pause icon' src={isPlaying ? (isHighlighted.play ? HighlightedPause : Pause) : (isHighlighted.play ? HighlightedPlay : Play)} className='controls-icon' />
                </AntaresFocusable>
                <AntaresFocusable classname='controls-button fast-forward'
                    focusableId='fast-forward-button'
                    focusedClassname='controls-button-focused'
                    index={2}
                    onEnterDown={onFastForward}
                    onFocus={highlightFastForward}>
                    <span className='seekrate fast-forward-seekrate'
                        style={{
                            opacity: `${controlRef.current === 'fast-forward' ? '1' : '0'}`,
                            color: `${isHighlighted.forward ? 'black' : 'black'}`
                        }}>{`x${seekrateRef.current}`}</span>
                    <img alt='fast-forward-icon' src={isHighlighted.forward ? HighlightedFastForward : FastForward} className='controls-icon' />
                </AntaresFocusable>
            </AntaresHorizontalList>
        </div >
    )
}

export default navigationUtilities(Controls)
