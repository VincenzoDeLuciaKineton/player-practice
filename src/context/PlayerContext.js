import React, { createContext, useState } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {

    const [displayPlayer, setDisplayPlayer] = useState(false);
    const [neededPlayer, setNeededPlayer] = useState(null);
    const [videoToPlay, setVideoToPlay] = useState('');
    const [parentFocusable, setParentFocusable] = useState(null);

    return (
        <PlayerContext.Provider value={{ displayPlayer, setDisplayPlayer, neededPlayer, setNeededPlayer, videoToPlay, setVideoToPlay, parentFocusable, setParentFocusable }}>
            {children}
        </PlayerContext.Provider>
    )
}