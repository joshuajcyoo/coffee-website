import React, { useRef, useEffect, useState, forwardRef } from 'react';
import './App.css';
import CafeModal from './CafeModal';
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
import { format } from 'maplibre-gl';

const Card = forwardRef(({cardData, isExpanded, handleCardClick, hoveredCafe, setHoveredCafe}, ref) => {
    let formattedHours = [];
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
    
            if ((cardData.hours[i].close) >= 2200) {
                closeHour = (cardData.hours[i].close - 1200).toString().slice(0, 2);
                closeMinutes = cardData.hours[i].close.toString().slice(2, 4);
                closeAmPm = 'PM';
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
    }

    const [isHovered, setIsHovered] = useState(false); 
    const [isScoreHovered, setIsScoreHovered] = useState(false);

    const [showCafeModal, setShowCafeModal] = useState(false);
    const toggleCafeModal = () => {
        setShowCafeModal(!showCafeModal);
    };

    const handleHover = (hover) => {
        if (hover) {
            setIsHovered(true);
            setHoveredCafe(cardData);
        }
        else {
            setIsHovered(false);
            setHoveredCafe(null);
        }
    };

    const [hoveredImage, setHoveredImage] = useState(null);

    return (
        <div className={`card-container ${isExpanded ? 'expanded' : ''}`} style={isHovered && !isExpanded ? { backgroundColor: cardData.color_code, color: '#FFFFFF' } : {color : '#000000'}} onMouseEnter={() => handleHover(true)} onMouseLeave={() => handleHover(false)} ref={ref}>
            <div className="card-header" onClick={() => handleCardClick(cardData)}>
                <div className="card-name-neighborhood">
                    <div className="card-name">
                        {cardData.name}<span className="card-subname">{cardData.subname}</span>
                    </div>
                    <div className="card-neighborhood" style={isHovered && !isExpanded ? { backgroundColor: cardData.color_code, border: '2px solid #FFFFFF' } : { color: cardData.color_code, border: "2px solid" + cardData.color_code }} >
                        {cardData.neighborhood}
                    </div>
                </div>
                <div className="card-toggle">
                    <div className={`card-header-score${isExpanded ? '-expanded' : (isHovered ? '-hovered' : '')}`} onMouseEnter={() => setIsScoreHovered(true)} onMouseLeave={() => setIsScoreHovered(false)} style={isHovered ? {border: '2px solid white'} : {border: '2px solid ' + cardData.color_code}}>
                        {cardData.score}
                    </div>
                    <div className={`card-header-minimize${isExpanded ? '-expanded' : ''}`} style={isExpanded ? {} : { display: 'none' } }>
                        <CloseCardIcon />
                    </div>
                </div>  
            </div>

            <div className="card-content">
                <hr className="card-divider" />
                <div className='card-image-container'>
                    <img src={cardData.image} alt={cardData.name} className="card-image" />
                </div>
    
                <div className="card-open-modal" onClick={toggleCafeModal}>
                    View Full Page
                    <OpenCardIcon className="card-open-icon" />
                </div>

                <CafeModal show={showCafeModal} handleClose={toggleCafeModal}>
                    <div className='cafe-modal-title'>{cardData.name}<span className='cafe-modal-subname'>{cardData.subname}</span></div>
                    <div><span className='cafe-modal-neighborhood' style={{border: '2px solid ' + cardData.color_code, color: cardData.color_code}}>{cardData.neighborhood}</span></div>

                    <div className={`cafe-modal-images${hoveredImage !== null ? '-hovered' : ''}`}>
                        <div className={`cafe-modal-image-container ${hoveredImage === 1 ? 'hovered' : ''}`} onMouseEnter={() => setHoveredImage(1)} onMouseLeave={() => setHoveredImage(null)}>
                            <img className="cafe-modal-image" src={cardData.image} />
                        </div>
                        <div className={`cafe-modal-image-container ${hoveredImage === 2 ? 'hovered' : ''}`} onMouseEnter={() => setHoveredImage(2)} onMouseLeave={() => setHoveredImage(null)}>
                            <img className="cafe-modal-image" src={cardData.c_image2} />
                        </div>
                        <div className={`cafe-modal-image-container ${hoveredImage === 3 ? 'hovered' : ''}`} onMouseEnter={() => setHoveredImage(3)} onMouseLeave={() => setHoveredImage(null)}>
                            <img className="cafe-modal-image" src={cardData.c_image3} />
                        </div>
                    </div>

                    <div className='cafe-modal-about-title'>About</div>
                    <div className='cafe-modal-description'>This is a placeholder for the short description about the cafe. The description will only apply for coffee shops not towards the bottom of the list.</div>

                    <div className='cafe-modal-score-title'>Score</div>
                    <div className='cafe-modal-score-bar'>
                        <ScoreBar cardData={cardData} cafeModal={true}/>
                        <div className='card-score-score' style={{color: cardData.color_code}}>{cardData.score}/10</div>
                    </div>
                    <div className='cafe-modal-hours-title'>Hours & Location</div>
                    <div className='cafe-modal-hours-location'>
                        <div className='cafe-modal-location'>
                            <div className='cafe-modal-address-title'>Address:<span className='cafe-modal-address'>{cardData.address}</span></div>
                            <div className="cafe-modal-google-maps-container">
                                <a href={cardData.google_maps_page} target="_blank" rel="noopener noreferrer" className="cafe-modal-google-maps">
                                    <img src={GoogleMaps} alt="Google Maps Logo" id='cafe-modal-google-maps-logo' className="card-google-maps-logo" />
                                    Open in Google Maps
                                </a>
                            </div>
                        </div>
                        <div className='cafe-modal-hours-table-container'>
                            <table className="cafe-modal-hours-table">
                                <thead>
                                    <tr className='cafe-modal-hours-table-top-row'>
                                        <th>Sun</th><th>Mon</th><th>Tues</th><th>Wed</th><th>Thurs</th><th>Fri</th><th>Sat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {formattedHours.map((hour, index) => {
                                            if (index % 2 === 0) {
                                                return <td style={{}} key={index}>{hour}</td>;
                                            }
                                        })}
                                    </tr>
                                    <tr className='cafe-modal-hours-table-bottom-row'>
                                        {formattedHours.map((hour, index) => {
                                            if (index % 2 != 0) {
                                                return <td style={{}} key={index}>{hour}</td>;
                                            }
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='cafe-modal-tags-title'>Filters</div>
                    <CardTags cardData={cardData} />
                </CafeModal>

                <div className='card-address'><span className="card-address-title">Address:</span> {cardData.address}</div>

                <div className='card-score-title'>Score:</div>

                <div className='card-score-bar'>
                    <ScoreBar cardData={cardData} />
                    <div className='card-score-score' style={{color: cardData.color_code}}>{cardData.score}/10</div>
                </div>

                <div className="card-external-links">
                    <div className="card-google-maps-container">
                        <a href={cardData.google_maps} target="_blank" rel="noopener noreferrer" className="card-google-maps">
                            <img src={GoogleMaps} alt="Google Maps Logo" className="card-google-maps-logo" />
                            Get Directions
                        </a>
                    </div>

                    <div className="card-yelp-container">
                        <a href={cardData.yelp} target="_blank" rel="noopener noreferrer" className="card-yelp">
                            <img src={Yelp} alt="Yelp Logo" className="card-yelp-logo" />
                            Open on Yelp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Card;