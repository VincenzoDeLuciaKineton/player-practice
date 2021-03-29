import React, { createContext, useState } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {

    const [displayPlayer, setDisplayPlayer] = useState(false);
    const [neededPlayer, setNeededPlayer] = useState(null);
    const [parentFocusable, setParentFocusable] = useState(null);

    return (
        <PlayerContext.Provider value={{ displayPlayer, setDisplayPlayer, neededPlayer, setNeededPlayer, parentFocusable, setParentFocusable }}>
            {children}
        </PlayerContext.Provider>
    )
}