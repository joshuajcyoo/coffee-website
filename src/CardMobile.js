import React, { useRef, useEffect, useState, forwardRef } from 'react';
import './App.css';
import GoogleMaps from "./Logos/googlemapslogo.png";
import Yelp from "./Logos/yelplogo.png";
import ScoreBar from "./ScoreBar";
import CardTags from "./CardTags"
import {ReactComponent as CloseCardIcon} from './Logos/close-card.svg'
import {ReactComponent as OpenCardIcon} from './Logos/open-card.svg'
import {ReactComponent as ScoreIcon} from './Logos/sort-score.svg'
import {ReactComponent as AmbianceIcon} from './Logos/sort-ambiance.svg'
import {ReactComponent as WorkabilityIcon} from './Logos/sort-workability2.svg'
import {ReactComponent as DrinksIcon} from './Logos/sort-drinks2.svg'
import {ReactComponent as ScrollUpIcon} from './Logos/scroll-top.svg'
import { format } from 'maplibre-gl';

const CardMobile = forwardRef(({cardData, isExpanded, handleCardClick, hoveredCafe, setHoveredCafe, scoreBarHover, setScoreBarHover, selectedCafe, mobileState, setMobileState, exitMobilePage, setExitMobilePage}, ref) => {
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
      if (cardData.hours[i].open === 0) {
          formattedHours.push('CLOSED')
          formattedHours.push('CLOSED')
      }
      else {
          if (cardData.hours[i].open >= 1000) {
              openHour = cardData.hours[i].open.toString().slice(0, 2);
              openMinutes = cardData.hours[i].open.toString().slice(2, 4);
              if (cardData.hours[i].open >= 1200) openAmPm = 'PM';
              else openAmPm = 'AM';
          }
          else {
              openHour = cardData.hours[i].open.toString().slice(0, 1);
              openMinutes = cardData.hours[i].open.toString().slice(1, 3);
              openAmPm = 'AM';
          }

          if ((cardData.hours[i].close) === 2400) {
              closeHour = "12"
              closeMinutes = "00";
              closeAmPm = 'AM';
          }
          else if ((cardData.hours[i].close) == 1200) {
              closeHour = "12"
              closeMinutes = "00";
              closeAmPm = 'PM';
          }
          else if ((cardData.hours[i].close) >= 2200) {
              closeHour = (cardData.hours[i].close - 1200).toString().slice(0, 2);
              closeMinutes = cardData.hours[i].close.toString().slice(2, 4);
              closeAmPm = 'PM';
          }
          else if ((cardData.hours[i].close) <= 400) {
              closeHour = (cardData.hours[i].close).toString().slice(0, 1);
              closeMinutes = cardData.hours[i].close.toString().slice(1, 3);
              closeAmPm = 'AM';
          }
          else {
              closeHour = (cardData.hours[i].close - 1200).toString().slice(0, 1);
              closeMinutes = (cardData.hours[i].close - 1200).toString().slice(1, 3);
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

  const openCafePage = () => {
    setExitMobilePage(mobileState);
    setMobileState("page");
  }

    return (
        <div className="mobile-card" style={selectedCafe && selectedCafe.id === cardData.id ? {backgroundColor: selectedCafe.color_code, color: 'white'}: {backgroundColor: 'white', color: cardData.color_code}} ref={ref}>
            <div className="mobile-card-header" onClick={() => handleCardClick(cardData)}>
                <div className="mobile-card-header-nameneighborhood">
                    {cardData.new && 
                        <div className="mobile-card-new">
                            <span className="mobile-card-new-tag" style={selectedCafe && selectedCafe.id === cardData.id ? {transition: 'color 0.3s ease', backgroundColor: 'white', color: '#048204'} : {transition: 'color 0.3s ease', backgroundColor: '#048204', color: "white"}}>NEW</span>
                        </div>
                        }
                    <div className="mobile-card-name">
                        <span className="mobile-card-name-style" style={selectedCafe && selectedCafe.id === cardData.id ? {transition: 'color 0.3s ease', color: "white"} : {transition: 'color 0.3s ease', color: "black"}}>
                            {cardData.name}
                        </span>
                        {/* <span className="mobile-card-subname" style={selectedCafe && selectedCafe.id === cardData.id ? {transition: 'color 0.3s ease', color: "white"} : {transition: 'color 0.3s ease', color: "black"}}>{cardData.subname}</span> */}
                    </div>
                    {cardData.subname &&
                        <div className="mobile-card-subname" style={selectedCafe && selectedCafe.id === cardData.id ? {transition: 'color 0.3s ease', color: "white"} : {transition: 'color 0.3s ease', color: "black"}}>
                            {cardData.subname}
                        </div>
                    }
                    <div className="mobile-card-neighborhood">
                        <span className="mobile-card-neighborhood-style" style={selectedCafe && selectedCafe.id === cardData.id ? {transition: 'color 0.9s ease, border 0.9s ease', backgroundColor: cardData.color_code, border: '2px solid #FFFFFF'} : {transition: 'color 0.8s ease-out, border: 0.8s ease-out', color: cardData.color_code, border: "2px solid" + cardData.color_code}}>
                            {cardData.neighborhood}
                        </span>
                    </div>
                </div>
                <div className="mobile-card-header-score">
                  {selectedCafe && selectedCafe.id === cardData.id ? 
                  <ScrollUpIcon className="mobile-card-minimize"/>
                  :
                  <div className="mobile-card-score" style={selectedCafe && selectedCafe.id === cardData.id ? {transition: 'color 0.3s ease', border: '3px solid white', color: 'white'} : {transition: 'color 0.3s ease', border: '3px solid ' + cardData.color_code, color: 'black'}}>
                    {cardData.score}
                  </div>
                  } 
                </div>  
            </div>

            {selectedCafe && selectedCafe.id === cardData.id && <hr className="mobile-card-divider" />}

            <div className={`mobile-card-body ${selectedCafe && selectedCafe.id === cardData.id ? "expanded" : ""}`}>
              <img src={cardData.image} alt={cardData.name} className="mobile-card-image" />

              <div className="mobile-card-info">
                <div className="mobile-card-hoursaddress">
                  <div className="mobile-card-address">
                    Address: <span style={{fontFamily: 'Mulish SemiBold'}}>{cardData.address}</span>
                  </div>
                  <div className="mobile-card-hours">
                    Hours Today: <span style={{fontFamily: 'Mulish SemiBold'}}>{cafePopupOpen === "CLOSED" ? "Closed" : `${cafePopupOpen} – ${cafePopupClose}`}</span>
                  </div>
                </div>
                
                <div className="mobile-card-body-score">
                  <div className="mobile-card-body-score-number">{cardData.score}</div>
                </div>
              </div>

              <div className="mobile-card-pagedirections">
                <div className="mobile-card-page" onClick={openCafePage}>
                  <span>Open Full Page</span>
                  <OpenCardIcon className="mobile-card-page-icon" />
                </div>
                <div className="mobile-card-directions">
                  <a href={cardData.google_maps} target="_blank">
                    <div className="mobile-card-directions-button">
                      <img src={GoogleMaps} alt="Google Maps Logo" className="mobile-card-directions-button-logo" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
        </div>
    );
});

export default CardMobile;