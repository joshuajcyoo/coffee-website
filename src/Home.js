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
        obj[headers[j]] = val;
      }
      obj["id"] = lastID++;
      obj["hours"] = [
        {open: 800, close: 2300},
        {open: 800, close: 2300},
        {open: 800, close: 2300},
        {open: 800, close: 2300},
        {open: 800, close: 2300},
        {open: 800, close: 2300},
        {open: 800, close: 2300}
      ]
      result.push(obj);
    }

    return result;
  }
  

  useEffect(() => {
// <<<<<<< googledrive
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTyFAihCI4jr2oaWNMI7X4f1_x__G-y-mDqadIYIHecTwejWhRWbmKVApKMP0aqkAs4n6P_Jj4zy-HP/pub?output=tsv')
    .then(response => response.text())
    .then(data => {
      var jsondata = csvJSON(data);
      console.log(jsondata);
      setData(jsondata);
    });
// =======
    // const newData = [
    //   { id: 0, name: 'Steep',
    //     subname: '',
    //     neighborhood: 'Echo Park/Silver Lake/Chinatown', 
    //     color_code: "#F6C25C",
    //     address: "970 N Broadway Ste 112",
    //     hours: [
    //       {open: 800, close: 2300},
    //       {open: 800, close: 2300},
    //       {open: 800, close: 2300},
    //       {open: 800, close: 2300},
    //       {open: 800, close: 2300},
    //       {open: 800, close: 2300},
    //       {open: 800, close: 2300}
    //     ],
    //     latitude: 34.065980698261825,
    //     longitude: -118.23590397358777,
    //     image: "https://cdn.vox-cdn.com/thumbor/BTmcOX2vhW8udQ4xevNSTf8IOLI=/0x0:2000x1333/1200x0/filters:focal(0x0:2000x1333):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/24140219/2022_10_21_SteepAfterDark_036.jpg",
    //     yelp: "https://www.yelp.com/biz/steep-los-angeles-2",
    //     google_maps: "https://www.google.com/maps/dir/?api=1&destination=34.065980698261825,-118.23590397358777",
    //     score: 14.5,
    //     ambiance: 5,
    //     workability: 5,
    //     drinks: 4,
    //     outlets: 0.5,
    //     open_late: true,
    //     closes_early: false,
    //     has_food: true,
    //     high_prices: false,
    //     wifi_issues: false,
    //     outdoor_area: true,
    //     difficult_seating: false,
    //     hidden_gem: true,
    //     visible: true,
    //     is_selected: false,
    //     n_latitude: 34.07769323298075, 
    //     n_longitude: -118.26541833326623,
    //     n_zoom: 13
    //   },
    //   { id: 1, name: 'Coffee MCO',
    //     neighborhood: 'Koreatown/Mid-City',
    //     color_code: "#867BC0",
    //     address: "621 S Western Ave Ste 101",
    //     hours: [
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900}
    //     ],
    //     latitude: 34.05215005585242,
    //     longitude: -118.28749757582946,
    //     image: "https://res.cloudinary.com/the-infatuation/image/upload/f_auto/q_auto/v1697052310/images/Coffee%20MCO_Second%20Floor_Andrew%20Chan_LA.jpg",
    //     yelp: "https://www.yelp.com/biz/coffee-mco-los-angeles?osq=mco",
    //     google_maps: "https://www.google.com/maps/dir/?api=1&destination=34.05215005585242,-118.28749757582946",
    //     score: 14,
    //     ambiance: 5,
    //     workability: 4,
    //     drinks: 4,
    //     outlets: 1,
    //     open_late: false,
    //     closes_early: false,
    //     has_food: true,
    //     high_prices: false,
    //     wifi_issues: false,
    //     outdoor_area: true,
    //     difficult_seating: false,
    //     hidden_gem: false,
    //     visible: true,
    //     is_selected: false,
    //     n_latitude: 34.06254827176307, 
    //     n_longitude: -118.30903945608391,
    //     n_zoom: 13
    //   },
    //   { id: 2, name: '3THYME Coffee',
    //     subname: '[Koreatown]',
    //     neighborhood: 'Koreatown/Mid-City',
    //     color_code: "#867BC0",
    //     address: "600 S Harvard Blvd Ste 100",
    //     hours: [
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900}
    //     ],
    //     latitude: 34.063171032463835,
    //     longitude: -118.30380608841607,
    //     image: `${process.env.PUBLIC_URL}/Images/3thymecoffee.jpg`,
    //     yelp: "https://www.yelp.com/biz/3thyme-coffee-los-angeles-5",
    //     google_maps: "https://www.google.com/maps/dir/?api=1&destination=34.063171032463835,-118.30380608841607",
    //     score: 14,
    //     ambiance: 4,
    //     workability: 4,
    //     drinks: 5,
    //     outlets: 1,
    //     open_late: false,
    //     closes_early: false,
    //     has_food: false,
    //     high_prices: false,
    //     wifi_issues: true,
    //     outdoor_area: true,
    //     difficult_seating: false,
    //     hidden_gem: true,
    //     visible: true,
    //     is_selected: false,
    //     n_latitude: 34.06254827176307, 
    //     n_longitude: -118.30903945608391,
    //     n_zoom: 13
    //   },
    //   { id: 3, name: 'Maru Coffee',
    //     subname: '[Arts District]',
    //     neighborhood: 'Arts District/Little Tokyo',
    //     color_code: "#5FC5F9",
    //     address: "1019 S Santa Fe Ave",
    //     hours: [
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900}
    //     ],
    //     latitude: 34.03096990269932,
    //     longitude: -118.23014421972013,
    //     image: `${process.env.PUBLIC_URL}/Images/marucoffee.jpg`,
    //     yelp: "https://www.yelp.com/biz/maru-coffee-los-angeles-3",
    //     google_maps: "https://www.google.com/maps/dir/?api=1&destination=34.03096990269932,-118.23014421972013",
    //     score: 13.5,
    //     ambiance: 5,
    //     workability: 3,
    //     drinks: 5,
    //     outlets: 0.5,
    //     open_late: false,
    //     closes_early: false,
    //     has_food: false,
    //     high_prices: false,
    //     wifi_issues: false,
    //     outdoor_area: false,
    //     difficult_seating: true,
    //     hidden_gem: false,
    //     visible: true,
    //     is_selected: false,
    //     n_latitude: 34.039445379039236,  
    //     n_longitude: -118.23574419308747,
    //     n_zoom: 13
    //   },
    //   { id: 4, name: 'Alchemist Coffee Project',
    //     subname: '(The Pearl)',
    //     neighborhood: 'Koreatown/Mid-City',
    //     color_code: "#867BC0",
    //     address: "698 S Vermont Ave Ste 103",
    //     hours: [
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900}
    //     ],
    //     latitude: 34.06155472235852, 
    //     longitude: -118.30576172865544,
    //     image: `${process.env.PUBLIC_URL}/Images/alchemistcoffeeprojectthepearl.jpeg`,
    //     yelp: "https://www.yelp.com/biz/alchemist-coffee-project-los-angeles-8",
    //     google_maps: "https://www.google.com/maps/dir/?api=1&destination=34.06155472235852,-118.30576172865544",
    //     score: 13,
    //     ambiance: 5,
    //     workability: 4,
    //     drinks: 3,
    //     outlets: 1,
    //     open_late: false,
    //     closes_early: false,
    //     has_food: false,
    //     high_prices: true,
    //     wifi_issues: false,
    //     outdoor_area: false,
    //     difficult_seating: false,
    //     hidden_gem: false,
    //     visible: true,
    //     is_selected: false,
    //     n_latitude: 34.06254827176307, 
    //     n_longitude: -118.30903945608391,
    //     n_zoom: 13
    //   },
    //   { id: 5, name: 'Blue Bottle Coffee',
    //     subname: '[Downtown]',
    //     neighborhood: 'Downtown',
    //     color_code: "#3683C2",
    //     address: "300 South Broadway",
    //     hours: [
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900}
    //     ],
    //     latitude: 34.05076601382609, 
    //     longitude: -118.2479196504731,
    //     image: `${process.env.PUBLIC_URL}/Images/bluebottlecoffeedowntown.jpg`,
    //     yelp: "https://www.yelp.com/biz/blue-bottle-coffee-bradbury-los-angeles",
    //     google_maps: "https://www.google.com/maps/dir/?api=1&destination=34.05076601382609,-118.2479196504731",
    //     score: 13,
    //     ambiance: 5,
    //     workability: 4,
    //     drinks: 4,
    //     outlets: 0,
    //     open_late: false,
    //     closes_early: false,
    //     has_food: false,
    //     high_prices: true,
    //     wifi_issues: false,
    //     outdoor_area: false,
    //     difficult_seating: false,
    //     hidden_gem: false,
    //     visible: true,
    //     is_selected: false,
    //     n_latitude: 34.05378215141337,
    //     n_longitude: -118.25311219086959,
    //     n_zoom: 13
    //   },
    //   { id: 6, name: 'Coffee for Sasquatch',
    //     subname: '',
    //     neighborhood: 'WeHo/Melrose/Beverly Hills',
    //     color_code: "#F2729F",
    //     address: "7020 Melrose Ave",
    //     hours: [
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900}
    //     ],
    //     latitude: 34.083245482521974, 
    //     longitude: -118.34347519482917,
    //     image: "https://cdn.vox-cdn.com/thumbor/x0ksWBOi6euOLKmb4IV1MbKgryI=/0x0:2000x1335/1200x0/filters:focal(0x0:2000x1335):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/9131315/2017_08_25_coffe_for_sasquatch_003.jpg",
    //     yelp: "https://www.yelp.com/biz/coffee-for-sasquatch-los-angeles",
    //     google_maps: "https://www.google.com/maps/dir/?api=1&destination=34.083245482521974,-118.34347519482917",
    //     score: 13,
    //     ambiance: 4,
    //     workability: 4,
    //     drinks: 4,
    //     outlets: 1,
    //     open_late: false,
    //     closes_early: false,
    //     has_food: false,
    //     high_prices: false,
    //     wifi_issues: false,
    //     outdoor_area: false,
    //     difficult_seating: false,
    //     hidden_gem: true,
    //     visible: true,
    //     is_selected: false,
    //     n_latitude: 34.07642731026826,
    //     n_longitude: -118.36747691330106,
    //     n_zoom: 13
    //   },
    //   { id: 7, name: 'SACHI.LA',
    //     subname: '',
    //     neighborhood: 'Culver City/Mar Vista',
    //     color_code: "#74B78C",
    //     address: "4574 S Centinela Ave",
    //     hours: [
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900}
    //     ],
    //     latitude: 33.991673897492916, 
    //     longitude: -118.42146945648837,
    //     image: "https://fastly.4sqi.net/img/general/600x600/12291826_bc0ukUR6IXJJ9wHp0Zb7SvjfACzkjjbdJVsfB4d5EWQ.jpg",
    //     yelp: "https://www.yelp.com/biz/sachi-la-los-angeles",
    //     google_maps: "https://www.google.com/maps/dir/?api=1&destination=33.991673897492916,-118.42146945648837",
    //     score: 13,
    //     ambiance: 5,
    //     workability: 3,
    //     drinks: 4,
    //     outlets: 1,
    //     open_late: false,
    //     closes_early: true,
    //     has_food: false,
    //     high_prices: false,
    //     wifi_issues: false,
    //     outdoor_area: true,
    //     difficult_seating: true,
    //     hidden_gem: true,
    //     visible: true,
    //     is_selected: false,
    //     n_latitude: 34.011619693012875,
    //     n_longitude: -118.40393034238527,
    //     n_zoom: 13
    //   },
    //   { id: 8, name: 'CAFE/5',
    //     subname: '',
    //     neighborhood: 'USC/South Central',
    //     color_code: "#FF6961",
    //     address: "2025 W Jefferson Blvd",
    //     hours: [
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900},
    //       {open: 800, close: 1900}
    //     ],
    //     latitude: 34.02569149773806, 
    //     longitude: -118.31596208574616,
    //     image: `${process.env.PUBLIC_URL}/Images/cafe5.jpg`,
    //     yelp: "https://www.yelp.com/biz/cafe-5-los-angeles",
    //     google_maps: "https://www.google.com/maps/dir/?api=1&destination=34.02569149773806,-118.31596208574616",
    //     score: 13,
    //     ambiance: 3,
    //     workability: 5,
    //     drinks: 3,
    //     outlets: 1,
    //     open_late: false,
    //     closes_early: false,
    //     has_food: false,
    //     high_prices: true,
    //     wifi_issues: false,
    //     outdoor_area: false,
    //     difficult_seating: true,
    //     hidden_gem: true,
    //     visible: true,
    //     is_selected: false,
    //     n_latitude: 34.029020022579864,
    //     n_longitude: -118.30010983746013,
    //     n_zoom: 13
    //   }
    // ];
    // setData(newData);
// >>>>>>> main
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

