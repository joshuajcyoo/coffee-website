import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import FiltersModal from './FiltersModal';
import Card from './Card';
import TimeInput from './TimeInput';
import {ReactComponent as SortIcon} from './Logos/sort-sort.svg'
import {ReactComponent as ScoreIcon} from './Logos/sort-score.svg'
import {ReactComponent as AmbianceIcon} from './Logos/sort-ambiance.svg'
import {ReactComponent as WorkabilityIcon} from './Logos/sort-workability.svg'
import {ReactComponent as DrinksIcon} from './Logos/sort-drinks.svg'
import {ReactComponent as FilterIcon} from './Logos/filter-filter.svg'
import {ReactComponent as OutletIcon} from './Logos/filter-outlet.svg'
import {ReactComponent as StudyIcon} from './Logos/filter-study.svg'
import {ReactComponent as FoodIcon} from './Logos/filter-food.svg'
import {ReactComponent as GemIcon} from './Logos/filter-gem.svg'
import {ReactComponent as AestheticIcon} from './Logos/filter-aesthetic.svg'
import {ReactComponent as OutdoorIcon} from './Logos/filter-outdoor.svg'
import {ReactComponent as TimeIcon} from './Logos/filter-time.svg'
import {ReactComponent as TimeUpIcon} from './Logos/filter-time-up.svg'

export default function ResultsPanel({data, selectCafe, addFilter, setFilterFunction, pickSortingOption, rightRef, scrollToTop, setScrollToTop, hoveredCafe, setHoveredCafe}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [calculatedHeight, setCalculatedHeight] = useState(82)

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setCalculatedHeight(84 * (windowWidth / 1440));
    }, [windowWidth])
    
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const toggleFiltersModal = () => {
        setShowFiltersModal(!showFiltersModal);
    };

    const convertTimeToNumber = (hour, minute, ampm) => {
        let adjustedHour = hour;
        if (ampm === 'PM' && hour !== 12) {adjustedHour += 12;} 
        else if (ampm === 'AM' && hour === 12) {adjustedHour = 0;}

        const timeAsNumber = adjustedHour * 100 + minute;
        return timeAsNumber;
    };

    const [timeState, setTimeState] = useState(false);
    const [timeData, setTimeData] = useState({
        hour: new Date().getHours() > 12 ? new Date().getHours() - 12 : new Date().getHours(),
        minute: Math.floor(new Date().getMinutes() / 15) * 15,
        ampm: new Date().getHours() >= 12 ? 'PM' : 'AM',
        day: new Date().getDay(),
        number: convertTimeToNumber(new Date().getHours() >= 12 ? new Date().getHours() - 12 : new Date().getHours(), Math.floor(new Date().getMinutes() / 15) * 15, new Date().getHours() >= 12 ? 'PM' : 'AM')
    });

    const [filters, setFilters] = useState({
        has_outlets: false,
        study_work: false,
        has_food: false,
        hidden_gem: false,
        is_aesthetic: false,
        outdoor_area: false,
        high_prices: false,
        wifi_issues: false,
    });

    const [filtersApplied, setFiltersApplied] = useState(false);

    const inHours = (cafe, time, day) => {
        return cafe.hours[day].open && cafe.hours[day].open <= time && cafe.hours[day].close > time;
    }
    const hasOutlets = (cafe) => cafe.outlets > 0;
    const studyWork = (cafe) => cafe.study_work;
    const hasFood = (cafe) => cafe.has_food;
    const hiddenGem = (cafe) => cafe.hidden_gem;
    const isAesthetic = (cafe) => cafe.is_aesthetic;
    const outdoorArea = (cafe) => cafe.outdoor_area;
    const openLate = (cafe) => cafe.open_late;
    const closesEarly = (cafe) => cafe.closes_early;
    const highPrices = (cafe) => cafe.high_prices;
    const wifiIssues = (cafe) => cafe.wifi_issues;

    const finalFilter = (cafe) => {
        let applyFilter = true;

        if (timeState) applyFilter = applyFilter && inHours(cafe, timeData.number, timeData.day);
        if (filters.has_outlets) applyFilter = applyFilter && hasOutlets(cafe);
        if (filters.study_work)applyFilter = applyFilter && studyWork(cafe);
        if (filters.outdoor_area) applyFilter = applyFilter && outdoorArea(cafe);
        if (filters.is_aesthetic) applyFilter = applyFilter && isAesthetic(cafe);
        if (filters.has_food) applyFilter = applyFilter && hasFood(cafe);
        if (filters.hidden_gem) applyFilter = applyFilter && hiddenGem(cafe);
        
        if (filters.open_late) applyFilter = applyFilter && openLate(cafe);
        if (filters.closes_early) applyFilter = applyFilter && closesEarly(cafe);
        if (filters.high_prices) applyFilter = applyFilter && highPrices(cafe);
        if (filters.wifi_issues) applyFilter = applyFilter && wifiIssues(cafe);

        return applyFilter;
    }

    const toggleTimeState = () => {
        setTimeState((prevState) => !prevState);
    };

    const handleTimeChange = (newTimeData) => {
        if (timeState) {
            setTimeData((prev) => ({
                ...prev,
                ...newTimeData,
            }));
        }
    };    

    const toggleFilter = (filter) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filter]: !prevFilters[filter],
        }));
    };

    useEffect(() => {
        if (!timeState && !filters.has_outlets && !filters.study_work && !filters.has_food && !filters.hidden_gem && !filters.is_aesthetic && !filters.outdoor_area && !filters.open_late && !filters.closes_early && !filters.high_prices && !filters.wifi_issues) {
            setFilterFunction(null);
            setFiltersApplied(false);
        }
        else {
            setFilterFunction(() => finalFilter);
            setFiltersApplied(true);
        }
    }, [filters, timeData, timeState]);

    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const sortOptions = ["overall", "ambiance", "workability", "drinks"];
    const sortIcons = [<ScoreIcon className='sort-icon' id='sort-icon-score'/>, <AmbianceIcon className='sort-icon' />, <WorkabilityIcon className='sort-icon'/>, <DrinksIcon className='sort-icon'/>];
    const [currentSort, setCurrentSort] = useState(0);
    const sortDescriptions = [
        <span className="sort-info-icon">
            i
            <span className="sort-info-tooltip">Sort by the total score.</span>
        </span>,
        <span className="sort-info-icon">
            i
            <span className="sort-info-tooltip">Sort by the quality of aesthetics.</span>
        </span>,
        <span className="sort-info-icon">
            i
            <span className="sort-info-tooltip">Sort by the quality of workspace.</span>
        </span>,
        <span className="sort-info-icon">
            i
            <span className="sort-info-tooltip">Sort by the drink quality.</span>
        </span>
    ]

    const handleSortClick = () => {
        setCurrentSort((prevSort) => (prevSort + 1) % sortOptions.length);
    };

    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleSort = (sortOption) => {
        if (sortOption === 0) pickSortingOption((cafe1, cafe2) => scoreHighLow(cafe1, cafe2));
        if (sortOption === 1) pickSortingOption((cafe1, cafe2) => ambianceHighLow(cafe1, cafe2));
        if (sortOption === 2) pickSortingOption((cafe1, cafe2) => workabilityHighLow(cafe1, cafe2));
        if (sortOption === 3) pickSortingOption((cafe1, cafe2) => drinksHighLow(cafe1, cafe2));
    }

    const scoreHighLow = (cafe1, cafe2) => {
        if (cafe1.score < cafe2.score) return 1;
        if (cafe1.score > cafe1.score) return -1;
        return 0;
    };
    const ambianceHighLow = (cafe1, cafe2) => {
        if (cafe1.ambiance < cafe2.ambiance) return 1;
        if (cafe1.ambiance > cafe1.ambiance) return -1;
        return 0;
    };
    const workabilityHighLow = (cafe1, cafe2) => {
        if (cafe1.workability < cafe2.workability) return 1;
        if (cafe1.workability > cafe1.workability) return -1;
        return 0;
    };
    const drinksHighLow = (cafe1, cafe2) => {
        if (cafe1.drinks < cafe2.drinks) return 1;
        if (cafe1.drinks > cafe1.drinks) return -1;
        return 0;
    };

    useEffect(() => {
        handleSort(currentSort);
    }, [currentSort]);

    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const selectedCard = data.find((element) => element.is_selected);
        if (scrollToTop) {
            if (rightRef.current) {
                rightRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setScrollToTop(false);
        }
        if (selectedCard) {
            setExpandedCard(selectedCard.id);
            const allCards = data.filter((element) => element.visible);
            for (let i = 0; i < allCards.length; i++) {
                if (allCards[i].is_selected) {
                    if (rightRef.current) {
                        rightRef.current.scrollTo({ top: (i * calculatedHeight), behavior: 'smooth' });
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
                <div id="sorting-buttons">
                    <button id={`filters-button${filtersApplied ? "-applied" : ""}`} onClick={toggleFiltersModal}>
                        <div className='sort-filters-button-container' id="filters-button-container">
                            <FilterIcon id="filter-filter-icon" className='sort-icon' />
                            <span id="filters-button-title">Filters</span>
                        </div>
                    </button>
                    <button id="sort-button" onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)} onMouseDown={() => setIsPressed(true)} onMouseUp={() => setIsPressed(false)} onClick={handleSortClick}>
                        <div className='sort-filters-button-container' style={{transform: isPressed ? 'scale(0.9)' : 'scale(1)'}}>
                            {isHovered ? sortIcons[currentSort] : <SortIcon className='sort-icon' id='sort-standard-icon'/>}
                            <span id="sort-button-title">{isHovered ? capitalize(sortOptions[currentSort]) : "Sort By"}</span>
                            {isHovered ? sortDescriptions[currentSort] : <span id="sort-info-icon-hidden">i</span>}
                        </div>
                    </button>
                </div>
            
                <FiltersModal show={showFiltersModal} handleClose={toggleFiltersModal}>
                    <div id="filters-title"><h2>All Filters</h2></div>
                    <div className="filter-row">
                        <div id="filter-has-outlets" className={`filter-item bubble ${filters.has_outlets ? 'selected' : ''} outlet`} onClick={() => toggleFilter('has_outlets')}>
                            <OutletIcon id='filter-outlet-icon' className='filter-icon' />
                            <span className='filter-checkbox'>Outlets</span>
                            <span className="info-icon">
                                i
                                <span className="info-tooltip">Coffee shops with outlets for charging.</span>
                            </span>
                        </div>
                        <div id="filter-study-work" className={`filter-item bubble ${filters.study_work ? 'selected' : ''} study`} onClick={() => toggleFilter('study_work')}>
                            <StudyIcon id='filter-study-icon' className='filter-icon' />
                            <span className='filter-checkbox'>Study / Work</span>
                            <span className="info-icon">
                                i
                                <span className="info-tooltip">Coffee shops great for focused productivity.</span>
                            </span>
                        </div>
                    </div>
                    <div className="filter-row">
                        <div id="filter-outdoor-area" className={`filter-item bubble ${filters.outdoor_area ? 'selected' : ''} outdoor`} onClick={() => toggleFilter('outdoor_area')}>
                            <OutdoorIcon id='filter-outdoor-icon' className='filter-icon' />
                            <span className='filter-checkbox'>Outdoor Area</span>
                            <span className="info-icon">
                                i
                                <span className="info-tooltip">Coffee shops with a significant amount of curated outdoor space.</span>
                            </span>
                        </div>
                        <div id="filter-is-aesthetic" className={`filter-item bubble ${filters.is_aesthetic ? 'selected' : ''} aesthetic`} onClick={() => toggleFilter('is_aesthetic')}>
                            <AestheticIcon id='filter-aesthetic-icon' className='filter-icon' />
                            <span className='filter-checkbox'>Aesthetic</span>
                            <span className="info-icon">
                                i
                                <span className="info-tooltip">Coffee shops that are visually and aesthetically pleasing.</span>
                            </span>
                        </div>
                    </div>
                    <div className="filter-row">
                        <div id="filter-has-food" className={`filter-item bubble ${filters.has_food ? 'selected' : ''} food`} onClick={() => toggleFilter('has_food')}>
                            <FoodIcon id='filter-food-icon' className='filter-icon' />
                            <span className='filter-checkbox'>Food Menu</span>
                            <span className="info-icon">
                                i
                                <span className="info-tooltip">Coffee shops that offer sufficient food menus (more than traditional pastries).</span>
                            </span>
                        </div>
                        <div id="filter-hidden_gem" className={`filter-item bubble ${filters.hidden_gem ? 'selected' : ''}`} onClick={() => toggleFilter('hidden_gem')}>
                            <GemIcon id='filter-gem-icon' className='filter-icon' />
                            <span className='filter-checkbox'>Hidden Gem</span>
                            <span className="info-icon">
                                i
                                <span className="info-tooltip">Coffee shops that aren't well-known and less likely to be busy.</span>
                            </span>
                        </div>
                    </div>
                    <div id={`filter-row-time${timeState ? '-active' : ''}`} className="filter-row">
                        <div className={`filter-item bubble ${timeState ? 'selected' : ''} time`} onClick={toggleTimeState}>
                            <TimeIcon id='filter-time-icon' className='filter-icon' />
                            <span className='filter-checkbox'>Open At</span>
                            <span className="info-icon">
                                i
                                <span className="info-tooltip">Coffee shops that are open at this time.</span>
                            </span>
                        </div>
                        <div id="time-input-container">
                            <TimeInput 
                                hour={timeData.hour >= 12 ? timeData.hour - 12: timeData.hour}
                                minute={timeData.minute}
                                ampm={timeData.ampm}
                                day={timeData.day}
                                changeTime={handleTimeChange} 
                                isActive={timeState} 
                                setIsActive={toggleTimeState}
                            />
                        </div>
                        {timeState ? 
                        <div onClick={toggleTimeState} id="time-input-up">
                            <TimeUpIcon id="time-input-up-icon"/>
                        </div> 
                        : <></>}
                    </div>
                </FiltersModal>
            </div>

            <div id="data-cards" style={{ height: parseInt(((data.filter((element) => element.visible).length) * 79.5 + 475) + "px")}}>
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
                            hoveredCafe={hoveredCafe}
                            setHoveredCafe={setHoveredCafe}
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