import React, { useEffect } from 'react';
import { altair } from 'antares'
import AppView from '../views/app/app-view';
import { ConfigProvider } from '../context/ConfigContext'
import { ErrorProvider } from '../context/ErrorContext'
import { PlayerProvider } from '../context/PlayerContext'

const AppController = () => {

    useEffect(() => {

        if (altair.isHbbTV()) {
            const channel = altair.getCurrentChannel();
            window.channel = document.getElementById("mainVideoObject").getChannelConfig().channelList.getChannelByTriplet(
                channel.onid,
                channel.tsid,
                channel.sid
            )
        }
    }, [])

    return (

        <ErrorProvider>
            <ConfigProvider>
                <PlayerProvider>
                    <div className='app-controller'>
                        <AppView />
                    </div>
                </PlayerProvider>
            </ConfigProvider>
        </ErrorProvider>

    )
}

export default AppController
