import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './Map.css';

export default function Marker({map, markerData}) {
    useEffect(() => {
        if (map) {
            const marker = new maptilersdk.Marker({color: markerData.color_code})
            .setLngLat([markerData.longitude, markerData.latitude])
            .addTo(map);

            marker.getElement().title = markerData.name

            marker.getElement().addEventListener("click", () => {
                console.log(marker.getElement().title)
            });
        }
    }, [map, markerData]);
    
    return (null);
}