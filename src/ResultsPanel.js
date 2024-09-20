import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import GoogleMaps from "./Logos/googlemapslogo.png"
import Yelp from "./Logos/yelplogo.png"

function Card({cardData, isExpanded, handleCardClick}) {

    return (
        <div className={`card-container ${isExpanded ? 'expanded' : ''}`}>
            <div className="card-header" onClick={() => handleCardClick(cardData)}>
                {/* <div className="card-name">{cardData.name}<span className="card-subname">{cardData.subname}</span></div>
                <div className="card-neighborhood" style={{ backgroundColor: cardData.color_code }}>{cardData.neighborhood}</div> */}

                <div className="card-name-neighborhood">
                    <div className="card-name">
                        {cardData.name}<span className="card-subname">{cardData.subname}</span>
                    </div>
                    <div className="card-neighborhood" style={{ backgroundColor: cardData.color_code, maxWidth: cardData.max_width }}>
                        {cardData.neighborhood}
                    </div>
                </div>
                <div className="card-toggle">
                    {isExpanded ? "—" : "+"}
                </div>  
            </div>

            <div className="card-content">
                <hr className="card-divider" />
                <div className='card-image-container'>
                    <img src={cardData.image} alt={cardData.name} className="card-image" />
                </div>
                
                <div className='card-address'>Address: {cardData.address}</div>

                <div className='card-score'>Score: {cardData.score}</div>

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
}

export default function ResultsPanel({data, selectCafe, pickSortingOption}) {
    
    // define functions for each sorting options
    // to use js sort(), return -1, 0, or 1 based on whatever property u care about
    const latLessThan = (cafe1, cafe2) => {
        if (cafe1.latitude < cafe2.latitude) return 1;
        if (cafe1.latitude > cafe2.latitude) return -1;
        return 0;
    };

    const latGreaterThan = (cafe1, cafe2) => {
        return -latLessThan(cafe1, cafe2);
    };

    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const selectedCard = data.find((element) => element.is_selected);
        if (selectedCard) {
            setExpandedCard(selectedCard.id);
        }
        else {
            setExpandedCard(null);
        }
    }, [data]);

    const handleCardClick = (cardData) => {
        setExpandedCard((id) => (id === cardData.id ? null : cardData.id));
        selectCafe(cardData);
    };

    return (
        <div>
            <div id="sorting-options">
                <button onClick={() => pickSortingOption(
                    (cafe1, cafe2) => latLessThan(cafe1, cafe2)
                )}>sort by ascending latitude</button>
                <button onClick={() => pickSortingOption(
                    (cafe1, cafe2) => latGreaterThan(cafe1, cafe2)
                )}>sort by descending latitude</button>
            </div>

            <div id="data-cards">
            {data.map(
                (element) => element.visible && 
                <Card key={element.id} cardData={element} selectCafe={selectCafe} isExpanded={element.id === expandedCard} handleCardClick={handleCardClick}/>
            )}
            {/* {data.map((element) => {
                    if (expandedCard === null || element.id === expandedCard) {
                        return element.visible && (
                            <Card
                                key={element.id}
                                cardData={element}
                                selectCafe={selectCafe}
                                isExpanded={element.id === expandedCard}
                                handleCardClick={handleCardClick}
                            />
                        );
                    }
                    return null;
                })} */}
            </div>
        </div>
    )
}