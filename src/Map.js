import React, { useRef, useEffect, useState } from 'react';
import Marker from './Marker';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './Map.css';

export default function Map({lng, lat, zoom, data, selectCafe}) {
    const mapContainer = useRef(null);
    maptilersdk.config.apiKey = 'bFXUsq2lCBRLxW1UauI0';

    const [map, setMap] = useState(null);

    useEffect(() => {
      setMap(new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [lng, lat],
        zoom: zoom
      }));
    }, [lng, lat, zoom]);

    return (
      <div className="map-wrap">
          <div ref={mapContainer} className="map">
          </div>
          <Marker 
            map={map} 
            markerData={data[0]} 
            selectCafe={selectCafe}
          />
          <Marker 
            map={map} 
            markerData={data[1]} 
            selectCafe={selectCafe}
          />
      </div>
    );
  }