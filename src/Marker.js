import React, { useEffect, useState, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './App.css';

export default function Marker({map, markerData, selectCafe}) {
    const theMarker = useRef(null);

    useEffect(() => {
        if (!map) return;
        if (theMarker.current) theMarker.current.remove();
        if (!markerData.visible) return;
        var color = markerData.color_code;
        if (markerData.is_selected) color = "#e6353d";
        const marker = new maptilersdk.Marker({color: color})
        .setLngLat([markerData.longitude, markerData.latitude])
        .addTo(map);

        theMarker.current = marker;

        marker.getElement().title = markerData.name

        marker.getElement().addEventListener("click", (event) => {
            event.preventDefault(); 
            event.stopPropagation();
            selectCafe(markerData);
        });
    }, [map, markerData, selectCafe]);
    
    return (null);
}