import React, { useContext } from 'react'
import './home-item.css'
import { AntaresFocusable, navigationUtilities } from 'antares'
import { PlayerContext } from '../../context/PlayerContext'
import { ErrorContext } from '../../context/ErrorContext'

const HomeItem = ({ index, url, focusTo }) => {

    const { setDisplayPlayer, setNeededPlayer, setVideoToPlay, setParentFocusable } = useContext(PlayerContext);
    const { setShowErrorModal, setErrorMessage, setErrorParentFocusable } = useContext(ErrorContext);

    const onEnterDown = () => {
        if (url && url.endsWith('.mpd')) {
            setNeededPlayer('dashjs')
        } else if (url && url.endsWith('.m3u8')) {
            setNeededPlayer('videojs')
        }

        setVideoToPlay(url);
        setErrorParentFocusable(`home-button-id-${index}`);

        if (!url || url === '') {
            console.log('NO URLS FOUND')
            focusTo('error-button-id');
            setErrorMessage('Unable to retrieve selected content')
            setShowErrorModal(true);
        } else {
            setParentFocusable('home');
            setDisplayPlayer(true);
        }
    }

    return (
        <AntaresFocusable
            classname='home-button'
            focusedClassname='home-button-focused'
            focusableId={`home-button-id-${index}`}
            onEnterDown={onEnterDown}
            index={index}>
            <span>{url.slice(url.length - 4)}</span>
        </AntaresFocusable>
    )
}

export default navigationUtilities(HomeItem)
