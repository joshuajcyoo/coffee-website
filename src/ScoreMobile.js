import React, { useState } from 'react';
import './App.css';
import {ReactComponent as ScoreIcon} from './Logos/sort-score.svg'
import {ReactComponent as AmbianceIcon} from './Logos/sort-ambiance.svg'
import {ReactComponent as WorkabilityIcon} from './Logos/sort-workability5.svg'
import {ReactComponent as DrinksIcon} from './Logos/sort-drinks6.svg'
import {ReactComponent as OutletIcon} from './Logos/filter-outlet2.svg'
import {ReactComponent as CursorIcon} from './Logos/cursor.svg'

const ScoreMobile = ({ cafe }) => {
    return (
        <div className="mobile-score-container">
            <div className="mobile-score-overall">
                <div className="mobile-score-overall-number" style={cafe && {backgroundColor: cafe.color_code}}>
                    <span>{cafe && cafe.score}</span>
                </div>
            </div>
            <div className="mobile-score-subscores">
                <div className="mobile-score-subscore">
                    <AmbianceIcon className='mobile-score-subscore-icon ambiance' style={cafe && {fill: cafe.color_code}} />
                    <div className="mobile-score-bar-container" style={{borderColor: cafe && cafe.color_code}}>
                    {/* <div className="mobile-score-bar-container"> */}
                        <div 
                            className="mobile-score-bar-fill" 
                            style={{ width: `${((cafe && cafe.ambiance) / 3) * 100}%`
                            , backgroundColor: cafe && cafe.color_code 
                            }} 
                        ></div>
                    </div>
                    <div className="mobile-score-subscore-number" style={{color: cafe && cafe.color_code}}>{cafe && cafe.ambiance}</div>
                </div>
                <div className="mobile-score-subscore">
                    <WorkabilityIcon className='mobile-score-subscore-icon workability' style={cafe && {fill: cafe.color_code}}/>
                    <div className="mobile-score-bar-container" style={{borderColor: cafe && cafe.color_code}}>
                    {/* <div className="mobile-score-bar-container"> */}
                        <div 
                            className="mobile-score-bar-fill" 
                            style={{ width: `${((cafe && cafe.workability) / 3) * 100}%`
                            , backgroundColor: cafe && cafe.color_code 
                            }} 
                        ></div>
                    </div>
                    <div className="mobile-score-subscore-number" style={{color: cafe && cafe.color_code}}>{cafe && cafe.workability}</div>
                </div>
                <div className="mobile-score-subscore">
                    <DrinksIcon className='mobile-score-subscore-icon drinks' style={cafe && {fill: cafe.color_code}}/>
                    <div className="mobile-score-bar-container" style={{borderColor: cafe && cafe.color_code}}>
                    {/* <div className="mobile-score-bar-container"> */}
                        <div 
                            className="mobile-score-bar-fill" 
                            style={{ width: `${((cafe && cafe.drinks) / 3) * 100}%`
                            , backgroundColor: cafe && cafe.color_code 
                            }} 
                        ></div>
                    </div>
                    <div className="mobile-score-subscore-number" style={{color: cafe && cafe.color_code}}>{cafe && cafe.drinks}</div>
                </div>
                <div className="mobile-score-subscore">
                    <OutletIcon className='mobile-score-subscore-icon outlets' style={cafe && {fill: cafe.color_code}}/>
                    <div className="mobile-score-bar-container outlet" style={{borderColor: cafe && cafe.color_code}}>
                    {/* <div className="mobile-score-bar-container outlet"> */}
                        <div 
                            className="mobile-score-bar-fill" 
                            style={{ width: `${((cafe && cafe.outlets) / 1) * 100}%`
                            , backgroundColor: cafe && cafe.color_code 
                            }} 
                        ></div>
                    </div>
                    <div className="mobile-score-subscore-number" style={{color: cafe && cafe.color_code}}>{cafe && cafe.outlets}</div>
                </div>
            </div>
        </div>
    )
}

export default ScoreMobile;