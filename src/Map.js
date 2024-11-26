import React, { useRef, useEffect, useState } from 'react';
import Marker from './Marker';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './App.css';
import WelcomeModal from './WelcomeModal';
import {ReactComponent as ListOpen} from './Logos/toggle-open.svg'
import {ReactComponent as ListClose} from './Logos/toggle-close.svg'
import {ReactComponent as ResetView} from './Logos/reset-view2.svg'
import {ReactComponent as CafeView} from './Logos/reset-cafe.svg'
import {ReactComponent as CloseFilters} from './Logos/close-filters.svg'
import {ReactComponent as OutletIcon} from './Logos/filter-outlet.svg'
import {ReactComponent as StudyIcon} from './Logos/filter-study.svg'
import {ReactComponent as FoodIcon} from './Logos/filter-food.svg'
import {ReactComponent as GemIcon} from './Logos/filter-gem.svg'
import {ReactComponent as AestheticIcon} from './Logos/filter-aesthetic.svg'
import {ReactComponent as OutdoorIcon} from './Logos/filter-outdoor.svg'
import {ReactComponent as TimeIcon} from './Logos/filter-time.svg'
import {ReactComponent as ScoreIcon} from './Logos/sort-score.svg'
import {ReactComponent as AmbianceIcon} from './Logos/sort-ambiance.svg'
import {ReactComponent as WorkabilityIcon} from './Logos/sort-workability.svg'
import {ReactComponent as DrinksIcon} from './Logos/sort-drinks2.svg'
import {ReactComponent as WelcomeInfo} from './Logos/welcome-info.svg'

export default function Map({longitude, setLongitude, latitude, setLatitude, zoom, setZoom, data, setData, selectCafe, displayRight, setDisplayRight, hoveredCafe, selectedCafe, changeZoom, neighborhoodFunction, allFilters, sort, setSort, showSortPanel, setShowSortPanel}) {
  const mapContainer = useRef(null);
  maptilersdk.config.apiKey = 'bFXUsq2lCBRLxW1UauI0';
  const [theMap, setTheMap] = useState(null);

  const [showResetView, setShowResetView] = useState(false);
  const [showCafeView, setShowCafeView] = useState(false);

  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

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
            else {
              setShowResetView(true);
              setShowCafeView(false);
            }
          }
          else {
            if (newCenter.lat === 34.06248189100365 && newCenter.lng === -118.34569321430635) {
              setShowResetView(false);
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

  const handleClose = () => {
    setShowFiltersPanel(false);
    setShowSortPanel(false);
  }

  const handleSortPanelClose = () => {
    setShowSortPanel(false);
  }

  const getFilterIcon = (filter) => {
    switch (filter) {
      case "Outlets":
        return <OutletIcon className='map-panel-icon'/>;
      case "Study / Work":
        return <StudyIcon className='map-panel-icon'/>;
      case "Outdoor Area":
        return <OutdoorIcon className='map-panel-icon'/>;
      case "Aesthetic":
        return <AestheticIcon className='map-panel-icon'/>;
      case "Food Menu":
        return <FoodIcon className='map-panel-icon'/>;
      case "Hidden Gem":
        return <GemIcon className='map-panel-icon'/>;
      case "Open At":
        return <TimeIcon className='map-panel-icon'/>
    }
  };

  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const toggleWelcomeModal = () => {
    setShowWelcomeModal(!showWelcomeModal);
  };

  const getSortName = (sort) => {
    switch (sort) {
      case 0: return "Overall"
      case 1: return "Ambiance"
      case 2: return "Workability"
      case 3: return "Drinks"
    }
  }
  const getSortIcon = (sort) => {
    switch (sort) {
      case 0:
        return <ScoreIcon className='map-panel-icon' id='map-panel-score-icon'/>
      case 1:
        return <AmbianceIcon className='map-panel-icon'/>
      case 2:
        return <WorkabilityIcon className='map-panel-icon'/>
      case 3:
        return <DrinksIcon className='map-panel-icon'/>
    }
  }

  useEffect(() => {
    const selectedCafes = data.filter(cafe => cafe.is_selected);
    if (selectedCafes.length === 0) {
      setShowCafeView(false);
    }
    else if (selectedCafes.length === 1) {
      if (latitude !== selectedCafes[0].latitude && longitude !== selectedCafes[0].longitude && zoom != 14 && showResetView === false) setShowCafeView(true);
    }

    const visibleCafes = data.filter(cafe => cafe.visible);
    if (visibleCafes.length === 1) {
      setShowResetView(false);
    }
  }, [data, displayRight, allFilters, latitude, longitude, zoom]);

  useEffect(() => {
    if (allFilters.length === 0) setShowFiltersPanel(false);
    else setShowFiltersPanel(true);
  }, [allFilters])

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

        {allFilters.length !== 0 && showFiltersPanel &&
          <div className="map-display" id="map-filters-list">
            <button id="map-panel-close-button" onClick={handleClose}><CloseFilters className='map-icon' id='map-icon-close-filters'/></button>
            {showSortPanel && showFiltersPanel && displayRight &&
              <>
                <div id='map-display-title'>Current Sort</div>
                <hr id='map-filters-divider'/>
                <div id='map-sort-panel-item-filter'>
                  {getSortIcon(sort)}
                  {getSortName(sort)}
                </div>
              </>
            }

            <div id='map-display-title'>Active Filters</div>
            <hr id='map-filters-divider'/>
            <div id='map-filters-container'>
              {allFilters.map((filter) => (
                <div className='map-filters-panel-item'>
                  {getFilterIcon(filter)}
                  {filter}
                </div>
              ))}
            </div>
          </div>
        }
        {showSortPanel && !showFiltersPanel && displayRight &&
          <div className="map-display" id="map-sort-list">
            <button id="map-panel-close-button-sort" onClick={handleSortPanelClose}><CloseFilters className='map-icon' id='map-icon-close-filters'/></button>
            <div id='map-display-title'>Current Sort</div>
            <hr id='map-filters-divider'/>
            <div id='map-sort-panel-item'>
              {getSortIcon(sort)}
              {getSortName(sort)}
            </div>
          </div>
        }

        <button className="map-button" id="map-welcome-button" onClick={toggleWelcomeModal}>
          <WelcomeInfo className='map-icon' id='map-welcome-icon'/>
        </button>
        <WelcomeModal show={showWelcomeModal} handleClose={toggleWelcomeModal}>
          <div id="welcome-title">About</div>
          
          <div id='welcome-message'>Eight years ago I moved to LA, and very quickly made it a goal to visit as many coffee shops as I possibly could. Just for fun, I decided to create a simple scoring system that I could assess a coffee shop by and recorded this data in my Notes app, with the hope that I’d find a use for it one day.</div>
        </WelcomeModal>
    </div>
  );
}