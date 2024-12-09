import React, { useState } from 'react';
import './App.css';
import {ReactComponent as ScoreIcon} from './Logos/sort-score.svg'
import {ReactComponent as AmbianceIcon} from './Logos/sort-ambiance.svg'
import {ReactComponent as WorkabilityIcon} from './Logos/sort-workability.svg'
import {ReactComponent as DrinksIcon} from './Logos/sort-drinks2.svg'
import {ReactComponent as OutletIcon} from './Logos/filter-outlet.svg'
import {ReactComponent as CursorIcon} from './Logos/cursor.svg'

const ScoreBar = ({ cardData, cafeModal, scoreBarHover, setScoreBarHover }) => {
    const filledWidth = `${(cardData.score / 10) * 100}%`;

    const ambianceWidth = `${(cardData.ambiance / cardData.score) * 100}%`;
    const workabilityWidth = `${(cardData.workability / cardData.score) * 100}%`;
    const drinksWidth = `${(cardData.drinks / cardData.score) * 100}%`;
    let outletsWidth = `${(cardData.outlets / cardData.score) * 100}%`;

    const [scoreHover, setScoreHover] = useState(false);
    const [hoveredSubscore, setHoveredSubscore] = useState(null);

    useState(() => {
        if (cafeModal) setScoreHover(true);
    });

    const [shrinkIcons, setShrinkIcons] = useState(false);

    useState(() => {
        if (cardData.ambiance === 0.5 || cardData.workability === 0.5 || cardData.drinks === 0.5 || cardData.outlets === 0.5) setShrinkIcons(true);
    })

    const handleScoreHover = (hover) => {
        if (hover) {
            setScoreHover(true);
            setScoreBarHover(false);
        }
        else {
            setScoreHover(false);
        }
    }

    const renderHoverPopup = (value, subscore) => {
        let addedWidth, subscoreTitle;
        let modalPosition = 0;
        let position = 0;
        if (subscore === 0) {
            addedWidth = `${((cardData.ambiance / cardData.score / 2) * 100) - 0.09}%`;
            subscoreTitle = 'Ambiance';
            if (value !== 0 && value !== 3) position = -0.05;
        }
        else if (subscore === 1) {
            if (cafeModal) modalPosition = 0.002;
            else modalPosition = 0.001;
            addedWidth = `${((cardData.ambiance / cardData.score) + (cardData.workability / cardData.score / 2) - 0.004 + modalPosition) * 100}%`;
            subscoreTitle = 'Workability';
            if (value !== 0 && value !== 3) position = -0.05;
        }
        else if (subscore === 2) {
            if (cafeModal) modalPosition = 0.005;
            addedWidth = `${((cardData.ambiance / cardData.score) + (cardData.workability / cardData.score) + (cardData.drinks / cardData.score / 2) - 0.009 + modalPosition) * 100}%`;
            subscoreTitle = 'Drinks';
            if (value !== 0 && value !== 3) position = -0.05;
        }
        else if (subscore === 3) {
            if (cafeModal) modalPosition = 0.003;
            addedWidth = `${((cardData.ambiance / cardData.score) + (cardData.workability / cardData.score) + (cardData.drinks / cardData.score) + (cardData.outlets / cardData.score / 2) - 0.004 + modalPosition) * 100}%`;
            subscoreTitle = 'Outlets';
            if (value === -0.5) position = -0.05;
        }

        return (
            <div
                className="hover-popup"
                style={{ left: addedWidth, border: '2px solid ' + cardData.color_code }}
            >
                <span className="hover-popup-title" style={{color: cardData.color_code}}>{subscoreTitle}</span>
                <span className="hover-popup-score">{value}/{subscore === 3 ? 1 : 3}</span>

                <div className="hover-popup-scale">
                    <div className="scale-line">
                        <div
                            className="scale-tick"
                            style={subscore !== 3 ? {
                                left: `${((value) / 3 + position + modalPosition) * 100}%`,
                                backgroundColor: cardData.color_code
                            } : {
                                left: `${((value) / 1 + position + modalPosition) * 100}%`,
                                backgroundColor: cardData.color_code
                            }} 
                        ></div>
                    </div>
                </div>
            </div>
        )
    };
  
    return (
        <div className={`score-block-container${cafeModal ? '-cafe-modal' : ''}`} onMouseEnter={() => handleScoreHover(true)} onMouseLeave={cafeModal ? (() => setScoreHover(true)) : (() => handleScoreHover(false))} style={{border: '2px solid ' + cardData.color_code}}>
            <div className="filled-score" style={{ width: filledWidth }}>
                {scoreHover ? <></> : 
                <div className="subscore score" style={{ width: '100%', backgroundColor: cardData.color_code }}>
                    {scoreBarHover ? <CursorIcon className='score-block-icon' id='score-block-icon-cursor'/> : <ScoreIcon className='score-block-icon' />}
                </div>}

                {scoreHover ? <><div className="subscore ambiance" onMouseEnter={() => setHoveredSubscore('ambiance')} onMouseLeave={() => setHoveredSubscore(null)} style={{ width: ambianceWidth, backgroundColor: cardData.color_code }}>
                    {hoveredSubscore === 'ambiance' && renderHoverPopup(cardData.ambiance, 0)}
                    {/* {hoveredSubscore === 'ambiance' ? cardData.ambiance : <AmbianceIcon className='score-block-icon' />} */}
                    {cardData.ambiance !== 0 ? <AmbianceIcon className='score-block-icon' style={shrinkIcons && !cafeModal ? {height: 'clamp(0.3rem, 1vw, 1.3rem)', fill: 'white'} : {height: 'clamp(0.3rem, 1.3vw, 1.7rem)', fill: 'white'}} /> : <></>}
                </div>
                <div className="subscore workability" onMouseEnter={() => setHoveredSubscore('workability')} onMouseLeave={() => setHoveredSubscore(null)} style={{ width: workabilityWidth, backgroundColor: cardData.color_code }}>
                    {hoveredSubscore === 'workability' && renderHoverPopup(cardData.workability, 1)}
                    {/* {hoveredSubscore === 'workability' ? cardData.workability : <WorkabilityIcon className='score-block-icon' id='score-block-icon-workability' />} */}
                    {cardData.workability !== 0 ? <WorkabilityIcon className='score-block-icon' id='score-block-icon-workability' style={shrinkIcons && !cafeModal ? {height: 'clamp(0.3rem, 1vw, 1.3rem)', fill: 'white'} : {height: 'clamp(0.3rem, 1.3vw, 1.5rem)', fill: 'white'}} /> : <></>}
                </div>
                <div className="subscore drinks" onMouseEnter={() => setHoveredSubscore('drinks')} onMouseLeave={() => setHoveredSubscore(null)} style={{ width: drinksWidth, backgroundColor: cardData.color_code }}>
                    {hoveredSubscore === 'drinks' && renderHoverPopup(cardData.drinks, 2)}
                    {/* {hoveredSubscore === 'drinks' ? cardData.drinks : <DrinksIcon className='score-block-icon' id='score-block-icon-drinks' />} */}
                    {cardData.drinks !== 0 ? <DrinksIcon className='score-block-icon' id='score-block-icon-drinks' style={shrinkIcons && !cafeModal ? {height: 'clamp(0.3rem, 1vw, 1.3rem)', fill: 'white'} : {height: 'clamp(0.3rem, 1.3vw, 1.7rem)', fill: 'white'}} /> : <></>}
                </div>
                <div className="subscore outlets" onMouseEnter={() => setHoveredSubscore('outlets')} onMouseLeave={() => setHoveredSubscore(null)} style={{ width: outletsWidth, backgroundColor: cardData.color_code }}>
                    {hoveredSubscore === 'outlets' && renderHoverPopup(cardData.outlets, 3)}
                    {/* {hoveredSubscore === 'outlets' ? (cardData.outlets > 0 ? cardData.outlets : "") : <OutletIcon className='score-block-icon' id='score-block-icon-outlets' style={{fill: 'white'}} />} */}
                    {cardData.outlets != 0 ? <OutletIcon className='score-block-icon' id={`score-block-icon-outlets${cafeModal ? '-cafe-modal' : ''}`} style={shrinkIcons && !cafeModal ? {height: 'clamp(0.3rem, 1vw, 1.3rem)', fill: 'white'} : {height: 'clamp(0.3rem, 1.2vw, 1.5rem)', fill: 'white'}} /> : <></>}
                </div></> : <></>}
            </div>
        </div>
    );
};
//     const overall = (cardData.score / 10) * 100;
//     const ambiance = ((cardData.ambiance - 1) / 2) * 100;
//     const workability = ((cardData.workability - 1) / 2) * 100;
//     const drinks = ((cardData.drinks - 1) / 2) * 100;
//     const outlets = (cardData.outlets / 1) * 100;

//     return (
//         <div className="progress-block">
//             <div id="score-bar-container" className="progress-bar-container">
//                 {/* <div><ScoreIcon id="score-score-icon" style={{ fill: cardData.color_code}}/></div> */}
//                 <div id="score-progress-bar" className="progress-bar" style={{ border: "2px solid " + cardData.color_code}}>
//                     <div className="progress-fill" style={{ width: `${overall}%`, backgroundColor: cardData.color_code }}>
//                     </div>
//                 </div>
//                 <div id="overall-score-text" className="progress-score-text" style={{color: cardData.color_code}}>
//                     {cardData.score}
//                 </div>
//             </div>
//             {/* <div className="progress-bar-container">
//                 <div><AmbianceIcon className="progress-bar-icon" style={{ fill: cardData.color_code}} /></div>
//                 <div className="progress-bar" style={{ border: "2px solid " + cardData.color_code}}>
//                     <div className="progress-fill" style={{ width: `${ambiance}%`, backgroundColor: cardData.color_code }}>
//                     </div>
//                 </div>
//                 <div className="progress-score-text" style={{color: cardData.color_code}}>
//                     {cardData.ambiance}
//                 </div>
//             </div>
//             <div className="progress-bar-container">
//                 <div><WorkabilityIcon className="progress-bar-icon" style={{ stroke: cardData.color_code}} /></div>
//                 <div className="progress-bar" style={{ border: "2px solid " + cardData.color_code}}>
//                     <div className="progress-fill" style={{ width: `${workability}%`, backgroundColor: cardData.color_code }}>
//                     </div>
//                 </div>
//                 <div className="progress-score-text" style={{color: cardData.color_code}}>
//                     {cardData.workability}
//                 </div>
//             </div>
//             <div className="progress-bar-container">
//                 <div><DrinksIcon className="progress-bar-icon" style={{ fill: cardData.color_code, stroke: cardData.color_code}} /></div>
//                 <div className="progress-bar" style={{ border: "2px solid " + cardData.color_code}}>
//                     <div className="progress-fill" style={{ width: `${drinks}%`, backgroundColor: cardData.color_code }}>
//                     </div>
//                 </div>
//                 <div className="progress-score-text" style={{color: cardData.color_code}}>
//                     {cardData.drinks}
//                 </div>
//             </div>
//             <div id="outlets-bar-container" className="progress-bar-container">
//                 <div><OutletIcon id="outlets-score-icon" className="progress-bar-icon" style={{ fill: cardData.color_code, stroke: cardData.color_code}} /></div>
//                 <div id="outlets-progress-bar" className="progress-bar" style={{ border: "2px solid " + cardData.color_code}}>
//                     <div className="progress-fill" style={{ width: `${outlets}%`, backgroundColor: cardData.color_code }}>
//                     </div>
//                 </div>
//                 <div className="progress-score-text" style={{color: cardData.color_code}}>
//                     {cardData.outlets}
//                 </div>
//             </div> */}
//         </div>
//     );
// };

export default ScoreBar;