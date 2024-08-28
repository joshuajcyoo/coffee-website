import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './Map.css';

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const tokyo = { lng: -118.30864605232344, lat: 34.06136799199684 };
    const zoom = 11;
    maptilersdk.config.apiKey = 'bFXUsq2lCBRLxW1UauI0';

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maptilersdk.Map({
          container: mapContainer.current,
          style: maptilersdk.MapStyle.STREETS,
          center: [tokyo.lng, tokyo.lat],
          zoom: zoom
        });

        const marker = new maptilersdk.Marker({color: "#FF0000"})
        .setLngLat([tokyo.lng, tokyo.lat])
        .addTo(map.current);

        marker.getElement().title = "Test Title"

        marker.getElement().addEventListener("click", () => {
            console.log(marker.getElement().title)
          });
      
      }, [tokyo.lng, tokyo.lat, zoom]);

    return (
    <div className="map-wrap">
        <div ref={mapContainer} className="map">
          <Marker
            longitude={tokyo.lng}
            latitude={tokyo.lat}
            color="#FF0000"
            onClick={() => alert('Marker clicked!')}
          />
        </div>
    </div>
    );
  }