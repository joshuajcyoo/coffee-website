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
import {ReactComponent as WorkabilityIcon2} from './Logos/sort-workability2.svg'
import {ReactComponent as DrinksIcon} from './Logos/sort-drinks2.svg'
import {ReactComponent as WelcomeInfo} from './Logos/welcome-info.svg'
import {ReactComponent as ArrowInfo2} from './Logos/arrow-info3.svg'

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

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showArrow, setShowArrow] = useState(true);
  const toggleWelcomeModal = () => {
    setShowWelcomeModal(!showWelcomeModal);
    setShowArrow(false);
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
          
          <div id='welcome-message1'>Eight years ago I moved to LA, and I very quickly made it a goal to visit as many coffee shops as I possibly could. Just for fun, I created a simple scoring system that I could assess a coffee shop by, and I recorded all of the data for every single coffee shop into my Notes app, with the hope that I’d find some use for it one day. This website is my best attempt to make use of that data.</div>
          <div id='welcome-message2'>With the much appreciated help from my friend Josh, I've been working on this website for about three months so far, but I'm sorry for any bugs and design flaws you may run into. I plan on this being a continually iterative project to work on until I run out of new ideas.</div>
          <div id='welcome-message3'>Thank you for taking the time to check my website out. I hope it makes it easier for you to discover new coffee shops yourself, or also let me know how wrong my opinions are.</div>

          {/* <div id='welcome-score-title'>Explaining the Scoring System</div> */}
          <hr id='welcome-divider' />

          <div id='welcome-message3'>Each coffee shop is <span style={{fontWeight: 'bold'}}>scored out of 10</span>, comprised of four categories of subscores:</div>
          <div id='welcome-score-container'>
            <div className='welcome-score-item'>
              <AmbianceIcon className='welcome-score-icon'/>
              <div className='welcome-score-title'>Ambiance</div>
              {/* <div className='welcome-score-subtitle'>(0 to 3)</div> */}
              <div className="welcome-score-bar-container">
                <div className="welcome-score-bar">
                  <div className="welcome-tick-container" style={{left: '0%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">0</span>
                  </div>
                  <div className="welcome-tick-container" style={{left: '16.6%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '33.3%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '50%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">1.5</span>
                  </div>
                  <div className="welcome-tick-container" style={{left: '66.7%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '83.3%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '100%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">3</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='welcome-score-add'>+</div>
            <div className='welcome-score-item'>
              <WorkabilityIcon2 className='welcome-score-icon'/>
              <div className='welcome-score-title'>Workability</div>
              {/* <div className='welcome-score-subtitle'>(0 to 3)</div> */}
              <div className="welcome-score-bar-container">
                <div className="welcome-score-bar">
                  <div className="welcome-tick-container" style={{left: '0%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">0</span>
                  </div>
                  <div className="welcome-tick-container" style={{left: '16.6%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '33.3%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '50%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">1.5</span>
                  </div>
                  <div className="welcome-tick-container" style={{left: '66.7%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '83.3%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '100%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">3</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='welcome-score-add'>+</div>
            <div className='welcome-score-item'>
              <DrinksIcon className='welcome-score-icon'/>
              <div className='welcome-score-title'>Drinks</div>
              {/* <div className='welcome-score-subtitle'>(0 to 3)</div> */}
              <div className="welcome-score-bar-container">
                <div className="welcome-score-bar">
                  <div className="welcome-tick-container" style={{left: '0%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">0</span>
                  </div>
                  <div className="welcome-tick-container" style={{left: '16.6%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '33.3%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '50%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">1.5</span>
                  </div>
                  <div className="welcome-tick-container" style={{left: '66.7%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '83.3%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '100%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">3</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='welcome-score-add'>+</div>
            <div className='welcome-score-item'>
              <OutletIcon className='welcome-score-icon'/>
              <div className='welcome-score-title'>Outlets</div>
              {/* <div className='welcome-score-subtitle'>(0 to 1)</div> */}
              <div className="welcome-score-bar-container">
                <div id='welcome-score-bar-outlets'>
                  <div className="welcome-tick-container" style={{left: '0%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">0</span>
                  </div>
                  <div className="welcome-tick-container" style={{left: '25%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '50%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">0.5</span>
                  </div>
                  <div className="welcome-tick-container" style={{left: '75%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div>
                  <div className="welcome-tick-container" style={{left: '100%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">1</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='welcome-score-equals'>=</div>
            <div className='welcome-score-item'>
              <ScoreIcon id='welcome-overall-score-icon'/>
              <div className='welcome-score-title'>Overall Score</div>
              <div className="welcome-score-bar-container">
                <div id="welcome-score-bar-overall">
                  <div className="welcome-tick-container" style={{left: '0%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">0</span>
                  </div>
                  {/* <div className="welcome-tick-container" style={{left: '5%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div> */}
                  <div className="welcome-tick-container" style={{left: '10%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                  </div>
                  {/* <div className="welcome-tick-container" style={{left: '15%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div> */}
                  <div className="welcome-tick-container" style={{left: '20%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                  </div>
                  {/* <div className="welcome-tick-container" style={{left: '25%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div> */}
                  <div className="welcome-tick-container" style={{left: '30%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                  </div>
                  {/* <div className="welcome-tick-container" style={{left: '35%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div> */}
                  <div className="welcome-tick-container" style={{left: '40%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                  </div>
                  {/* <div className="welcome-tick-container" style={{left: '45%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div> */}
                  <div className="welcome-tick-container" style={{left: '50%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">5</span>
                  </div>
                  {/* <div className="welcome-tick-container" style={{left: '55%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div> */}
                  <div className="welcome-tick-container" style={{left: '60%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                  </div>
                  {/* <div className="welcome-tick-container" style={{left: '65%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div> */}
                  <div className="welcome-tick-container" style={{left: '70%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                  </div>
                  {/* <div className="welcome-tick-container" style={{left: '75%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div> */}
                  <div className="welcome-tick-container" style={{left: '80%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                  </div>
                  {/* <div className="welcome-tick-container" style={{left: '85%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div> */}
                  <div className="welcome-tick-container" style={{left: '90%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                  </div>
                  {/* <div className="welcome-tick-container" style={{left: '95%'}}>
                    <div className="welcome-tick welcome-tick-small"></div>
                  </div> */}
                  <div className="welcome-tick-container" style={{left: '100%'}}>
                    <div className="welcome-tick welcome-tick-large"></div>
                    <span className="welcome-tick-label">10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </WelcomeModal>

        {showArrow && <ArrowInfo2 className='map-icon' id='map-arrow-info-icon'/>}
    </div>
  );
}