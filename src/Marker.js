import React, { useEffect, useState, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './App.css';

export default function Marker({map, markerData, selectCafe, hoveredCafe, selectedCafe, neighborhoodFunction, selectedCafes}) {
    const theMarker = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setWindowWidth(windowWidth);
        setWindowHeight(windowHeight);
    }, [windowHeight, windowWidth])

    useEffect(() => {
        if (!map) return;
        if (theMarker.current) theMarker.current.remove();
        if (!markerData.visible) return;
        var color = markerData.color_code;
        if (markerData.is_selected) color = "#000000";
        const marker = new maptilersdk.Marker({color: color})
        .setLngLat([markerData.longitude, markerData.latitude])
        .addTo(map);

        theMarker.current = marker;

        marker.getElement().title = markerData.name

        marker.getElement().addEventListener("click", (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            selectCafe(markerData);
            setIsHovered(false);
        });

        marker.getElement().addEventListener("mouseenter", () => {
            setIsHovered(true);
            const pixelPosition = map.project([markerData.longitude, markerData.latitude]);
            setPosition({ x: pixelPosition.x, y: pixelPosition.y - 42 });
        });

        marker.getElement().addEventListener("mouseleave", () => {
            setIsHovered(false);
        });

    }, [map, markerData, selectCafe]);

    useEffect(() => {
        if (selectedCafe === null || selectedCafe.id != markerData.id) {
            setIsHovered(false);
            if (hoveredCafe && hoveredCafe.id === markerData.id) {
                setIsHovered(true);
                const pixelPosition = map.project([markerData.longitude, markerData.latitude]);
                console.log("y", pixelPosition.y)
                if (pixelPosition.x > 0 && pixelPosition.x < (windowWidth * 0.67) && pixelPosition.y > 0 && pixelPosition.y < (windowHeight - 160)) {
                    setPosition({ x: pixelPosition.x, y: pixelPosition.y - 42 });
                }
                else setPosition({x: 0, y: 0});
            }
            else {
                setIsHovered(false);
            }
        }
        else {
            setIsHovered(false);
        }
    }, [hoveredCafe, selectedCafe])

    useEffect(() => {
        setIsHovered(false);
    }, [neighborhoodFunction]);
    
    return (
        <>
            {isHovered && (
                <div className="marker-hover" style={selectedCafes.length === 1 && selectedCafes[0].id === markerData.id ? {top: position.y, left: position.x, border: '2px solid black'} : { top: position.y, left: position.x, backgroundColor: markerData.color_code, border: '2px solid ' + markerData.color_code }}>
                    <div className="marker-hover-content" style={selectedCafes.length === 1 &&  selectedCafes[0].id === markerData.id ? {color: 'black'} : {backgroundColor: markerData.color_code, color: 'white'}}>
                        <div className='marker-content-title'>{markerData.name}</div>
                        <div className='marker-content-neighborhood'><span className='marker-content-neighborhood-title'>[{markerData.neighborhood}]</span></div>
                        <div className='marker-content-score'>Score: {markerData.score}</div>
                    </div>
                    <div className="marker-hover-triangle" style={selectedCafes.length === 1 && selectedCafes[0].id === markerData.id ? {borderTopColor: 'black'} : { borderTopColor: markerData.color_code }}></div>
                </div>
            )}
        </>
    );
}