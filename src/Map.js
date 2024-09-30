import React, { useRef, useEffect, useState } from 'react';
import Marker from './Marker';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './App.css';
import { hover } from '@testing-library/user-event/dist/hover';

export default function Map({lng, lat, zoom, data, selectCafe, hoverCafe}) {
    const mapContainer = useRef(null);
    maptilersdk.config.apiKey = 'bFXUsq2lCBRLxW1UauI0';

    const [theMap, setTheMap] = useState(null);

    useEffect(() => {
      if (theMap) theMap.remove();
      setTheMap(new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS.PASTEL,
        center: [lng, lat],
        zoom: zoom
      }));
    }, []);

    useEffect(() => {
      if (theMap) {
          theMap.jumpTo({
          center: [lng, lat],
          zoom: zoom
          });
      }
    }, [lng, lat, zoom]);

    return (
      <div className="map-wrap">
          <div ref={mapContainer} className="map"></div>
          {data.map((cafe, index) => (
            <Marker 
              key={index}
              map={theMap}
              markerData={cafe} 
              selectCafe={selectCafe}
              hoverCafe={hoverCafe}
            />
          ))}
      </div>
    );
  }