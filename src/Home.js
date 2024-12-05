import './App.css';
import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import Map from './Map';
import NeighborhoodPanel from './NeighborhoodPanel';
import ResultsPanel from './ResultsPanel';

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
      setLatitude(visibleCafes[0].latitude);
      setLongitude(visibleCafes[0].longitude);
      setZoom(14);
    }
    else if (visibleCafes.length > 0 && visibleCafes.every(cafe => cafe.neighborhood === visibleCafes[0].neighborhood)) {
      setLatitude(visibleCafes[0].n_latitude);
      setLongitude(visibleCafes[0].n_longitude);
      setZoom(visibleCafes[0].n_zoom);
    } 
    else if (neighborhoodCheck) {
      setLatitude(34.06248189100365);
      setLongitude(-118.34569321430635);
      setZoom(11);
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
          setLatitude(cafe.latitude);
          setLongitude(cafe.longitude);
          setZoom(14);
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
          />
        </div>
      </div>
      : 
      <div id="mobile-container">
        <div id="mobile-div">
          <div id="mobile-title">Sorry!</div>
          <div className="mobile-message">Unfortunately the mobile version of the website isn't finished yet. However, you can still view the website on a laptop or desktop.</div>
        </div>
      </div>
    }
    </>
  );
}

