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
import HighlightedPause from "../assets/images/pause-focus.png";
import HighlightedPlay from "../assets/images/play-focus.png";
import HighlightedRewind from "../assets/images/bw-focus.png";
import HighlightedFastForward from "../assets/images/fw-focus.png";
///////////////////////////////

//Props passate al player, rispettivamente: il player su cui andranno ad agire i controlli, la durata del video in riproduzione, il tempo in cui si trova la riproduzione del player (currentTime), la funzione per aggiornare il suddetto tempo e infine utilities di Antares per la navigazione.
const Controls = ({ instanceOfPlayer, duration, currentTime, setCurrentTime, focusTo, resumeSpatialNavigation, pauseSpatialNavigation }) => {

    //Contesti utilizzati: valori e funzioni comuni a più componenti/pagine 
    const { setReadyToPlay, controlsCountdownFromConfig } = useContext(ConfigContext)
    const { setDisplayPlayer, parentFocusable } = useContext(PlayerContext);

    //Stati: valori pertinenti al singolo componente/pagina il cui cambiamento causa un re-render
    //Variabile di stato che decreta se i controlli siano visibili o meno. Al suo cambiamento è subordinata la visibility dell'intero componente, tramite le animazioni fade-in e fade-out.
    const [displayControls, setDisplayControls] = useState(true)

    //Variabile di stato che decreta se ad essere mostrata è l'icona pause(isPlaying===true) o l'icona play(isPlaying===false).
    const [isPlaying, setIsPlaying] = useState(true);

    //Variabile di stato che regola esteticamente quale dei controlli sia quello in focus.
    const [isHighlighted, setIsHighlighted] = useState({
        play: true,
        forward: false,
        rewind: false,
    });

    //Ref che indica se il player sia in seeking o meno; quando è in seeking sarà una setInterval, quando non lo è sarà null.
    const seekingRef = useRef(null);

    //Ref e variabile di stato che decretano di quanto debba andare avanti o indietro la currentTime ad ogni intervallo della funzione di fast forward o rewind. La ref mantiene il valore aggiornato, mentre aggiornare lo stato triggera il re-render.
    const seekrateRef = useRef(2);
    const [seekRate, setSeekRate] = useState(2);

    //Ref che indica quale sia l'ultimo comando inviato dai controlli al player
    const controlRef = useRef('play');

    //Ref a cui viene assegnato il countdown per far scomparire i controlli dopo ogni keypress
    const controlsCountdownRef = useRef(null);

    //Ref e variabile dis tato che indicano fino a che punto mandare avanti la currentTime durante un fast forward o un rewind. La ref aggiorna il valore dinamicamente, mentre settare lo stato triggera il re-render
    const seekToRef = useRef(currentTime);
    const [seekTo, setSeekTo] = useState(currentTime);

    //Variabile a cui verranno assegnati i keydownHandler.
    let onKeyDown = undefined;


    // useEffect di mount
    useEffect(() => {
        focusTo('play-button');
        resetControlsCountdown();

        return () => {
            clearTimeout(controlsCountdownRef.current);
            controlsCountdownRef.current = null;
            clearInterval(seekingRef.current);
            seekingRef.current = null;
        }

    }, [])

    ///////////////////////////////////////////////////
    //useEffect per monitorare gli stati del player
    /* useEffect(() => {
        console.log('playerState: ', playerState, currentTime);
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

    //Comportamento delle frecce direzionali e del tasto Back, differenziato tra quando i controlli sono visibili e quando non lo sono. La navigazione spaziale dei tasti direzionali, tuttavia, è gestita da Antares. Lo useEffect seguente aggiunge il keyDownHandler quando questo è disponibile.
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
                /* console.log('parentFocusable: ', parentFocusable); */
                resumeSpatialNavigation();
                focusTo(parentFocusable);
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

    //Funzione che ferma le azioni di rewind o fast forward in corso da chiamare prima di cominciare nuove azioni, in modo che le precedenti e le successive non vadano in contrasto.
    const clearControls = () => {
        seekrateRef.current = 0;
        clearInterval(seekingRef.current);
        seekingRef.current = null;
    }

    //Funzionalità del tasto Play
    const playOrPause = () => {
        if (!displayControls) {
            setDisplayControls(true);
            resetControlsCountdown();
        } else {
            if (controlRef.current === 'fast-forward' || controlRef.current === 'rewind') {
                setCurrentTime(seekTo);
                instanceOfPlayer.currentTime = seekTo;
            }
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

    //Funzionalità dei tasti fast-forward e rewind
    const onFastForwardOrRewind = (command) => {
        //Logica comune a entrambi i controlli
        if (!displayControls) {
            setDisplayControls(true);
            resetControlsCountdown()
        } else {
            if (controlRef.current !== command) {
                setIsPlaying((false));
                instanceOfPlayer.pause();
                clearControls();
                seekToRef.current = currentTime;
            }

            controlRef.current = command;

            switch (seekrateRef.current) {
                default:
                    return;
                case 0:
                    seekrateRef.current = 2;
                    setSeekRate(2)
                    break;
                case 2:
                    seekrateRef.current = 4;
                    setSeekRate(4);
                    break;
                case 4:
                    seekrateRef.current = 8;
                    setSeekRate(8);
                    break;
            }

            clearInterval(seekingRef.current);

            seekingRef.current = setInterval(() => {
                resetControlsCountdown();
                //Fast forward
                if (command === 'fast-forward') {
                    if (seekToRef.current < duration - (5 * seekrateRef.current)) {
                        if (duration - (5 * seekrateRef.current) < seekToRef.current < duration) {
                            seekToRef.current += 5 * seekrateRef.current;
                            setSeekTo(seekToRef.current);
                            console.log('Forwarding seekTo to: ', seekToRef.current)
                            console.log('seekingRef.current: ', seekingRef.current);
                        } else {
                            console.log('LAST FORWARD, ', seekToRef.current, duration);
                            seekToRef.current = duration;
                            setSeekTo(seekToRef.current);
                        }
                    } else {
                        resumeSpatialNavigation();
                        focusTo(parentFocusable);
                        setReadyToPlay(false);
                        setDisplayPlayer(false);
                    }
                } else if (command === 'rewind') {
                    // Rewind
                    if (seekToRef.current > 0) {
                        seekToRef.current -= 5 * seekrateRef.current;
                        setSeekTo(seekToRef.current);
                        console.log('Rewinding seekTo to: ', seekTo)
                    } else {
                        seekToRef.current = 0;
                        setSeekTo(seekToRef.current);
                        instanceOfPlayer.currentTime = 0;
                    }
                }
            }, 1000)
        }
    }

    //Gestione estetica del focus sui tasti triggerata sull'onFocus dei singoli tasti (vedi variabile di stato isHighlighted).
    const highlight = (icon) => {
        switch (icon) {
            default:
                setIsHighlighted({ play: true, forward: false, rewind: false });
                break;
            case 'rewind':
                setIsHighlighted({ play: false, forward: false, rewind: true });
                break;
            case 'fast-forward':
                setIsHighlighted({ play: false, forward: true, rewind: false });
                break;
        }
    };

    //Render del componente
    return (
        <div className={`${displayControls ? 'fade-in' : 'fade-out'} controls-and-progress-bar`}>
            <ProgressBarView duration={duration} currentTime={controlRef.current === 'fast-forward' || controlRef.current === 'rewind' ? seekTo : currentTime} />
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
                    onEnterDown={() => { onFastForwardOrRewind('rewind') }}
                    onFocus={() => { highlight('rewind') }}>
                    <img alt='rewind-icon'
                        src={isHighlighted.rewind ? HighlightedRewind : Rewind} />
                    <span className='seekrate rewind-seekrate'
                        style={{
                            opacity: `${controlRef.current === 'rewind' ? '1' : '0'}`,
                            color: `${isHighlighted.rewind ? '#3184c3' : 'white'}`
                        }}>{`x${seekRate}`}</span>
                </AntaresFocusable>
                <AntaresFocusable
                    classname='play-button controls-button'
                    focusedClassname='controls-button-focused'
                    focusableId='play-button'
                    index={1}
                    onEnterDown={playOrPause}
                    onFocus={() => { highlight('play') }}>
                    <img alt='play/pause icon'
                        src={isPlaying ? (isHighlighted.play ? HighlightedPause : Pause) : (isHighlighted.play ? HighlightedPlay : Play)} className='controls-icon' />
                </AntaresFocusable>
                <AntaresFocusable classname='controls-button fast-forward'
                    focusableId='fast-forward-button'
                    focusedClassname='controls-button-focused'
                    index={2}
                    onEnterDown={() => { onFastForwardOrRewind('fast-forward') }}
                    onFocus={() => { highlight('fast-forward') }}>
                    <span className='seekrate fast-forward-seekrate'
                        style={{
                            opacity: `${controlRef.current === 'fast-forward' ? '1' : '0'}`,
                            color: `${isHighlighted.forward ? '#3184c3' : 'white'}`
                        }}>{`x${seekRate}`}</span>
                    <img alt='fast-forward-icon'
                        src={isHighlighted.forward ? HighlightedFastForward : FastForward} className='controls-icon' />
                </AntaresFocusable>
            </AntaresHorizontalList>
        </div >
    )
}

export default navigationUtilities(Controls)
