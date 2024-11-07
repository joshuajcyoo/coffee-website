import React, { useRef, useEffect, useState } from 'react';
import './App.css';

export default function CardTags({cardData}) {
    const [filterList, setFilterList] = useState(new Map());

    useEffect(() => {
        const newFilterList = new Map();
        if (cardData.outlets > 0) newFilterList.set("Outlets", "#A2A2A2");
        if (cardData.study_work) newFilterList.set("Study / Work", "#A2A2A2");
        if (cardData.outdoor_area) newFilterList.set("Outdoor Area", "#A2A2A2");
        if (cardData.is_aesthetic) newFilterList.set("Aesthetic", "#A2A2A2");
        if (cardData.has_food) newFilterList.set("Food Menu", "#A2A2A2");
        if (cardData.hidden_gem) newFilterList.set("Hidden Gem", "#A2A2A2");

        if (cardData.wifi_issues) newFilterList.set("Wifi Issues", "#CBCBCB");
        if (cardData.often_crowded) newFilterList.set("Often Crowded", "#CBCBCB");
        if (cardData.closes_early) newFilterList.set("Closes Early", "#CBCBCB");
        if (cardData.high_prices) newFilterList.set("High Prices", "#CBCBCB");

        setFilterList(newFilterList);
    }, [cardData]);

    return (
        <div id="card-tags-container">
            {Array.from(filterList).map(([key, value]) => (
                <div className="card-tag" style={{border: `2px solid ${value}`, color: value}}>{key}</div>
            ))}
        </div>
    )
}