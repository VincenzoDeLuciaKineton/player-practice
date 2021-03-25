import React, { createContext, useState } from 'react'

export const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
    const [instanceOfPlayer, setInstanceOfPlayer] = useState(null);
    const [duration, setDuration] = useState(1)
    const [currentTime, setCurrentTime] = useState(0)

    return (
        <PlayerContext.Provider value={{ instanceOfPlayer, setInstanceOfPlayer, duration, setDuration, currentTime, setCurrentTime }}>
            {children}
        </PlayerContext.Provider>
    )
}