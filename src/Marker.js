import React, { useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './App.css';

export default function Marker({map, markerData, selectCafe}) {
    const [theMarker, setTheMarker] = useState(null);

    useEffect(() => {
        if (map && markerData.visible) {
            if (theMarker) theMarker.remove();
            var color = markerData.color_code;
            if (markerData.is_selected) color = "#e6353d";
            const marker = new maptilersdk.Marker({color: color})
            .setLngLat([markerData.longitude, markerData.latitude])
            .addTo(map);

            marker.getElement().title = markerData.name

            marker.getElement().addEventListener("click", (event) => {
                event.preventDefault(); 
                event.stopPropagation();
                selectCafe(markerData);
            });
            setTheMarker(marker);
        }
    }, [map, markerData, selectCafe]);
    
    return (null);
}