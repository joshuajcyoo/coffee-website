import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import CafeModal from './CafeModal';
import GoogleMaps from "./Logos/googlemapslogo.png";
import Yelp from "./Logos/yelplogo.png";
import ScoreBar from "./ScoreBar";
import CardTags from "./CardTags"
import {ReactComponent as CloseCardIcon} from './Logos/close-card.svg'

export default function Card({cardData, isExpanded, handleCardClick, hoveredCafe, setHoveredCafe}) {
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

    return (
        <div className={`card-container ${isExpanded ? 'expanded' : ''}`} style={isHovered && !isExpanded ? { backgroundColor: cardData.color_code, color: '#FFFFFF' } : {color : '#000000'}} onMouseEnter={() => handleHover(true)} onMouseLeave={() => handleHover(false)}>
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
                    <div className={`card-header-score${isExpanded ? '-expanded' : (isHovered ? '-hovered' : '')}`} onMouseEnter={() => setIsScoreHovered(true)} onMouseLeave={() => setIsScoreHovered(false)}>
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

                <div className='card-tags'>
                    {/* <ScoreBar cardData={cardData} /> */}
                    <CardTags cardData={cardData} />
                </div>
                
                {/* <div className='card-address'>Address: {cardData.address}</div>

                <div className='card-score'>Score: {cardData.score}</div> */}

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
                {/* <div onClick={toggleCafeModal}>Test Open Cafe Modal</div>
                <CafeModal show={showCafeModal} handleClose={toggleCafeModal}>
                    <div>{cardData.name}</div>
                </CafeModal> */}
            </div>
        </div>
    );
}