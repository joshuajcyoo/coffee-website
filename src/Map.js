import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './Map.css';

export default function Map({lng, lat, zoom, data}) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const longitude = lng
    const latitude = lat
    maptilersdk.config.apiKey = 'bFXUsq2lCBRLxW1UauI0';
    
    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maptilersdk.Map({
          container: mapContainer.current,
          style: maptilersdk.MapStyle.STREETS,
          center: [longitude, latitude],
          zoom: zoom
        });

        data.forEach((markerData) => {
          const marker = new maptilersdk.Marker({color: markerData.color_code})
            .setLngLat([markerData.longitude, markerData.latitude])
            .addTo(map.current);

          marker.getElement().title = markerData.name

          marker.getElement().addEventListener("click", () => {
            console.log(marker.getElement().title)
          });
        });

      }, [longitude, latitude, zoom]);

    return (
    <div className="map-wrap">
        <div ref={mapContainer} className="map">
        </div>
    </div>
    );
  }