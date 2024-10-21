import React, { useState } from 'react';
import './App.css';
import {ReactComponent as ScoreIcon} from './Logos/sort-score.svg'
import {ReactComponent as AmbianceIcon} from './Logos/sort-ambiance.svg'
import {ReactComponent as WorkabilityIcon} from './Logos/sort-workability.svg'
import {ReactComponent as DrinksIcon} from './Logos/sort-drinks.svg'
import {ReactComponent as OutletIcon} from './Logos/filter-outlet.svg'

const ScoreBlock = ({ cardData }) => {
    const overall = (cardData.score / 10) * 100;
    const ambiance = ((cardData.ambiance - 1) / 2) * 100;
    const workability = ((cardData.workability - 1) / 2) * 100;
    const drinks = ((cardData.drinks - 1) / 2) * 100;
    const outlets = (cardData.outlets / 1) * 100;

    return (
        <div className="progress-block">
            <div id="score-bar-container" className="progress-bar-container">
                <div><ScoreIcon id="score-score-icon" style={{ fill: cardData.color_code}}/></div>
                <div id="score-progress-bar" className="progress-bar" style={{ border: "2px solid " + cardData.color_code}}>
                    <div className="progress-fill" style={{ width: `${overall}%`, backgroundColor: cardData.color_code }}>
                    </div>
                </div>
                <div id="overall-score-text" className="progress-score-text" style={{color: cardData.color_code}}>
                    {cardData.score}
                </div>
            </div>
            <div className="progress-bar-container">
                <div><AmbianceIcon className="progress-bar-icon" style={{ fill: cardData.color_code}} /></div>
                <div className="progress-bar" style={{ border: "2px solid " + cardData.color_code}}>
                    <div className="progress-fill" style={{ width: `${ambiance}%`, backgroundColor: cardData.color_code }}>
                    </div>
                </div>
                <div className="progress-score-text" style={{color: cardData.color_code}}>
                    {cardData.ambiance}
                </div>
            </div>
            <div className="progress-bar-container">
                <div><WorkabilityIcon className="progress-bar-icon" style={{ stroke: cardData.color_code}} /></div>
                <div className="progress-bar" style={{ border: "2px solid " + cardData.color_code}}>
                    <div className="progress-fill" style={{ width: `${workability}%`, backgroundColor: cardData.color_code }}>
                    </div>
                </div>
                <div className="progress-score-text" style={{color: cardData.color_code}}>
                    {cardData.workability}
                </div>
            </div>
            <div className="progress-bar-container">
                <div><DrinksIcon className="progress-bar-icon" style={{ fill: cardData.color_code, stroke: cardData.color_code}} /></div>
                <div className="progress-bar" style={{ border: "2px solid " + cardData.color_code}}>
                    <div className="progress-fill" style={{ width: `${drinks}%`, backgroundColor: cardData.color_code }}>
                    </div>
                </div>
                <div className="progress-score-text" style={{color: cardData.color_code}}>
                    {cardData.drinks}
                </div>
            </div>
            <div id="outlets-bar-container" className="progress-bar-container">
                <div><OutletIcon id="outlets-score-icon" className="progress-bar-icon" style={{ fill: cardData.color_code, stroke: cardData.color_code}} /></div>
                <div id="outlets-progress-bar" className="progress-bar" style={{ border: "2px solid " + cardData.color_code}}>
                    <div className="progress-fill" style={{ width: `${outlets}%`, backgroundColor: cardData.color_code }}>
                    </div>
                </div>
                <div className="progress-score-text" style={{color: cardData.color_code}}>
                    {cardData.outlets}
                </div>
            </div>
        </div>
    );
};
  export default ScoreBlock;