import React, { useRef, useEffect, useState } from 'react';

function Card({cardData, selectCafe}) {
    return (
        <div>
            {cardData.name}
            <button onClick={() => selectCafe(cardData)}>select me</button>
            {cardData.is_selected && 
                <div>{cardData.address}</div>
            }
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
    

    return (
        <div>
            <div>
                <button onClick={() => pickSortingOption(
                    (cafe1, cafe2) => latLessThan(cafe1, cafe2)
                )}>sort by ascending latitude</button>
                <button onClick={() => pickSortingOption(
                    (cafe1, cafe2) => latGreaterThan(cafe1, cafe2)
                )}>sort by descending latitude</button>
            </div>
            {data.map(
                (element) => element.visible && <Card cardData={element} selectCafe={selectCafe}/>
            )}
        </div>
    )
}