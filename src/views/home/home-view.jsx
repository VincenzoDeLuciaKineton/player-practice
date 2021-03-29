import React, { useEffect, useContext } from 'react'
import './home-view.css'
import { AntaresHorizontalList, AntaresFocusable, navigationUtilities } from 'antares'
import { PlayerContext } from '../../context/PlayerContext'
import { ConfigContext } from '../../context/ConfigContext'
const HomeView = ({ focusTo }) => {

    const { setDisplayPlayer, setParentFocusable } = useContext(PlayerContext)
    const { readyToPlay, setReadyToPlay } = useContext(ConfigContext)

    useEffect(() => {
        focusTo('home-button-id');
    }, [])

    const onEnterDown = () => {
        setParentFocusable('home-button');
        setReadyToPlay(true);
        setDisplayPlayer(true);
    }

    return (
        <AntaresHorizontalList containerClassname='home-outer' innerClassname='home-inner' focusableId='home'>
            <AntaresFocusable classname='home-button' focusedClassname='home-button-focused' focusableId='home-button-id' onEnterDown={onEnterDown}>
                <span>Go to the player</span>
            </AntaresFocusable>
        </AntaresHorizontalList>
    )
}

export default navigationUtilities(HomeView)
