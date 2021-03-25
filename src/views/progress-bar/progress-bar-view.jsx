import React, { useContext, useEffect, useState } from 'react'
import './progress-bar-view.jsx'
import { PlayerContext } from '../../context/PlayerContext'

const ProgressBarView = () => {

    const { duration, currentTime } = useContext(PlayerContext)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        setProgress(Math.floor((currentTime / duration) * 100))
    }, [currentTime])

    return (
        <div className='total-duration'>
            <div className='progress'></div>
            <span>Completion percentage: {Math.floor((currentTime / duration) * 100)}%</span>
        </div>
    )
}

export default ProgressBarView
