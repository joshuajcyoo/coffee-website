import './App.css';
import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import Map from './Map';
import FiltersPanel from './FiltersPanel';
import ResultsPanel from './ResultsPanel';

export default function Home() {

  // all the states that need to be updated by daughter components
  const [data, setData] = useState([]);
  const [latitude, setLatidude] = useState(34.05238223400768);
  const [longitude, setLongitude] = useState(-118.30864605232344);
  const [zoom, setZoom] = useState(11);

  // example of handler functions used by daughter
  const handleSelectCafe = (cafe) => {
    var newData = [...data];
    newData.forEach(element => {
      if (element === cafe) element.is_selected = true;
      else element.is_selected = false;
    });
    setData(newData);
  };

  const handleAddFilter = (filter) => {
    var newData = [...data];
    newData.forEach(element => {
      if (!filter(element)) element.visible = false;
    });
    setData(newData);
  };

  const handlePickSortingOption = (sortingOption) => {
    var newData = [...data];
    newData.sort(sortingOption);
    setData(newData);
  }
  

  useEffect(() => {
    const newData = [
      { 
        name: 'Steep',
        neighborhood: 'Echo Park/Silver Lake/Chinatown', 
        color_code: "#C3B154",
        address: "970 N Broadway Ste 112",
        latitude: 34.06617678986985,
        longitude: -118.23590370358068,
        yelp: "https://www.yelp.com/biz/steep-los-angeles-2",
        score: 14.5,
        ambiance: 5,
        workability: 5,
        drinks: 4,
        outlets: 0.5,
        open_late: true,
        closes_early: false,
        has_food: true,
        high_prices: false,
        wifi_issues: false,
        outdoor_area: true,
        difficult_seating: false,
        hidden_gem: true,
        visible: true,
        is_selected: false
      },
      { 
        name: 'Coffee MCO',
        neighborhood: 'Koreatown',
        color_code: "#7E54C3",
        address: "621 S Western Ave Ste 101",
        latitude: 34.05238223400768,
        longitude: -118.28735324590997,
        yelp: "https://www.yelp.com/biz/coffee-mco-los-angeles?osq=mco",
        score: 14,
        ambiance: 5,
        workability: 4,
        drinks: 4,
        outlets: 1,
        open_late: false,
        closes_early: false,
        has_food: true,
        high_prices: false,
        wifi_issues: false,
        outdoor_area: true,
        difficult_seating: false,
        hidden_gem: false,
        visible: true,
        is_selected: false
      }
    ];
    setData(newData);
  }, []);

  return (
    <div>
      <Map
        data={data}
        lat={latitude}
        lng={longitude}
        zoom={zoom}
        selectCafe={handleSelectCafe}
      />
      <FiltersPanel 
        addFilter={handleAddFilter}
      />
      <ResultsPanel 
        data={data}
        selectCafe={handleSelectCafe}
        pickSortingOption={handlePickSortingOption}
      />
    </div>
  );
}

