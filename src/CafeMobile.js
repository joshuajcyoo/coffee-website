import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from "react";
import './Mobile.css';
import ImageLightbox from './ImageLightbox';
import ScoreMobile from './ScoreMobile';
import GoogleMaps from "./Logos/googlemapslogo.png";
import AppleMaps from "./Logos/applemapslogo.png";
import Yelp from "./Logos/yelplogo.png";
import {ReactComponent as BackArrow} from './Logos/back-arrow.svg'

const CafeMobile = ({ mobileState, setMobileState, exitMobilePage, setExitMobilePage, selectedCafe }) => {

  const mobilePageBack = () => {
    setMobileState(exitMobilePage)
    setExitMobilePage('');
  };
  const backText = exitMobilePage.charAt(0).toUpperCase() + exitMobilePage.slice(1);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState('');

  // Handler functions
  const openLightbox = (src) => {
    setCurrentImageSrc(src);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setCurrentImageSrc(''); // Clear image source
  };

  let formattedHours = [];
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  for (let i = 0; i < 7; i++) {
      let openHour, openMinutes, openAmPm, closeHour, closeMinutes, closeAmPm;
      if (selectedCafe && selectedCafe.hours[i].open === 0) {
          formattedHours.push('CLOSED')
          formattedHours.push('CLOSED')
      }
      else if (selectedCafe) {
          if (selectedCafe && selectedCafe.hours[i].open >= 1000) {
              openHour = selectedCafe.hours[i].open.toString().slice(0, 2);
              openMinutes = selectedCafe.hours[i].open.toString().slice(2, 4);
              if (selectedCafe && selectedCafe.hours[i].open >= 1200) openAmPm = 'PM';
              else openAmPm = 'AM';
          }
          else if (selectedCafe) {
              openHour = selectedCafe.hours[i].open.toString().slice(0, 1);
              openMinutes = selectedCafe.hours[i].open.toString().slice(1, 3);
              openAmPm = 'AM';
          }
  
          if ((selectedCafe && selectedCafe.hours[i].close) === 2400) {
              closeHour = "12"
              closeMinutes = "00";
              closeAmPm = 'AM';
          }
          else if ((selectedCafe && selectedCafe.hours[i].close) == 1200) {
              closeHour = "12"
              closeMinutes = "00";
              closeAmPm = 'PM';
          }
          else if ((selectedCafe && selectedCafe.hours[i].close) >= 2200) {
              closeHour = (selectedCafe.hours[i].close - 1200).toString().slice(0, 2);
              closeMinutes = selectedCafe.hours[i].close.toString().slice(2, 4);
              closeAmPm = 'PM';
          }
          else if ((selectedCafe && selectedCafe.hours[i].close) <= 400) {
              closeHour = (selectedCafe.hours[i].close).toString().slice(0, 1);
              closeMinutes = selectedCafe.hours[i].close.toString().slice(1, 3);
              closeAmPm = 'AM';
          }
          else if (selectedCafe) {
              closeHour = (selectedCafe.hours[i].close - 1200).toString().slice(0, 1);
              closeMinutes = (selectedCafe.hours[i].close - 1200).toString().slice(1, 3);
              closeAmPm = 'PM';
          }

          if (parseInt(openMinutes) === 0) formattedHours.push(openHour + " " + openAmPm);
          else formattedHours.push(openHour + ":" + openMinutes + " " + openAmPm);

          if (parseInt(closeMinutes) === 0) formattedHours.push(closeHour + " " + closeAmPm);
          else formattedHours.push(closeHour + ":" + closeMinutes + " " + closeAmPm);
      }
  }
  
  const todayNumber = new Date().getDay();
  
  return (
    <div className={`mobile-cafe ${(mobileState === "page" && !isLightboxOpen) ? "show" : (mobileState === "page" && isLightboxOpen ? "lightbox" : "")}`} style={isLightboxOpen ? {overflowY: 'hidden'} : {overflowY: 'scroll'}}>
        <div className="mobile-cafe-back" onClick={mobilePageBack}>
          <div className="mobile-cafe-back-sticky">
            <BackArrow className='mobile-cafe-back-arrow'/>
            <div className="mobile-cafe-back-text">Back to {backText} View</div>
          </div>
        </div>

        <div className="mobile-cafe-names">
          <div className="mobile-cafe-name">{selectedCafe && selectedCafe.name}</div>
          <div className="mobile-cafe-subname">{selectedCafe && selectedCafe.subname}</div>
          <div className="mobile-cafe-neighborhood">
            <span className="mobile-cafe-neighborhood-style" style={selectedCafe && {color: selectedCafe.color_code, border: "2px solid " + selectedCafe.color_code}}>
              {selectedCafe && selectedCafe.neighborhood}
            </span>
          </div>
        </div>

        <div className="photo-gallery">
          <div className="photo-gallery-inner">
            <img src={selectedCafe && selectedCafe.image} alt="photo 1" onClick={() => openLightbox(selectedCafe.image)}/>
            <img src={selectedCafe && selectedCafe.c_image2} alt="photo 2" onClick={() => openLightbox(selectedCafe.c_image2)}/>
            <img src={selectedCafe && selectedCafe.c_image3} alt="photo 3" onClick={() => openLightbox(selectedCafe.c_image3)}/>
          </div>
        </div>
        <ImageLightbox 
          imageSrc={currentImageSrc} 
          onClose={closeLightbox} 
        />

        {(selectedCafe && selectedCafe.description) &&
        <>
          <div className="mobile-cafe-about">
            About
          </div>
          <div className="mobile-cafe-description">
            {selectedCafe && selectedCafe.description}
            {selectedCafe && selectedCafe.suggested_drink && (
              <div className="mobile-cafe-suggested-drink">For a drink rec: <span style={{fontFamily: "Mulish Bold"}}>{selectedCafe && selectedCafe.suggested_drink}</span></div>
            )}
            {selectedCafe && selectedCafe.suggested_food && (
              <div className="mobile-cafe-suggested-food">For a food rec: <span style={{fontFamily: "Mulish Bold"}}>{selectedCafe && selectedCafe.suggested_food}</span></div>
            )}
          </div>
        </>
        }
          

        

        <div className="mobile-cafe-score-title">Score</div>
        <div className="mobile-cafe-score-container">
          <ScoreMobile 
            cafe={selectedCafe && selectedCafe}
          />
        </div>

        <div className="mobile-cafe-hours-location">
          Hours & Location
        </div>
        <div className="mobile-cafe-hours-location-container">
          <div className="mobile-cafe-hours-container">
            <table className="mobile-cafe-hours">
                <tbody>
                  {formattedHours.map((hour, index) => {
                    if (index % 2 === 0) {
                      if (hour !== "CLOSED") {
                          return <tr>
                            <th className={(index === 12 && "last-row") || (index === 0 && "first-row")} key={days[(index / 2)]}>{days[(index / 2)]}</th>
                            <td style={index === (todayNumber * 2) ? {fontFamily: "Mulish ExtraBold"} : {}} className={`right ${(index === 12 && "last-row") || (index === 0 && "first-row")}`} key={index}>{hour} – {formattedHours[index + 1]}</td>
                            {/* <td style={{fontFamily: "Mulish ExtraBold"}} className={`right ${index === 12 ? "last-row" : (index === 0 ? "first-row" : "")}`} key={index + 1}>{formattedHours[index + 1]}</td> */}
                          </tr>
                      }
                      else {
                        return <tr>
                            <th className={(index === 12 && "last-row") || (index === 0 && "first-row")} key={days[(index / 2)]}>{days[(index / 2)]}</th>
                            <td style={index === (todayNumber * 2) ? {fontFamily: "Mulish ExtraBold"} : {}} className={`right ${(index === 12 && "last-row") || (index === 0 && "first-row")}`} key={index}>CLOSED</td>
                            {/* <td style={{fontFamily: "Mulish ExtraBold"}} className={`right ${index === 12 ? "last-row" : (index === 0 ? "first-row" : "")}`} key={index + 1}>{formattedHours[index + 1]}</td> */}
                          </tr>
                      }
                    }
                  })}
                </tbody>
            </table>
          </div>
          <div className="mobile-cafe-location-container">
            <div className="mobile-cafe-location-address"><a style={{color: "#000000", textDecoration: "none"}}>{selectedCafe && selectedCafe.address}, Los Angeles, CA</a></div>
            <a style={{textDecoration: "none", color: "black"}} href={selectedCafe && selectedCafe.google_maps_page} target="_blank">
              <div className="mobile-cafe-location-googlemaps">
                <img src={AppleMaps} alt="Apple Maps Logo" className="mobile-cafe-location-googlemaps-logo" />
                <span style={{marginLeft: '5px'}}>Open in Maps</span>
              </div>
            </a>
            <a style={{textDecoration: "none", color: "black"}} href={selectedCafe && selectedCafe.yelp} target="_blank">
              <div className="mobile-cafe-location-yelp">
                <img src={Yelp} alt="Yelp Logo" className="mobile-cafe-location-yelp-logo" />
                <span style={{marginLeft: '5px'}}>Open in Yelp</span>
              </div>
            </a>
          </div>
        </div>
    </div>
  );
};

export default CafeMobile;