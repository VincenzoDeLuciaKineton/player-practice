import React from 'react'
import './app-view.css'
import PlayerController from '../../controllers/player-controller'

const AppView = () => {
    return (
        <div className='app'>
            <PlayerController />
        </div>
    )
}

export default AppView
