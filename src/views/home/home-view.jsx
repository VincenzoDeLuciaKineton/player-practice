import React, { useEffect, useContext } from 'react'
import './home-view.css'
import { AntaresHorizontalList, AntaresFocusable, navigationUtilities } from 'antares'
import { PlayerContext } from '../../context/PlayerContext'
import { ConfigContext } from '../../context/ConfigContext'
import { ErrorContext } from '../../context/ErrorContext'
const HomeView = ({ focusTo }) => {

    const { setDisplayPlayer, setParentFocusable } = useContext(PlayerContext);
    const { url } = useContext(ConfigContext);
    const { setShowErrorModal, setErrorParentFocusable, setErrorMessage } = useContext(ErrorContext);

    useEffect(() => {
        focusTo('home-button-id');
    }, [])

    const onEnterDown = () => {
        setErrorParentFocusable('home-button-id');
        if (!url || url === '') {
            console.log('NO URL FOUND')
            focusTo('error-button-id');
            setErrorMessage('Unable to retrieve selected content')
            setShowErrorModal(true);
        } else {
            setParentFocusable('home');
            setDisplayPlayer(true);
        }
    }


    return (
        <AntaresHorizontalList containerClassname='home-outer'
            innerClassname='home-inner'
            focusableId='home'
            retainLastFocus={true}
            innerWidth={500}>
            <AntaresFocusable classname='home-button'
                focusedClassname='home-button-focused'
                focusableId='home-button-id'
                onEnterDown={onEnterDown}
                index={0}>
                <span>Go to the player</span>
            </AntaresFocusable>
        </AntaresHorizontalList>
    )
}

export default navigationUtilities(HomeView)
