import './App.css';
import * as React from 'react';
import Map from './Map';

export default function Home() {
  const data = [
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
      hidden_gem: true
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
      hidden_gem: false
    }
  ];

  return (
    <div>
      <Map
        lat={34.06136799199684}
        lng={-118.30864605232344}
        zoom={11}
        data={data}
      />
      {/* <SidePanel

      /> */}
    </div>
  )
}

