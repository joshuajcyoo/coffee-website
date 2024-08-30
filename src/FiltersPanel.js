import React, { useRef, useEffect, useState } from 'react';

export default function FiltersPanel({addFilter}) {

    // define functions for each filter option
    // as defined here they can have any arguments, but must eventually
    // be wrapped in an arrow function taking only 1 cafe as a parameter
    const inNeighborhood = (cafe, neighborhood) => {
        return cafe.neighborhood === neighborhood;
    };
    

    return (
        <div className="map-wrap">
            <button onClick={() => addFilter(
                (cafe) => inNeighborhood(cafe, "Koreatown")
            )}>
                only cafes in Koreatown
            </button>
        </div>
    );
}