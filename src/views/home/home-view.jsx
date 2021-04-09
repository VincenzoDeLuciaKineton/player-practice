import React, { useState, useEffect, useContext } from 'react'
import './home-view.css'
import { AntaresHorizontalList, navigationUtilities } from 'antares'
import { ConfigContext } from '../../context/ConfigContext'
import HomeItem from '../home-item/home-item'

const HomeView = ({ focusTo }) => {

    const [videos, setVideos] = useState(null);

    const { urlsFromConfig } = useContext(ConfigContext);

    useEffect(() => {
        let videoList = urlsFromConfig.map((video, index) => {
            return <HomeItem
                className='home-item'
                key={index}
                index={index}
                url={video.url}>
                <span>Video {index + 1}</span>
            </HomeItem>
        });
        setVideos(videoList)
    }, [urlsFromConfig])

    useEffect(() => {
        focusTo('home-button-id-0')
    }, [])

    return (
        <AntaresHorizontalList containerClassname='home-outer'
            innerClassname='home-inner'
            focusableId='home'
            retainLastFocus={true}
            innerWidth={1920}>
            {videos}
        </AntaresHorizontalList>
    )
}

export default navigationUtilities(HomeView)
