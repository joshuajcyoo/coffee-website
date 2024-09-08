import { getValue } from '@testing-library/user-event/dist/utils';
import './App.css';
import React, { useRef, useEffect, useState } from 'react';

export default function FiltersPanel({data, addFilter}) {

    // define functions for each filter option
    // as defined here they can have any arguments, but must eventually
    // be wrapped in an arrow function taking only 1 cafe as a parameter
    const inNeighborhood = (cafe, neighborhood) => {
        return cafe.neighborhood === neighborhood;
    };

    const handleNeighborhood = (neighborhood) => {
        const selectedNeighborhood = neighborhood.target.value;
        if (selectedNeighborhood === "All Neighborhoods") {
            addFilter(() => true);
        } else {
            addFilter((cafe) => inNeighborhood(cafe, selectedNeighborhood));
        }
    };
    
    return (
        <div id='filters-panel'>
            <div id="neighborhood-title">View by Neighborhood</div>
            <select onChange={handleNeighborhood}>
                <option value="All Neighborhoods">All Neighborhoods</option>
                <option value="Koreatown/Mid-City">Koreatown/Mid-City</option>
                <option value="Echo Park/Silver Lake/Chinatown">Echo Park/Silver Lake/Chinatown</option>
            </select>
        </div>
    );
}