import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './Map.css';

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const koreatown = { lng: -118.30864605232344, lat: 34.06136799199684 };
    const zoom = 11;
    maptilersdk.config.apiKey = 'bFXUsq2lCBRLxW1UauI0';

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maptilersdk.Map({
          container: mapContainer.current,
          style: maptilersdk.MapStyle.STREETS,
          center: [koreatown.lng, koreatown.lat],
          zoom: zoom
        });

        const marker = new maptilersdk.Marker({color: "#FF0000"})
        .setLngLat([koreatown.lng, koreatown.lat])
        .addTo(map.current);

        marker.getElement().title = "3THYME"

        marker.getElement().addEventListener("click", () => {
            console.log(marker.getElement().title)
          });
      
      }, [koreatown.lng, koreatown.lat, zoom]);

    return (
    <div className="map-wrap">
        <div ref={mapContainer} className="map" />
    </div>
    );
  }