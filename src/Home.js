import './App.css';
import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import Map from './Map';
import FiltersPanel from './FiltersPanel';
import ResultsPanel from './ResultsPanel';

export default function Home() {

  // all the states that need to be updated by daughter components
  const [data, setData] = useState([]);
  const [latitude, setLatitude] = useState(34.070295856986654);
  const [longitude, setLongitude] = useState(-118.32681636751984);
  const [zoom, setZoom] = useState(11);

  // example of handler functions used by daughter
  const handleSelectCafe = (cafe) => {
    var newData = [...data];
    newData.forEach(element => {
      if (element === cafe) {
        element.is_selected = !element.is_selected;
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

    const visibleCafes = newData.filter(cafe => cafe.visible);
    console.log(visibleCafes)
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

  const handlePickSortingOption = (sortingOption) => {
    var newData = [...data];
    newData.sort(sortingOption);
    setData(newData);
  }
  

  useEffect(() => {
    const newData = [
      { 
        id: 0,
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
        is_selected: false,
        n_latitude: 34.07769323298075, 
        n_longitude: -118.26541833326623,
        n_zoom: 13
      },
      { 
        id: 1,
        name: 'Coffee MCO',
        neighborhood: 'Koreatown/Mid-City',
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
        is_selected: false,
        n_latitude: 34.06254827176307, 
        n_longitude: -118.30903945608391,
        n_zoom: 13
      }
    ];
    setData(newData);
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
        <h1 className="home-title">A Guide to LA Coffee Shops</h1>
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
        />
      </div>
    </div>
  );
}

