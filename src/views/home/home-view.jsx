import React, { useEffect } from 'react'
import './home-view.css'
import { AntaresHorizontalList, AntaresFocusable, navigationUtilities } from 'antares'
const HomeView = (props) => {

    useEffect(() => {
        props.focusTo('home-button-id')
    }, [])

    const onEnterDown = () => {
        props.setStartPlayer(true);
    }

    return (
        <AntaresHorizontalList containerClassname='home-outer' innerClassname='home-inner' focusableId='home'>
            <AntaresFocusable classname='home-button' focusedClassname='focused-home-button' focusableId='home-button-id' onEnterDown={onEnterDown}>
                <span>Go to the player</span>
            </AntaresFocusable>
        </AntaresHorizontalList>
    )
}

export default navigationUtilities(HomeView)
