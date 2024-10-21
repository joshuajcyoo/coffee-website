import React, { useRef, useEffect, useState } from 'react';
import Marker from './Marker';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './App.css';
import {ReactComponent as ListOpen} from './Logos/toggle-open.svg'
import {ReactComponent as ListClose} from './Logos/toggle-close.svg'
import {ReactComponent as ResetView} from './Logos/reset-view.svg'

export default function Map({longitude, setLongitude, latitude, setLatitude, zoom, setZoom, data, setData, selectCafe, displayRight, setDisplayRight, hoveredCafe, selectedCafe, changeZoom, neighborhoodFunction}) {
  const mapContainer = useRef(null);
  maptilersdk.config.apiKey = 'bFXUsq2lCBRLxW1UauI0';
  const [theMap, setTheMap] = useState(null);

  const [showResetView, setShowResetView] = useState(false);

  useEffect(() => {
    if (theMap) theMap.remove();
    setTheMap(new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS.PASTEL,
      center: [longitude, latitude],
      zoom: zoom
    }));
  }, []);

  useEffect(() => {
    if (theMap) {
        theMap.jumpTo({
        center: [longitude, latitude],
        zoom: zoom
        });

        theMap.on('moveend', () => {
          const newCenter = theMap.getCenter();
          setLongitude(newCenter.lng);
          setLatitude(newCenter.lat);

          var newLatitude;
          var newLongitude;

          if (neighborhoodFunction) {
            var newData = [...data];
            newData.forEach(element => {
              if (neighborhoodFunction(element)) {
                newLatitude = element.n_latitude;
                newLongitude = element.n_longitude;
              }
            });

            if (newCenter.lat === newLatitude && newCenter.lng === newLongitude) {
              setShowResetView(false);
            }
            else setShowResetView(true);
          }
          else {
            if (newCenter.lat === 34.06248189100365 && newCenter.lng === -118.34569321430635) {
              setShowResetView(false);
            }
            else setShowResetView(true);
          }
        });
  
        theMap.on('zoomend', () => {
          setShowResetView(true);
          const newZoom = theMap.getZoom();
          setZoom(newZoom);
          console.log(newZoom);
        });
    }
  }, [longitude, latitude, zoom, neighborhoodFunction]);

  const handleMapToggle = () => {
    if (displayRight) {
      var newData = [...data];
      newData.forEach(element => element.is_selected = false);
      setData(newData);
    }
    setDisplayRight(!displayRight);
  }

  const handleResetView = () => {
    changeZoom(data, true);
    setShowResetView(false);
  }

  return (
    <div className="map-wrap">
        <div ref={mapContainer} className="map"></div>
        {data.map((cafe, index) => (
          <Marker 
            key={index}
            map={theMap}
            markerData={cafe} 
            selectCafe={selectCafe}
            hoveredCafe={hoveredCafe}
            selectedCafe={selectedCafe}
          />
        ))}
        <button className="map-button" id="map-toggle-list" onClick={handleMapToggle}>
          {displayRight ? "Close List" : "Open List"}
          {displayRight ? <ListClose className='map-icon' id='map-close-icon'/> : <ListOpen className='map-icon'/>}
        </button>
        {showResetView && 
          <button className="map-button" id="map-reset-view" onClick={handleResetView}>
            Reset View
            <ResetView className='map-icon' />
          </button>
        }
    </div>
  );
}