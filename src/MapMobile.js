import React, { useRef, useEffect, useState } from 'react';
import MapMarker from './MarkerMobile';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './App.css';
import './Mobile.css';
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
import {ReactComponent as OpenCardIcon} from './Logos/open-card.svg'
import GoogleMaps from "./Logos/googlemapslogo.png";

export default function MapMobile({longitude, setLongitude, latitude, setLatitude, zoom, setZoom, data, setData, selectCafe, displayRight, setDisplayRight, selectedCafe, setSelectedCafe, changeZoom, neighborhoodFunction, allFilters, sort, setSort, showSortPanel, setShowSortPanel, mobileState, setMobileState, exitMobilePage, setExitMobilePage}) {
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

  // useEffect(() => {
  //   if (theMap) {
  //     if (mobileState === "map") {
  //       theMap.flyTo({
  //       center: [longitude, latitude],
  //       zoom: zoom,
  //       speed: 1,
  //       curve: 1
  //       });
  //     }
  //     if (mobileState === "list") {
  //       console.log("come on")
  //       theMap.jumpTo({
  //         center: [longitude, latitude],
  //         zoom: zoom
  //       });
  //     }

  //       theMap.on('moveend', () => {
  //         const newCenter = theMap.getCenter();
  //         setLongitude(newCenter.lng);
  //         setLatitude(newCenter.lat);

  //         var newLatitude;
  //         var newLongitude;

  //         if (neighborhoodFunction) {
  //           var newData = [...data];
  //           newData.forEach(element => {
  //             if (neighborhoodFunction(element)) {
  //               newLatitude = element.n_latitude;
  //               newLongitude = element.n_longitude;
  //             }
  //           });

  //           if (newCenter.lat === newLatitude && newCenter.lng === newLongitude) {
  //             setShowResetView(false);
  //           }
  //           else {
  //             setShowResetView(true);
  //             setShowCafeView(false);
  //           }
  //         }
  //         else {
  //           if (newCenter.lat === 34.06248189100365 && newCenter.lng === -118.34569321430635) {
  //             setShowResetView(false);
  //           }
  //           else {
  //             setShowResetView(true);
  //             setShowCafeView(false);
  //           }
  //         }
  //       });
  
  //       theMap.on('zoomend', () => {
  //         // setShowResetView(true);
  //         const newZoom = theMap.getZoom();
  //         setZoom(newZoom);
  //       });
  //   }
  // }, [longitude, latitude, zoom, neighborhoodFunction, selectedCafe]);

  useEffect(() => {
    if (!theMap) return;

    if (mobileState === "map") {
      theMap.flyTo({
        center: [longitude, latitude],
        zoom: zoom,
        speed: 1,
        curve: 1,
      });
    } else if (mobileState === "list") {
      theMap.jumpTo({
        center: [longitude, latitude],
        zoom: zoom,
      });
    }
  }, [selectedCafe]);

  useEffect(() => {
    if (!theMap) return;

    if (theMap) {
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
        // setShowResetView(true);
        const newZoom = theMap.getZoom();
        setZoom(newZoom);
      });
    }
  }, [longitude, latitude, zoom, neighborhoodFunction]);

  // const handleMapToggle = () => {
  //   if (mobileState === 'map') {
  //     var newData = [...data];
  //     newData.forEach(element => element.is_selected = false);
  //     setData(newData);
  //     setSelectedCafe(null);
  //   }
  // }

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

  
  let formattedHours = [];
  const [cafePopupOpen, setCafePopupOpen] = useState("")
  const [cafePopupClose, setCafePopupClose] = useState("")

  const convertTimeToNumber = (hour, minute, ampm) => {
    let adjustedHour = hour;
    if (ampm === 'PM' && hour !== 12) {adjustedHour += 12;} 
    else if (ampm === 'AM' && hour === 12) {adjustedHour = 0;}

    const timeAsNumber = adjustedHour * 100 + minute;
    return timeAsNumber;
  };
  const today = new Date();
  const day = today.getDay();
  const number = convertTimeToNumber(new Date().getHours() >= 12 ? new Date().getHours() - 12 : new Date().getHours(), Math.floor(new Date().getMinutes() / 15) * 15, new Date().getHours() >= 12 ? 'PM' : 'AM')
  const inHours = (cafe, time, day) => {
    if (time <= 400) {
        if (day != 0) {
            if (cafe.hours[day - 1].close <= 400) {
                return cafe.hours[day - 1].open && cafe.hours[day - 1].open <= (time + 2400) && (cafe.hours[day - 1].close + 2400) > (time + 2400);
            }
            else {
                return cafe.hours[day].open && cafe.hours[day].open <= time && cafe.hours[day].close > time;
            }
        }
        else {
            if (cafe.hours[day + 6].close <= 400) {
                return cafe.hours[day + 6].open && cafe.hours[day + 6].open <= (time + 2400) && (cafe.hours[day + 6].close + 2400) > (time + 2400);
            }
            else {
                return cafe.hours[day].open && cafe.hours[day].open <= time && cafe.hours[day].close > time;
            }
        }
    }
    else {
        if (cafe.hours[day].close <= 400) {
            return cafe.hours[day].open && cafe.hours[day].open <= time && (cafe.hours[day].close + 2400) > time;
        }
        else {
            return cafe.hours[day].open && cafe.hours[day].open <= time && cafe.hours[day].close > time;
        }
    } 
  }

  useEffect(() => {
    if (selectedCafe) {
      for (let i = 0; i < 7; i++) {
      let openHour, openMinutes, openAmPm, closeHour, closeMinutes, closeAmPm;
      if (selectedCafe.hours[i].open === 0) {
          formattedHours.push('CLOSED')
          formattedHours.push('CLOSED')
      }
      else {
          if (selectedCafe.hours[i].open >= 1000) {
              openHour = selectedCafe.hours[i].open.toString().slice(0, 2);
              openMinutes = selectedCafe.hours[i].open.toString().slice(2, 4);
              if (selectedCafe.hours[i].open >= 1200) openAmPm = 'PM';
              else openAmPm = 'AM';
          }
          else {
              openHour = selectedCafe.hours[i].open.toString().slice(0, 1);
              openMinutes = selectedCafe.hours[i].open.toString().slice(1, 3);
              openAmPm = 'AM';
          }

          if ((selectedCafe.hours[i].close) === 2400) {
              closeHour = "12"
              closeMinutes = "00";
              closeAmPm = 'AM';
          }
          else if ((selectedCafe.hours[i].close) == 1200) {
              closeHour = "12"
              closeMinutes = "00";
              closeAmPm = 'PM';
          }
          else if ((selectedCafe.hours[i].close) >= 2200) {
              closeHour = (selectedCafe.hours[i].close - 1200).toString().slice(0, 2);
              closeMinutes = selectedCafe.hours[i].close.toString().slice(2, 4);
              closeAmPm = 'PM';
          }
          else if ((selectedCafe.hours[i].close) <= 400) {
              closeHour = (selectedCafe.hours[i].close).toString().slice(0, 1);
              closeMinutes = selectedCafe.hours[i].close.toString().slice(1, 3);
              closeAmPm = 'AM';
          }
          else {
              closeHour = (selectedCafe.hours[i].close - 1200).toString().slice(0, 1);
              closeMinutes = (selectedCafe.hours[i].close - 1200).toString().slice(1, 3);
              closeAmPm = 'PM';
          }

          if (parseInt(openMinutes) === 0) formattedHours.push(openHour + " " + openAmPm);
          else formattedHours.push(openHour + ":" + openMinutes + " " + openAmPm);

          if (parseInt(closeMinutes) === 0) formattedHours.push(closeHour + " " + closeAmPm);
          else formattedHours.push(closeHour + ":" + closeMinutes + " " + closeAmPm);
        }
        setCafePopupOpen(formattedHours[day * 2]);
        setCafePopupClose(formattedHours[(day * 2) + 1]);
      }
    }
  }, [selectedCafe])

  const [popupState, setPopupState] = useState('off');
  const [truncateName, setTruncateName] = useState(false);

  const popupRef = useRef(null);

  useEffect(() => {
    if (selectedCafe) {
      if (selectedCafe.name.length >= 19 && selectedCafe.name.length < 24) setTruncateName(true);
      else setTruncateName(false);

      if (popupState === 'off') {
        setPopupState('first');
      }
      else if (popupState === 'first') {
        setPopupState('again')
      }
    } 
    else {
      setPopupState('off');
      setTruncateName(false);
    }

    function handleClick(e) {
      // If popup exists AND click is outside popup
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        selectCafe(selectedCafe);
      }
      else if (popupRef.current && popupRef.current.contains(e.target)) {
        console.log("Clicked inside popup!");
      }
    }

    const mapEl = document.querySelector(".mobile-map-wrap");
    if (mapEl) {
      mapEl.addEventListener("click", handleClick);
    }

    return () => {
      if (mapEl) {
        mapEl.removeEventListener("click", handleClick);
      }
    };
  }, [selectedCafe])

  const openCafePage = () => {
    setExitMobilePage(mobileState);
    setMobileState("page");
  }
  
  return (
    <div className="mobile-map-wrap" style={mobileState === 'map' ? {display: 'block'} : {display: 'none'}}>
      {selectedCafe && 
        <div key={selectedCafe.id} ref={popupRef} className={`mobile-map-popup ${popupState === "off" ? "" : (popupState === "again" ? "again" : "first")}`} style={((truncateName || selectedCafe.name.length < 19) && selectedCafe.subname === '') ? {height: '28vh', border: '3px solid ' + (selectedCafe && selectedCafe.color_code)} : {height: '33vh', border: '3px solid ' + (selectedCafe && selectedCafe.color_code)}}>
          <div className="mobile-map-popup-namescore">
            <div className="mobile-map-popup-namescore-left">
              <div className="mobile-map-popup-namescore-left-name" style={truncateName ? {fontSize: 'clamp(14px, 4.6vw, 18px)'} : {fontSize: 'clamp(18px, 5.2vw, 24px)'}}>
                {selectedCafe.name}
              </div>
              <div className="mobile-map-popup-namescore-left-subname">
                {selectedCafe.subname}
              </div>
              <div className="mobile-map-popup-namescore-left-neighborhood">
                <span className="mobile-map-popup-namescore-left-neighborhood-style" style={{color: selectedCafe.color_code, border: "2px solid" + selectedCafe.color_code}}>{selectedCafe.neighborhood}</span>
              </div>
            </div>
            <div className="mobile-map-popup-namescore-right">
              <div className="mobile-map-popup-namescore-right-score" style={{border: "3px solid" + selectedCafe.color_code}}>{selectedCafe.score}</div>
            </div>
          </div>
          
          <div className="mobile-map-popup-hoursaddress">
            <div className="mobile-map-popup-address">
              Address: <span style={{fontFamily: 'Mulish Semibold'}}>{selectedCafe.address}</span>
            </div>
            <div className="mobile-map-popup-hours">
              <div className="mobile-map-popup-hours-numbers">Hours Today: <span style={{fontFamily: 'Mulish Semibold'}}>{cafePopupOpen === "CLOSED" ? "Closed" : `${cafePopupOpen} – ${cafePopupClose}`}</span></div>
              <div className="mobile-map-popup-hours-status" style={inHours(selectedCafe, number, day) ? {color: "#058205"} : {color: "#FF0000"}}>{inHours(selectedCafe, number, day) ? "Open" : "Closed"}</div>
            </div>
          </div>
          
          <div className="mobile-map-popup-pagedirections">
            <div className="mobile-map-popup-pagedirections-page">
              <div className="mobile-map-popup-page-directions-page-button" onClick={openCafePage}>
                <span>Open Full Page</span>
                <OpenCardIcon className="mobile-map-popup-page-directions-page-button-icon" />
              </div>
            </div>
            <div className="mobile-map-popup-pagedirections-directions">
              <a href={selectedCafe.google_maps} target="_blank">
                <div className="mobile-map-popup-pagedirections-directions-button">
                  <img src={GoogleMaps} alt="Google Maps Logo" className="mobile-map-popup-pagedirections-directions-logo" />
                </div>
              </a>
            </div>
          </div>
        </div>
      }
      <div ref={mapContainer} className="mobile-map"></div>
        {data.map((cafe, index) => (
          <MapMarker 
            key={index}
            map={theMap}
            markerData={cafe} 
            selectCafe={selectCafe}
            selectedCafe={selectedCafe}
            neighborhoodFunction={neighborhoodFunction}
            selectedCafes={data.filter(cafe => cafe.is_selected)}
          />
        ))}
        
        {/* {showResetView && 
          <button className="mobile-map-button" id="mobile-map-reset-view" onClick={handleResetView}>
            Reset View
            <ResetView className='mobile-map-icon' />
          </button>
        } */}
        {/* {showCafeView && 
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
        } */}
    </div>
  );
}