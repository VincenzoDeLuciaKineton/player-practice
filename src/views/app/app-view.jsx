import React, { useContext } from 'react'
import './app-view.css'
import { navigationUtilities } from 'antares'
import { PlayerContext } from '../../context/PlayerContext'
import PlayerController from '../../controllers/player-controller'
import HomeView from '../home/home-view'

const AppView = () => {

    const { displayPlayer } = useContext(PlayerContext)

    return (
        <div className='app'>
            <HomeView />
            <PlayerController />
        </div>
    )
}

export default navigationUtilities(AppView)
