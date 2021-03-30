import React from 'react'
import './app-view.css'
import { navigationUtilities } from 'antares'
import PlayerController from '../../controllers/player-controller'
import HomeView from '../home/home-view'

const AppView = () => {

    return (
        <div className='app'>
            <HomeView />
            <PlayerController />
        </div>
    )
}

export default navigationUtilities(AppView)
