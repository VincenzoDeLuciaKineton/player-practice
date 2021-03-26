import React, { useEffect, useState } from 'react'
import './progress-bar-view.css'

const ProgressBarView = ({ duration, currentTime }) => {

    const [progress, setProgress] = useState(0)

    const secondsToTime = (duration) => {
        if (!duration || Number.isNaN(duration)) return "00:00";
        let seconds = parseInt(duration % 60);
        let minutes = parseInt((duration / 60) % 60);
        let hours = parseInt((duration / (60 * 60)) % 24);
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (hours === "00") return minutes + ":" + seconds;
        return hours + ":" + minutes + ":" + seconds;
    };

    useEffect(() => {
        setProgress(Math.floor(((currentTime / duration) * 100) * 1280) / 100)
    }, [currentTime, duration])

    return (
        <div className='progress-bar'>
            <div className='total-duration'>
                <div className='progress' style={{ width: `${progress}px` }}></div>

            </div>
            <div className='time-info'>
                <span>{secondsToTime(currentTime)}</span>
                <span>{secondsToTime(duration)}</span>
            </div>
        </div>
    )
}

export default ProgressBarView
