import './App.css';
import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import Map from './Map';
import FiltersPanel from './FiltersPanel';
import ResultsPanel from './ResultsPanel';

export default function Home() {

  const [data, setData] = useState([]);
  const [latitude, setLatitude] = useState(34.070295856986654);
  const [longitude, setLongitude] = useState(-118.32681636751984);
  const [zoom, setZoom] = useState(11);

  const changeZoom = (data) => {
    const visibleCafes = data.filter(cafe => cafe.visible);
    if (visibleCafes.length > 0 && visibleCafes.every(cafe => cafe.neighborhood === visibleCafes[0].neighborhood)) {
      setLatitude(visibleCafes[0].n_latitude);
      setLongitude(visibleCafes[0].n_longitude);
      setZoom(visibleCafes[0].n_zoom);
    } else {
        setLatitude(34.070295856986654);
        setLongitude(-118.32681636751984);
        setZoom(11);
    }
  }

  const handleSelectCafe = (cafe) => {
    var newData = [...data];
    newData.forEach(element => {
      if (element === cafe) {
        if (!element.is_selected) {
          element.is_selected = true;
          setLatitude(cafe.latitude);
          setLongitude(cafe.longitude);
          setZoom(16);
          console.log(element)
        }
        else {
          element.is_selected = false;
          changeZoom(newData);
        } 
      }
      else {
        element.is_selected = false;
      }
    });
    setData(newData);
  };

  const handleAddFilter = (filter) => {
    var newData = [...data].map(cafe => ({ ...cafe, visible: true }));
    newData.forEach(element => {
      if (!filter(element)) element.visible = false;
    });
    setData(newData);
    changeZoom(newData);
  }

  const handlePickSortingOption = (sortingOption) => {
    var newData = [...data];
    newData.sort(sortingOption);
    setData(newData);
  }

  //var csv is the CSV file with headers and types
  function csvJSON(csv){
    var lines=csv.split(/\r?\n/);
    var result = [];
    var headers=lines[0].split("\t");
    var types=lines[1].split("\t");
    var lastID = 0;

    for(var i=2; i<lines.length; i++){
      var obj = {};
      var currentline=lines[i].split("\t");
      for(var j=0; j<headers.length; j++){
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
      console.log(jsondata);
      setData(jsondata);
    });
  }, []);

  return (
    <div className="home-content">
      <div className="home-left">      
        <Map
          data={data}
          lat={latitude}
          lng={longitude}
          zoom={zoom}
          selectCafe={handleSelectCafe}
        />
        <div className="home-title-container">
          <div className="home-title">A Guide to LA Coffee Shops</div>
        </div>
        <FiltersPanel 
          data={data}
          addFilter={handleAddFilter}
        />
      </div>
      <div className="home-right"> 
        <ResultsPanel 
          data={data}
          selectCafe={handleSelectCafe}
          pickSortingOption={handlePickSortingOption}
          addFilter={handleAddFilter}
        />
      </div>
    </div>
  );
}

