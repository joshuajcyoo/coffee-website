import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import GoogleMaps from "./Logos/googlemapslogo.png"
import Yelp from "./Logos/yelplogo.png"

function Card({cardData, isExpanded, handleCardClick}) {
    const [isHovered, setIsHovered] = useState(false); 

    return (
        <div className={`card-container ${isExpanded ? 'expanded' : ''}`} style={isHovered && !isExpanded ? { backgroundColor: cardData.color_code, color: '#FFFFFF' } : {color : '#000000'}} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
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
                    <div className="card-header-score" style={isExpanded ? { display: 'none' } : {} }>
                        {cardData.score}
                    </div>
                    <div style={isExpanded ? {} : { display: 'none' } }>
                        —
                    </div>
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

export default function ResultsPanel({data, selectCafe, pickSortingOption, addFilter, rightRef}) {
    
    // const latLessThan = (cafe1, cafe2) => {
    //     if (cafe1.latitude < cafe2.latitude) return 1;
    //     if (cafe1.latitude > cafe2.latitude) return -1;
    //     return 0;
    // };

    // const latGreaterThan = (cafe1, cafe2) => {
    //     return -latLessThan(cafe1, cafe2);
    // };

    // const [expandedCard, setExpandedCard] = useState(null);
    // const [clickedCards, setClickedCards] = useState([]); // Track clicked card IDs
    // const containerRef = useRef(null); // Create a ref for the scrollable container

    // useEffect(() => {
    //     const selectedCard = data.find((element) => element.is_selected);
    //     if (selectedCard) {
    //         setExpandedCard(selectedCard.id);

    //         setClickedCards((prevClickedCards) => {
    //             if (!prevClickedCards.includes(selectedCard.id)) {
    //                 return [selectedCard.id, ...prevClickedCards];
    //             }
    //             else {
    //                 let tempClickedCards = prevClickedCards.filter(id => id !== selectedCard.id);
    //                 return [selectedCard.id, ...tempClickedCards]
    //             }
    //         });
    //     }
    //     else {
    //         setExpandedCard(null);
    //     }

    //     if (rightRef.current) {
    //         rightRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    //     }
    // }, [data]);

    // const handleCardClick = (cardData) => {
    //     setExpandedCard((id) => (id === cardData.id ? null : cardData.id));
    //     selectCafe(cardData);

    //     // setClickedCards((prevClickedCards) => {
    //     //     if (!prevClickedCards.includes(cardData.id)) {
    //     //         return [cardData.id, ...prevClickedCards];
    //     //     }
    //     //     else {
    //     //         let tempClickedCards = prevClickedCards.filter(id => id !== cardData.id);
    //     //         return [cardData.id, ...tempClickedCards]
    //     //     }
    //     // });

    // };

    // const renderCards = () => {
    //     const orderedData = clickedCards.map(id => data.find(element => element.id === id))
    //         .concat(data.filter(element => !clickedCards.includes(element.id)));

    //     return orderedData.map((element) => (
    //         element.visible && 
    //         <Card 
    //             key={element.id} 
    //             cardData={element} 
    //             selectCafe={selectCafe} 
    //             isExpanded={element.id === expandedCard} 
    //             handleCardClick={handleCardClick} 
    //             addFilter={addFilter}
    //         />
    //     ));
    // };

    // return (
    //     <div>
    //         <div id="sorting-options">
    //             <button onClick={() => pickSortingOption(
    //                 (cafe1, cafe2) => latLessThan(cafe1, cafe2)
    //             )}>sort by ascending latitude</button>
    //             <button onClick={() => pickSortingOption(
    //                 (cafe1, cafe2) => latGreaterThan(cafe1, cafe2)
    //             )}>sort by descending latitude</button>
    //         </div>

    //         <div id="data-cards">
    //         {renderCards()}
    //             {/* {[
    //                 // Render the clicked cards at the top (most recent first)
    //                 ...data.filter(element => clickedCards.includes(element.id)),
    //                 // Then render the remaining unclicked cards
    //                 ...data.filter(element => !clickedCards.includes(element.id))
    //             ]
    //             .map(element => (
    //                 element.visible && 
    //                 <Card 
    //                     key={element.id} 
    //                     cardData={element} 
    //                     selectCafe={selectCafe} 
    //                     isExpanded={element.id === expandedCard} 
    //                     handleCardClick={handleCardClick} 
    //                     addFilter={addFilter}
    //                 />
    //             ))} */}
    //         {/* {data.map(
    //             (element) => element.visible && 
    //             <Card key={element.id} cardData={element} selectCafe={selectCafe} isExpanded={element.id === expandedCard} handleCardClick={handleCardClick} addFilter={addFilter}/>
    //         )} */}
    //         </div>
    //     </div>
    // )

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
        console.log("selected", selectedCard);
        if (selectedCard) {
            setExpandedCard(selectedCard.id);
            const allCards = data.filter((element) => element.visible);
            console.log(allCards);
            for (let i = 0; i < allCards.length; i++) {
                if (allCards[i].is_selected) {
                    if (rightRef.current) {
                        rightRef.current.scrollTo({ top: (i * 79.5), behavior: 'smooth' });
                    }
                }
            }
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
        <div id="results-panel">
            <div id="sorting-options">
                <button onClick={() => pickSortingOption(
                    (cafe1, cafe2) => latLessThan(cafe1, cafe2)
                )}>sort by ascending latitude</button>
                <button onClick={() => pickSortingOption(
                    (cafe1, cafe2) => latGreaterThan(cafe1, cafe2)
                )}>sort by descending latitude</button>
            </div>

            <div id="data-cards" style={{ height: parseInt(((data.filter((element) => element.visible).length) * 79.5 + 450) + "px")}}>
                {data.filter(element => {
                        if (element.visible) {
                            return element;
                        }
                    })
                    .map((element) => (
                        <Card 
                            key={element.id} 
                            cardData={element} 
                            selectCafe={selectCafe} 
                            isExpanded={element.id === expandedCard} 
                            handleCardClick={handleCardClick}
                            addFilter={addFilter}
                        />
                    ))
                }
                {/* <div id="about">
                    About
                </div> */}
            </div>
        </div>
    )
}