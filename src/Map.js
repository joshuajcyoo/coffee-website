import React, { useRef, useEffect, useState } from 'react';
import Marker from './Marker';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './App.css';
import {ReactComponent as ListOpen} from './Logos/toggle-open.svg'
import {ReactComponent as ListClose} from './Logos/toggle-close.svg'
import {ReactComponent as ResetView} from './Logos/reset-view2.svg'
import {ReactComponent as CafeView} from './Logos/reset-cafe.svg'

export default function Map({longitude, setLongitude, latitude, setLatitude, zoom, setZoom, data, setData, selectCafe, displayRight, setDisplayRight, hoveredCafe, selectedCafe, changeZoom, neighborhoodFunction, filterFunction, allFilters}) {
  const mapContainer = useRef(null);
  maptilersdk.config.apiKey = 'bFXUsq2lCBRLxW1UauI0';
  const [theMap, setTheMap] = useState(null);

  const [showResetView, setShowResetView] = useState(false);
  const [showCafeView, setShowCafeView] = useState(false);

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
              const selectedCafes = data.filter(cafe => cafe.is_selected);
              if (selectedCafes.length === 1) {
                setShowCafeView(true);
              }
            }
            else {
              setShowResetView(true);
              setShowCafeView(false);
            }
          }
          else {
            if (newCenter.lat === 34.06248189100365 && newCenter.lng === -118.34569321430635) {
              setShowResetView(false);
              const selectedCafes = data.filter(cafe => cafe.is_selected);
              console.log("why", selectedCafes)
              if (selectedCafes.length === 1) {
                setShowCafeView(true);
              }
            }
            else {
              setShowResetView(true);
              setShowCafeView(false);
            }
          }
        });
  
        theMap.on('zoomend', () => {
          setShowResetView(true);
          const newZoom = theMap.getZoom();
          setZoom(newZoom);
        });
    }
  }, [longitude, latitude, zoom, neighborhoodFunction, selectedCafe]);

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

  const handleCafeView = () => {
    setShowCafeView(false);

    const selectedCafes = data.filter(cafe => cafe.is_selected);
    if (selectedCafes.length === 1) {
      setLatitude(selectedCafes[0].latitude);
      setLongitude(selectedCafes[0].longitude);
      setZoom(14);
    }
  }

  useEffect(() => {
    console.log(allFilters);
    const selectedCafes = data.filter(cafe => cafe.is_selected);
    if (selectedCafes.length === 0) {
      setShowCafeView(false);
    }
    const visibleCafes = data.filter(cafe => cafe.visible);
    if (visibleCafes.length === 1) {
      setShowResetView(false);
    }
  }, [data, displayRight]);

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
            neighborhoodFunction={neighborhoodFunction}
            selectedCafes={data.filter(cafe => cafe.is_selected)}
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
        {showCafeView && 
          <button className="map-button" id="map-cafe-view" onClick={handleCafeView}>
            View Cafe
            <CafeView className='map-icon' id='map-icon-cafe-view'/>
          </button>
        }
        {!displayRight && allFilters.length !== 0 && 
          <div className="map-display" id="map-filters-list">
            <div>Filters / Sort</div>
            <hr />
            <ul>
            {allFilters.map((filter) => (
              <li>{filter}</li>
            ))}
            </ul>
          </div>
        }
    </div>
  );
}