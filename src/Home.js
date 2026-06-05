import './App.css';
import './Mobile.css';
import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import Map from './Map';
import MapMobile from './MapMobile';
import NeighborhoodPanel from './NeighborhoodPanel';
import ResultsPanel from './ResultsPanel';
import LogoBlack from "./Logos/newlogoblack.png";
import ListMobile from './ListMobile';
import CafeMobile from './CafeMobile';
import {ReactComponent as BackArrow} from './Logos/back-arrow.svg'

export default function Home() {
  const [data, setData] = useState([]);
  const [latitude, setLatitude] = useState(34.060801322167165);
  const [longitude, setLongitude] = useState(-118.35414700384389);
  const [zoom, setZoom] = useState(11);
  const [sort, setSort] = useState(null);
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [allFilters, setAllFilters] = useState([]);
  const [filterFunction, setFilterFunction] = useState(null);
  const [neighborhoodFunction, setNeighborhoodFunction] = useState(null);
  const [scrollToTop, setScrollToTop] = useState(false);
  const [hoveredCafe, setHoveredCafe] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [searchValue, setSearchValue] = useState('Search By Name');
  const [scoreBarHover, setScoreBarHover] = useState(true);

  const [mobileState, setMobileState] = useState('map');
  const [exitMobilePage, setExitMobilePage] = useState('');
  const [mobileFilters, setMobileFilters] = useState({
    has_outlets: false,
    study_work: false,
    has_food: false,
    hidden_gem: false,
    is_aesthetic: false,
    outdoor_area: false,
    high_prices: false,
    wifi_issues: false,
  });
  const [mobileTimeState, setMobileTimeState] = useState(false);
  const convertTimeToNumber = (hour, minute, ampm) => {
        let adjustedHour = hour;
        if (ampm === 'PM' && hour !== 12) {adjustedHour += 12;} 
        else if (ampm === 'AM' && hour === 12) {adjustedHour = 0;}

        const timeAsNumber = adjustedHour * 100 + minute;
        return timeAsNumber;
  };
  const [mobileTimeData, setMobileTimeData] = useState({
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
    ampm: new Date().getHours() >= 12 ? 'PM' : 'AM',
    day: new Date().getDay(),
    number: convertTimeToNumber(new Date().getHours() >= 12 ? new Date().getHours() - 12 : new Date().getHours(), Math.floor(new Date().getMinutes() / 15) * 15, new Date().getHours() >= 12 ? 'PM' : 'AM')
  });

  const [isSelectingNeighborhoodMobile, setIsSelectingNeighborhoodMobile] = useState(false);
  const [trackTimeUpdate, setTrackTimeUpdate] = useState(false);
  const [isSelectingTimeMobile, setIsSelectingTimeMobile] = useState(false);
  const [selectedMobileDay, setSelectedMobileDay] = useState(new Date().getDay()); // Default to today
  const [selectedMobileTime, setSelectedMobileTime] = useState((mobileTimeData.hour < 10 ? parseInt((mobileTimeData.hour).toString().padStart(2, "0")) : mobileTimeData.hour) + ":" + (mobileTimeData.minute < 10 ? parseInt((mobileTimeData.minute).toString().padStart(2, "0")) : mobileTimeData.minute));

  const [isSearchingMobile, setIsSearchingMobile] = useState(false);
  const [isSearchFocusedMobile, setIsSearchFocusedMobile] = useState(false);
  const [isSearchSetMobile, setIsSearchSetMobile] = useState(false);
  
  const handleFocus = () => {
      if (searchValue === 'Search By Name') setSearchValue('');
      setIsSearchFocusedMobile(true);
  };

  const handleBlur = () => {
      if (searchValue === '') setSearchValue('Search By Name');
      setIsSearchFocusedMobile(false);

      if (searchValue != 'Search By Name' && searchValue != '') setIsSearchSetMobile(true);
      else setIsSearchSetMobile(false);
  };

  const handleSearchChange = (event) => {
      setSearchValue(event.target.value);
      if (searchValue != 'Search By Name' && searchValue != '') {
          if (rightRef.current) {
              rightRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }
      }
  }

  const rightRef = useRef();

  const [displayRight, setDisplayRight] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
      const handleResize = () => {
          setWindowWidth(window.innerWidth);
      };

      const debounceResize = debounce(handleResize, 100);

      window.addEventListener('resize', debounceResize);
      handleResize();
      return () => {
          window.removeEventListener('resize', debounceResize);
      };
  }, []);

  const changeZoom = (data, neighborhoodCheck) => {
    const selectedCafes = data.filter(cafe => cafe.is_selected);
    const visibleCafes = data.filter(cafe => cafe.visible);

    if (visibleCafes.length === 1) {
      setLatitude(visibleCafes[0].latitude - 0.007);
      setLongitude(visibleCafes[0].longitude);
      setZoom(14);
    }
    else if (visibleCafes.length > 0 && visibleCafes.every(cafe => cafe.neighborhood === visibleCafes[0].neighborhood)) {
      setLatitude(windowWidth > 760 ? visibleCafes[0].latitude : visibleCafes[0].latitude - 0.01);
      setLongitude(visibleCafes[0].n_longitude);
      setZoom(windowWidth > 760 ? visibleCafes[0].n_zoom : visibleCafes[0].n_zoom - 1);
    } 
    else if (neighborhoodCheck) {
      setLatitude(windowWidth > 760 ? 34.06248189100365 : (34.06248189100365 - 0.05));
      // setLatitude(34.06248189100365);
      setLongitude(-118.34569321430635);
      setZoom(windowWidth > 760 ? 11 : 10);
      // setZoom(11);
    }
    else if (selectedCafes.length === 1) {
      setLatitude(selectedCafes[0].latitude);
      setLongitude(selectedCafes[0].longitude);
      setZoom(14);
    }
    else {
      if (zoom != 11 && zoom != 13) {
        setZoom(12);
      }
    }
  }

  const handleSelectCafe = (cafe) => {
    setDisplayRight(true);
    var newData = [...data];
    newData.forEach(element => {
      if (element === cafe) {
        if (!element.is_selected) {
          element.is_selected = true;
          setLongitude(cafe.longitude);
          if (windowWidth > 760) {
            setLatitude(cafe.latitude);
            setZoom(14);
          }
          else {
            setLatitude(cafe.latitude - 0.015);
            setZoom(13);
          }
          setSelectedCafe(cafe);
        }
        else {
          element.is_selected = false;
          changeZoom(newData, false);
          setSelectedCafe(null);
        } 
      }
      else {
        element.is_selected = false;
      }
    });
    setData(newData);
  };

  const handleAddFilter = () => {
    var newData = [...data].map(cafe => ({ ...cafe, visible: true, is_selected: false }));
    if (filterFunction) {
      newData.forEach(element => {
        if (!filterFunction(element)) {
          element.visible = false;
        }
      });
    }
    if (neighborhoodFunction) {
      newData.forEach(element => {
        if (!neighborhoodFunction(element)) {
          element.visible = false;
        }
      });
    }
    if (searchValue != 'Search By Name' && searchValue != '') {
      setHoveredCafe(null);
      newData.forEach(element => {
        if (!element.name.toLowerCase().includes(searchValue.toLowerCase())) {
          element.visible = false;
        }
      })
      const visibleCafes = newData.filter(cafe => cafe.visible);
      if (visibleCafes.length === 1) {
        setSelectedCafe(visibleCafes[0]);
      }
      else setSelectedCafe(null);
    }
    setData(newData);
    changeZoom(newData, true);
  }

  const handlePickSortingOption = (sortingOption) => {
    var newData = [...data].map(cafe => ({ ...cafe, is_selected: false }));
    newData.sort(sortingOption);
    setData(newData);
    changeZoom(newData, true);
  }

  //var csv is the CSV file with headers and types
  function csvJSON(csv){
    var lines=csv.split(/\r?\n/);
    var result = [];
    var headers=lines[0].split("\t");
    var types=lines[1].split("\t");
    var lastID = 0;

    for (var i=2; i<lines.length; i++) {
      var obj = {};
      var currentline=lines[i].split("\t");
      for (var j=0; j<headers.length; j++) {
        var val = null;
        if (types[j] === "number") val = parseFloat(currentline[j]);
        else if (types[j] === "boolean") {
          if (currentline[j].toLowerCase() === "true") val = true;
          else val = false;
        }
        else if (types[j] === "string") {
          val = currentline[j].replace("${PUBLIC_URL}", `${process.env.PUBLIC_URL}`);
        }
        else if (types[j] === "array") {
          var cleanArray = currentline[j].replace(/([{,])\s*(\w+)\s*:/g, '$1 "$2":');
          val = JSON.parse(cleanArray);
        }
        obj[headers[j]] = val;
      }
      obj["id"] = lastID++;
      result.push(obj);
    }

    return result;
  }

  const mobilePageBack = () => {
    setMobileState(exitMobilePage)
    setExitMobilePage('');
  };
  const backText = exitMobilePage.charAt(0).toUpperCase() + exitMobilePage.slice(1);
  
  useEffect(() => {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTyFAihCI4jr2oaWNMI7X4f1_x__G-y-mDqadIYIHecTwejWhRWbmKVApKMP0aqkAs4n6P_Jj4zy-HP/pub?output=tsv')
    .then(response => response.text())
    .then(data => {
      var jsondata = csvJSON(data);
      jsondata.sort((cafe1, cafe2) => {
        if (cafe1.score < cafe2.score) return 1;
        if (cafe1.score > cafe2.score) return -1;
        return 0;
      });
      setData(jsondata);
    });
  }, []);

  useEffect(() => {
    handleAddFilter();
  }, [filterFunction, neighborhoodFunction, searchValue])

  const [neighborhoodFilter, setNeighborhoodFilter] = useState({
    neighborhood: "All Neighborhoods"
  });
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);


  useEffect(() => {
    console.log("mobileState changed:", mobileState);
  }, [mobileState]);

  return (
    <>
      {windowWidth > 760 ?
      <div className="home-content">
        <div className="home-left" style={{ width: displayRight ? '67%' : '100%' }}>      
          <Map
            data={data}
            setData={setData}
            displayRight={displayRight}
            setDisplayRight={setDisplayRight}
            latitude={latitude}
            setLatitude={setLatitude}
            longitude={longitude}
            setLongitude={setLongitude}
            zoom={zoom}
            setZoom={setZoom}
            changeZoom={changeZoom}
            selectCafe={handleSelectCafe}
            hoveredCafe={hoveredCafe}
            selectedCafe={selectedCafe}
            neighborhoodFunction={neighborhoodFunction}
            filterFunction={filterFunction}
            allFilters={allFilters}
            sort={sort}
            setSort={setSort}
            showSortPanel={showSortPanel}
            setShowSortPanel={setShowSortPanel}
          />
            <div className="home-title-container">
              <div className="home-title">A Guide to LA Coffee Shops</div>
            </div>
            <NeighborhoodPanel
              setNeighborhoodFunction={setNeighborhoodFunction}
              setScrollToTop={setScrollToTop}
              setSelectedCafe={setSelectedCafe}
              data={data}
              setData={setData}
            />
        </div>
        <div className={`home-right ${displayRight ? '' : 'hidden'}`} ref={rightRef}> 
          <ResultsPanel 
            data={data}
            setData={setData}
            selectCafe={handleSelectCafe}
            setSort={setSort}
            setShowSortPanel={setShowSortPanel}
            pickSortingOption={handlePickSortingOption}
            addFilter={handleAddFilter}
            rightRef={rightRef}
            allFilters={allFilters}
            setAllFilters={setAllFilters}
            filterFunction={filterFunction}
            setFilterFunction={setFilterFunction}
            scrollToTop={scrollToTop}
            setScrollToTop={setScrollToTop}
            hoveredCafe={hoveredCafe}
            setHoveredCafe={setHoveredCafe}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            selectedCafe={selectedCafe}
            scoreBarHover={scoreBarHover}
            setScoreBarHover={setScoreBarHover}
          />
        </div>
      </div>
      : 
      <>
        <div id="main-app-container">
          <div id="mobile-content">
            <div id="mobile-nav" style={{borderBottom: mobileState === "page" ? "3px solid " + selectedCafe.color_code : "3px solid black"}}>
              <div>
                <img id="mobile-nav-logo" src={LogoBlack}></img>
              </div>
              <button id="mobile-nav-about">About</button>
            </div>
            <div id="mobile-toggle" style={mobileState === "page" ? {display: 'none'} : {display: 'flex'}}>
              <button
                className={`mobile-toggle-btn ${mobileState === "map" ? "active" : ""}`}
                onClick={() => setMobileState("map")}
              >
                Map View
              </button>
              <button
                className={`mobile-toggle-btn ${mobileState === "list" ? "active" : ""}`}
                onClick={() => setMobileState("list")}
              >
                List View
              </button>
              <div className={`mobile-toggle-slider ${mobileState}`}></div>
            </div>
            {/* <div id="mobile-nav-back" style={mobileState === "page" ? {display: "flex", width: "fit-content"} : {display: "none"}}>
              <div className="mobile-cafe-back" onClick={mobilePageBack}>
                <div className="mobile-cafe-back-sticky">
                  <BackArrow className='mobile-cafe-back-arrow'/>
                  <div className="mobile-cafe-back-text">Back to {backText} View</div>
                </div>
              </div>
            </div> */}
            <MapMobile
                data={data}
                setData={setData}
                displayRight={displayRight}
                setDisplayRight={setDisplayRight}
                latitude={latitude}
                setLatitude={setLatitude}
                longitude={longitude}
                setLongitude={setLongitude}
                zoom={zoom}
                setZoom={setZoom}
                changeZoom={changeZoom}
                selectCafe={handleSelectCafe}
                selectedCafe={selectedCafe}
                setSelectedCafe={setSelectedCafe}
                neighborhoodFunction={neighborhoodFunction}
                setNeighborhoodFunction={setNeighborhoodFunction}
                filterFunction={filterFunction}
                allFilters={allFilters}
                sort={sort}
                setSort={setSort}
                showSortPanel={showSortPanel}
                setShowSortPanel={setShowSortPanel}
                mobileState={mobileState}
                setMobileState={setMobileState}
                exitMobilePage={exitMobilePage}
                setExitMobilePage={setExitMobilePage}
                mobileFilters={mobileFilters}
                setMobileFilters={setMobileFilters}
                isSelectingNeighborhoodMobile={isSelectingNeighborhoodMobile}
                setIsSelectingNeighborhoodMobile={setIsSelectingNeighborhoodMobile}
                selectedNeighborhood={selectedNeighborhood}
                setSelectedNeighborhood={setSelectedNeighborhood}
                neighborhoodFilter={neighborhoodFilter}
                setNeighborhoodFilter={setNeighborhoodFilter}
                mobileTimeState={mobileTimeState}
                setMobileTimeState={setMobileTimeState}
                timeData={mobileTimeData}
                setTimeData={setMobileTimeData}
                isSelectingTimeMobile={isSelectingTimeMobile}
                setIsSelectingTimeMobile={setIsSelectingTimeMobile}
                trackTimeUpdate={trackTimeUpdate}
                setTrackTimeUpdate={setTrackTimeUpdate}
                selectedMobileDay={selectedMobileDay}
                setSelectedMobileDay={setSelectedMobileDay}
                selectedMobileTime={selectedMobileTime}
                setSelectedMobileTime={setSelectedMobileTime}
                isSearchingMobile={isSearchingMobile}
                setIsSearchingMobile={setIsSearchingMobile}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                isSearchFocusedMobile={isSearchFocusedMobile}
                setIsSearchFocusedMobile={setIsSearchFocusedMobile}
                isSearchSetMobile={isSearchSetMobile}
                setIsSearchSetMobile={setIsSearchSetMobile}
                handleBlur={handleBlur}
                handleFocus={handleFocus}
                handleSearchChange={handleSearchChange}
            />
            <div style={mobileState === "page" ? {height: '0%'} : {height: '84%'}}>
              <ListMobile 
              data={data}
              setData={setData}
              selectCafe={handleSelectCafe}
              setSort={setSort}
              setShowSortPanel={setShowSortPanel}
              pickSortingOption={handlePickSortingOption}
              addFilter={handleAddFilter}
              rightRef={rightRef}
              allFilters={allFilters}
              setAllFilters={setAllFilters}
              filterFunction={filterFunction}
              setFilterFunction={setFilterFunction}
              scrollToTop={scrollToTop}
              setScrollToTop={setScrollToTop}
              hoveredCafe={hoveredCafe}
              setHoveredCafe={setHoveredCafe}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              selectedCafe={selectedCafe}
              setSelectedCafe={setSelectedCafe}
              neighborhoodFunction={neighborhoodFunction}
              setNeighborhoodFunction={setNeighborhoodFunction}
              scoreBarHover={scoreBarHover}
              setScoreBarHover={setScoreBarHover}
              mobileState={mobileState}
              setMobileState={setMobileState}
              exitMobilePage={exitMobilePage}
              setExitMobilePage={setExitMobilePage}
              mobileFilters={mobileFilters}
              setMobileFilters={setMobileFilters}
              isSelectingNeighborhoodMobile={isSelectingNeighborhoodMobile}
              setIsSelectingNeighborhoodMobile={setIsSelectingNeighborhoodMobile}
              selectedNeighborhood={selectedNeighborhood}
              setSelectedNeighborhood={setSelectedNeighborhood}
              neighborhoodFilter={neighborhoodFilter}
              setNeighborhoodFilter={setNeighborhoodFilter}
              mobileTimeState={mobileTimeState}
              setMobileTimeState={setMobileTimeState}
              timeData={mobileTimeData}
              setTimeData={setMobileTimeData}
              isSelectingTimeMobile={isSelectingTimeMobile}
              setIsSelectingTimeMobile={setIsSelectingTimeMobile}
              trackTimeUpdate={trackTimeUpdate}
              setTrackTimeUpdate={setTrackTimeUpdate}
              selectedMobileDay={selectedMobileDay}
              setSelectedMobileDay={setSelectedMobileDay}
              selectedMobileTime={selectedMobileTime}
              setSelectedMobileTime={setSelectedMobileTime}
              isSearchingMobile={isSearchingMobile}
              setIsSearchingMobile={setIsSearchingMobile}
              isSearchFocused={isSearchFocusedMobile}
              setIsSearchFocused={setIsSearchFocusedMobile}
              isSearchSet={isSearchSetMobile}
              setIsSearchSet={setIsSearchSetMobile}
              handleBlur={handleBlur}
              handleFocus={handleFocus}
              handleSearchChange={handleSearchChange}
            />
            </div>
            <CafeMobile
            mobileState={mobileState}
            setMobileState={setMobileState}
            exitMobilePage={exitMobilePage}
            setExitMobilePage={setExitMobilePage}
            selectedCafe={selectedCafe}
            />
          </div>
        </div>
        {/* The warning overlay (hidden by default) */}
        <div id="landscape-warning">
          <p>Please rotate your device back to portrait mode to use this map.</p>
        </div>
      </>
    }
    </>
  );
}