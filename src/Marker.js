import React, { useEffect, useState, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './App.css';

export default function Marker({map, markerData, selectCafe, hoveredCafe, selectedCafe}) {
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
        console.log(windowWidth);
        setWindowWidth(windowWidth);
        setWindowHeight(windowHeight);
    }, [windowHeight, windowWidth])

    useEffect(() => {
        if (!map) return;
        if (theMarker.current) theMarker.current.remove();
        if (!markerData.visible) return;
        var color = markerData.color_code;
        if (markerData.is_selected) color = "#E6353D";
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
        console.log("Window Height: ", windowHeight)
        console.log("selected", selectedCafe);
        console.log("hovered", hoveredCafe);
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
    
    return (
        <>
            {isHovered && (
                <div className="marker-hover" style={{ top: position.y, left: position.x }}>
                    <div className="marker-hover-content">
                        <div>{markerData.name}</div>
                        <div>Score: {markerData.score}</div>
                    </div>
                </div>
            )}
        </>
    );
}