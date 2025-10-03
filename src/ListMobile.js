import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Select from 'react-select';
import FiltersModal from './FiltersModal';
import Card from './Card';
import TimeInput from './TimeInput';
import CardMobile from './CardMobile';
import {ReactComponent as SortIcon} from './Logos/sort-sort.svg'
import {ReactComponent as SearchIcon} from './Logos/sort-search.svg'
import {ReactComponent as ScoreIcon} from './Logos/sort-score.svg'
import {ReactComponent as AmbianceIcon} from './Logos/sort-ambiance.svg'
import {ReactComponent as WorkabilityIcon} from './Logos/sort-workability.svg'
import {ReactComponent as DrinksIcon} from './Logos/sort-drinks2.svg'
import {ReactComponent as FilterIcon} from './Logos/filter-filter.svg'
import {ReactComponent as OutletIcon} from './Logos/filter-outlet.svg'
import {ReactComponent as StudyIcon} from './Logos/filter-study.svg'
import {ReactComponent as FoodIcon} from './Logos/filter-food.svg'
import {ReactComponent as GemIcon} from './Logos/filter-gem.svg'
import {ReactComponent as AestheticIcon} from './Logos/filter-aesthetic.svg'
import {ReactComponent as OutdoorIcon} from './Logos/filter-outdoor.svg'
import {ReactComponent as TimeIcon} from './Logos/filter-time.svg'
import {ReactComponent as TimeUpIcon} from './Logos/filter-time-up.svg'
import {ReactComponent as ScrollUpIcon} from './Logos/scroll-top.svg'

export default function ListMobile({data, setData, selectCafe, addFilter, rightRef, setSort, setShowSortPanel, allFilters, setAllFilters, setFilterFunction, pickSortingOption, scrollToTop, setScrollToTop, hoveredCafe, setHoveredCafe, searchValue, setSearchValue, selectedCafe, scoreBarHover, setScoreBarHover, mobileState, setMobileState}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const cardRefs = useRef({});

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
        if (time <= 400) {
            if (day != 0) {
                if (cafe.hours[day - 1].close <= 400) {
                    return cafe.hours[day - 1].open && cafe.hours[day - 1].open <= (time + 2400) && (cafe.hours[day - 1].close + 2400) > (time + 2400);
                }
                else {
                    return cafe.hours[day].open && cafe.hours[day].open <= time && cafe.hours[day].close > time;
                }
            }
            else {
                if (cafe.hours[day + 6].close <= 400) {
                    return cafe.hours[day + 6].open && cafe.hours[day + 6].open <= (time + 2400) && (cafe.hours[day + 6].close + 2400) > (time + 2400);
                }
                else {
                    return cafe.hours[day].open && cafe.hours[day].open <= time && cafe.hours[day].close > time;
                }
            }
        }
        else {
            if (cafe.hours[day].close <= 400) {
                return cafe.hours[day].open && cafe.hours[day].open <= time && (cafe.hours[day].close + 2400) > time;
            }
            else {
                return cafe.hours[day].open && cafe.hours[day].open <= time && cafe.hours[day].close > time;
            }
        } 
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
        if (filters.study_work) applyFilter = applyFilter && studyWork(cafe);
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
            setAllFilters([]);
        }
        else {
            setFilterFunction(() => finalFilter);
            setFiltersApplied(true);

            if (timeState) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Open At")) {
                        return [...filters, "Open At"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== "Open At"));
            }

            if (filters.has_outlets) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Outlets")) {
                        return [...filters, "Outlets"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== 'Outlets'));
            }

            if (filters.study_work) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Study / Work")) {
                        return [...filters, "Study / Work"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== 'Study / Work'));
            }

            if (filters.outdoor_area) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Outdoor Area")) {
                        return [...filters, "Outdoor Area"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== 'Outdoor Area'));
            }

            if (filters.is_aesthetic) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Aesthetic")) {
                        return [...filters, "Aesthetic"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== 'Aesthetic'));
            }

            if (filters.has_food) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Food Menu")) {
                        return [...filters, "Food Menu"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== 'Food Menu'));
            }

            if (filters.hidden_gem) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Hidden Gem")) {
                        return [...filters, "Hidden Gem"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== 'Hidden Gem'));
            }
        }
    }, [filters, timeData, timeState]);

    const sortOptions = ["overall", "ambiance", "workability", "drinks"];

    const sortIcons = [<ScoreIcon className='sort-icon' id='sort-icon-score'/>, <AmbianceIcon className='sort-icon' />, <WorkabilityIcon className='sort-icon' id='sort-icon-workability'/>, <DrinksIcon className='sort-icon' id='sort-icon-drinks'/>];
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
        setShowSortPanel(true);
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
        if (cafe1.score > cafe2.score) return -1;
        return 0;
    };
    const ambianceHighLow = (cafe1, cafe2) => {
        if (cafe1.ambiance < cafe2.ambiance) return 1;
        if (cafe1.ambiance > cafe2.ambiance) return -1;
        return 0;
    };
    const workabilityHighLow = (cafe1, cafe2) => {
        if (cafe1.workability < cafe2.workability) return 1;
        if (cafe1.workability > cafe2.workability) return -1;
        return 0;
    };
    const drinksHighLow = (cafe1, cafe2) => {
        if (cafe1.drinks < cafe2.drinks) return 1;
        if (cafe1.drinks > cafe2.drinks) return -1;
        return 0;
    };

    // useEffect(() => {
    //     if (isMenuOpen) setOverallLabel('Overall');
    //     else setOverallLabel('Sort By');
    // }, [isMenuOpen])

    useEffect(() => {
        handleSort(currentSort);
        setSort(currentSort);
        if (rightRef.current) {
            rightRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentSort]);

    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSearchSet, setIsSearchSet] = useState(false);

    const handleFocus = () => {
        if (searchValue === 'Search By Name') setSearchValue('');
        setIsSearchFocused(true);
    };

    const handleBlur = () => {
        if (searchValue === '') setSearchValue('Search By Name');
        setIsSearchFocused(false);

        if (searchValue != 'Search By Name' && searchValue != '') setIsSearchSet(true);
        else setIsSearchSet(false);
    };

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
        if (searchValue != 'Search By Name' && searchValue != '') {
            if (rightRef.current) {
                rightRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const selectedCard = data.find((element) => element.is_selected);
        selectedCard && console.log("selected: " + selectedCard.id);
        (selectedCard && cardRefs.current[selectedCard.id].current) && console.log("bleh" + cardRefs.current[selectedCard.id].current);
        // const containerHeight = rightRef.current.offsetHeight; // includes padding + border
        // console.log("Container height:", containerHeight);
        const windowHeight = window.innerHeight;
        console.log("Window height: " + windowHeight);
        if (scrollToTop) {
            if (rightRef.current) {
                rightRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setScrollToTop(false);
        }
        if (selectedCard && cardRefs.current[selectedCard.id]) {
            if (selectedCard.id === 0) {
                const cardElement = cardRefs.current[selectedCard.id].current;
                const handleTransitionEnd = () => {
                    setTimeout(() => {
                        if (rightRef.current) {
                            rightRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                        setScrollToTop(false);
                    }, 175);
                    cardElement.removeEventListener('transitionend', handleTransitionEnd);
                };
                
                cardElement.addEventListener('transitionend', handleTransitionEnd);
                setExpandedCard(selectedCard.id);
            }
            else {
                const cardElement = cardRefs.current[selectedCard.id].current;
                const handleTransitionEnd = () => {
                  if (mobileState === "map") {
                    setTimeout(() => {
                        rightRef.current.scrollTo({
                            behavior: 'smooth',
                            top: cardElement.offsetTop - (windowHeight * 0.3)
                        });
                    }, 550);
                    cardElement.removeEventListener('transitionend', handleTransitionEnd);
                  }
                  else if (mobileState === "list") {
                    setTimeout(() => {
                        rightRef.current.scrollTo({
                            behavior: 'smooth',
                            top: cardElement.offsetTop - (windowHeight * 0.3)
                        });
                    }, 550);
                    cardElement.removeEventListener('transitionend', handleTransitionEnd);
                  }
                };
              
                cardElement.addEventListener('transitionend', handleTransitionEnd);
                setExpandedCard(selectedCard.id);
            }
        }
        else {
            setExpandedCard(null);
        }        
    }, [data]);

    useEffect(() => {
      const selectedCard = data.find((element) => element.is_selected);
      const windowHeight = window.innerHeight;
      if (selectedCard && cardRefs.current[selectedCard.id]) {
            if (selectedCard.id === 0) {
                const cardElement = cardRefs.current[selectedCard.id].current;
                const handleTransitionEnd = () => {
                    setTimeout(() => {
                        if (rightRef.current) {
                            rightRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                        setScrollToTop(false);
                    }, 175);
                    cardElement.removeEventListener('transitionend', handleTransitionEnd);
                };
                
                cardElement.addEventListener('transitionend', handleTransitionEnd);
                setExpandedCard(selectedCard.id);
            }
            else {
              const cardElement = cardRefs.current[selectedCard.id].current;
              setTimeout(() => {
                rightRef.current.scrollTo({
                  behavior: 'smooth',
                  top: cardElement.offsetTop - (windowHeight * .25)
              });
              }, 175);
            }
        }
        else {
            setExpandedCard(null);
        }   
    }, [mobileState])

    const handleCardClick = (cardData) => {
        setExpandedCard((id) => (id === cardData.id ? null : cardData.id));
        selectCafe(cardData);
    };

    useEffect(() => {
        if (rightRef.current) {
            rightRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [allFilters, searchValue])

    const [scrollTop, setScrollTop] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            if (rightRef.current) {
                setScrollTop(rightRef.current.scrollTop);
            }
        };

        const refCurrent = rightRef.current;
        if (refCurrent) {
            refCurrent.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (refCurrent) {
                refCurrent.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
      <div id="mobile-list" style={mobileState === 'list' ? {display: 'block'} : {display: 'none'}}>
        <div id="mobile-list-filters">
          <div id="mobile-list-filter">Filter 1</div>
          <div id="mobile-list-filter">Filter 2</div>
          <div id="mobile-list-filter">Filter 3</div>
          <div id="mobile-list-filter">Filter 4</div>
          <div id="mobile-list-filter">Filter 5</div>
          <div id="mobile-list-filter">Filter 6</div>
          <div id="mobile-list-filter">Filter 7</div>
          <div id="mobile-list-filter">Filter 8</div>
          <div id="mobile-list-filter">Filter 9</div>
        </div>
        <div id="mobile-list-cards" ref={rightRef}>
          {/* {selectedCafe && selectedCafe.name} */}
          {data.filter(element => {
            if (element.visible) {
              return element;
            }
          })
          .map((element) => {
            cardRefs.current[element.id] = React.createRef();
            return (
              <CardMobile 
                key={element.id}
                ref={cardRefs.current[element.id]}
                cardData={element} 
                selectCafe={selectCafe} 
                isExpanded={element.id === expandedCard} 
                handleCardClick={handleCardClick}
                addFilter={addFilter}
                hoveredCafe={hoveredCafe}
                setHoveredCafe={setHoveredCafe}
                scoreBarHover={scoreBarHover}
                setScoreBarHover={setScoreBarHover}
                selectedCafe={selectedCafe}
              />
            )
          })
          }
        </div>

          {/* {!expandedCard && scrollTop >= 5 &&
              <div id='data-cards-scroll-button-container'>
                  <button id='data-cards-scroll' onClick={() => rightRef.current.scrollTo({ top: 0, behavior: 'smooth' })}>
                      <ScrollUpIcon id='data-cards-scroll-icon'/>
                  </button>
              </div>
          } */}
          
      </div>
    )
}