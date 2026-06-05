import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Select from 'react-select';
import FiltersModal from './FiltersModal';
import Card from './Card';
import TimeInput from './TimeInput';
import CardMobile from './CardMobile';
import { motion } from 'framer-motion'; // 1. Import motion
import {ReactComponent as SortIcon} from './Logos/sort-sort.svg'
import {ReactComponent as SearchIcon} from './Logos/sort-search2.svg'
import {ReactComponent as ScoreIcon} from './Logos/sort-score.svg'
import {ReactComponent as AmbianceIcon} from './Logos/sort-ambiance.svg'
import {ReactComponent as WorkabilityIcon} from './Logos/sort-workability.svg'
import {ReactComponent as DrinksIcon} from './Logos/sort-drinks2.svg'
import {ReactComponent as FilterIcon} from './Logos/filter-filter.svg'
import {ReactComponent as OutletIcon} from './Logos/filter-outlet2.svg'
import {ReactComponent as StudyIcon} from './Logos/filter-study.svg'
import {ReactComponent as FoodIcon} from './Logos/filter-food.svg'
import {ReactComponent as GemIcon} from './Logos/filter-gem.svg'
import {ReactComponent as AestheticIcon} from './Logos/filter-aesthetic.svg'
import {ReactComponent as OutdoorIcon} from './Logos/filter-outdoor.svg'
import {ReactComponent as TimeIcon} from './Logos/filter-time2.svg'
import {ReactComponent as TimeUpIcon} from './Logos/filter-time-up.svg'
import {ReactComponent as ScrollUpIcon} from './Logos/scroll-top.svg'

export default function ListMobile({data, setData, selectCafe, addFilter, rightRef, setSort, setShowSortPanel, allFilters, setAllFilters, setFilterFunction, pickSortingOption, scrollToTop, setScrollToTop, hoveredCafe, setHoveredCafe, searchValue, setSearchValue, selectedCafe, setSelectedCafe, neighborhoodFunction, setNeighborhoodFunction, scoreBarHover, setScoreBarHover, mobileState, setMobileState, exitMobilePage, setExitMobilePage, mobileFilters, setMobileFilters, isSelectingNeighborhoodMobile, setIsSelectingNeighborhoodMobile, neighborhoodFilter, setNeighborhoodFilter, selectedNeighborhood, setSelectedNeighborhood, mobileTimeState, setMobileTimeState, timeData, setTimeData, isSelectingTimeMobile, setIsSelectingTimeMobile, trackTimeUpdate, setTrackTimeUpdate, selectedMobileDay, setSelectedMobileDay, selectedMobileTime, setSelectedMobileTime, isSearchingMobile, setIsSearchingMobile, isSearchFocused, setIsSearchFocused, isSearchSet, setIsSearchSet, handleFocus, handleBlur, handleSearchChange}) {
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

    // const [timeData, setTimeData] = useState({
    //     hour: new Date().getHours() > 12 ? new Date().getHours() - 12 : new Date().getHours(),
    //     minute: Math.floor(new Date().getMinutes() / 15) * 15,
    //     ampm: new Date().getHours() >= 12 ? 'PM' : 'AM',
    //     day: new Date().getDay(),
    //     number: convertTimeToNumber(new Date().getHours() >= 12 ? new Date().getHours() - 12 : new Date().getHours(), Math.floor(new Date().getMinutes() / 15) * 15, new Date().getHours() >= 12 ? 'PM' : 'AM')
    // });

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

        if (mobileTimeState) applyFilter = applyFilter && inHours(cafe, timeData.number, timeData.day);
        if (mobileFilters.has_outlets) applyFilter = applyFilter && hasOutlets(cafe);
        if (mobileFilters.study_work) applyFilter = applyFilter && studyWork(cafe);
        if (mobileFilters.outdoor_area) applyFilter = applyFilter && outdoorArea(cafe);
        if (mobileFilters.is_aesthetic) applyFilter = applyFilter && isAesthetic(cafe);
        if (mobileFilters.has_food) applyFilter = applyFilter && hasFood(cafe);
        if (mobileFilters.hidden_gem) applyFilter = applyFilter && hiddenGem(cafe);
        
        if (mobileFilters.open_late) applyFilter = applyFilter && openLate(cafe);
        if (mobileFilters.closes_early) applyFilter = applyFilter && closesEarly(cafe);
        if (mobileFilters.high_prices) applyFilter = applyFilter && highPrices(cafe);
        if (mobileFilters.wifi_issues) applyFilter = applyFilter && wifiIssues(cafe);

        return applyFilter;
    }

    const toggleTimeState = () => {
        setMobileTimeState((prevState) => !prevState);
    };

    const handleTimeChange = (newTimeData) => {
        setTimeData((prev) => ({
            ...prev,
            ...newTimeData,
        }));
    };    

    const toggleFilter = (filter) => {
        setMobileFilters((prevFilters) => ({
            ...prevFilters,
            [filter]: !prevFilters[filter],
        }));
        // console.log(mobileFilters);
    };

    useEffect(() => {
        if (!mobileTimeState && !mobileFilters.has_outlets && !mobileFilters.study_work && !mobileFilters.has_food && !mobileFilters.hidden_gem && !mobileFilters.is_aesthetic && !mobileFilters.outdoor_area && !mobileFilters.open_late && !mobileFilters.closes_early && !mobileFilters.high_prices && !mobileFilters.wifi_issues) {
            setFilterFunction(null);
            setFiltersApplied(false);
            setAllFilters([]);
        }
        else {
            setFilterFunction(() => finalFilter);
            setFiltersApplied(true);

            if (mobileTimeState) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Open At")) {
                        return [...filters, "Open At"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== "Open At"));
            }

            if (mobileFilters.has_outlets) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Outlets")) {
                        return [...filters, "Outlets"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== 'Outlets'));
            }

            if (mobileFilters.study_work) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Study / Work")) {
                        return [...filters, "Study / Work"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== 'Study / Work'));
            }

            if (mobileFilters.outdoor_area) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Outdoor Area")) {
                        return [...filters, "Outdoor Area"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== 'Outdoor Area'));
            }

            if (mobileFilters.is_aesthetic) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Aesthetic")) {
                        return [...filters, "Aesthetic"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== 'Aesthetic'));
            }

            if (mobileFilters.has_food) {
                setAllFilters((filters) => 
                    {if (!filters.includes("Food Menu")) {
                        return [...filters, "Food Menu"]
                    } return filters
                })
            }
            else {
                setAllFilters((filters) => filters.filter((item) => item !== 'Food Menu'));
            }

            if (mobileFilters.hidden_gem) {
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
    }, [mobileFilters, timeData, mobileTimeState]);

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

    // const [isSearchFocused, setIsSearchFocused] = useState(false);
    // const [isSearchSet, setIsSearchSet] = useState(false);

    // const handleFocus = () => {
    //     if (searchValue === 'Search By Name') setSearchValue('');
    //     setIsSearchFocused(true);
    // };

    // const handleBlur = () => {
    //     if (searchValue === '') setSearchValue('Search By Name');
    //     setIsSearchFocused(false);

    //     if (searchValue != 'Search By Name' && searchValue != '') setIsSearchSet(true);
    //     else setIsSearchSet(false);
    // };

    // const handleSearchChange = (event) => {
    //     setSearchValue(event.target.value);
    //     if (searchValue != 'Search By Name' && searchValue != '') {
    //         if (rightRef.current) {
    //             rightRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    //         }
    //     }
    // }

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
                    }, 250);
                    cardElement.removeEventListener('transitionend', handleTransitionEnd);
                  }
                  else if (mobileState === "list") {
                    setTimeout(() => {
                        rightRef.current.scrollTo({
                            behavior: 'smooth',
                            top: cardElement.offsetTop - (windowHeight * 0.3)
                        });
                    }, 250);
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

    const scrollContainerRef = useRef(null);
    
    const filterOptions = [
      { id: 'has_outlets', label: 'Outlets', Icon: OutletIcon, className: 'outlet' },
      { id: 'study_work', label: 'Study / Work', Icon: StudyIcon, className: 'study' },
      { id: 'outdoor_area', label: 'Outdoor Area', Icon: OutdoorIcon, className: 'outdoor' },
      { id: 'is_aesthetic', label: 'Aesthetic', Icon: AestheticIcon, className: 'aesthetic' },
      { id: 'has_food', label: 'Food Menu', Icon: FoodIcon, className: 'food' },
      { id: 'hidden_gem', label: 'Hidden Gem', Icon: GemIcon, className: 'gem' },
      // ... add your other 8 filters to this array in the exact same format
    ];
    
    const allPills = [
    { id: 'neighborhood', label: 'Neighborhood', isNeighborhood: true },
    { id: 'open_at', label: 'Open At', isOpenAt: true },
    { id: 'search', label: 'Search', isSearching: true },
    ...filterOptions
    ];
    
    const sortedFilters = allPills.sort((a, b) => {
      let aSelected = false;
      if (a.isNeighborhood) aSelected = !!selectedNeighborhood;
      else if (a.isOpenAt) aSelected = mobileTimeState; // Toggles based on if the time filter is applied
      else if (a.isSearching) aSelected = searchValue != "Search By Name" || searchValue != "";
      else aSelected = mobileFilters[a.id];

      // Check 'b' based on what type of pill it is
      let bSelected = false;
      if (b.isNeighborhood) bSelected = !!selectedNeighborhood;
      else if (b.isOpenAt) bSelected = mobileTimeState;
      else if (a.isSearching) aSelected = searchValue != "Search By Name" || searchValue != "";
      else bSelected = mobileFilters[b.id];
      
      if (aSelected && !bSelected) return -1; // Move selected to the left
      if (!aSelected && bSelected) return 1;  // Move selected to the left
      return 0;
    }); 
    
    const handleFilterClick = (filterId) => {
        toggleFilter(filterId);

        // Trigger the smooth scroll back to the leftmost position
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
            left: 0,
            behavior: 'smooth'
            });
        }
    };
    
    const neighborhoodOptions = [
        { value: 'USC/Exposition Park', label: 'USC/Exposition Park', color: '#FF6961' },
        { value: 'Silver Lake/Los Feliz/Frogtown', label: 'Silver Lake/Los Feliz', color: '#F3A054' },
        { value: 'Echo Park/Chinatown', label: 'Echo Park/Chinatown', color: '#F6C25C' },
        { value: 'Highland Park/Eagle Rock', label: 'Highland Park/Eagle Rock', color: '#AEC986' },
        { value: 'Culver City/Mid-City', label: 'Culver City/Mid-City', color: '#74B78C' },
        { value: 'Santa Monica/Sawtelle', label: 'Santa Monica/Sawtelle', color: '#5BC6CC' },
        { value: 'Venice/Mar Vista', label: 'Venice/Mar Vista', color: '#5FC5F9' },
        { value: 'Downtown/Arts District', label: 'Downtown/Arts District', color: '#3683C2' },
        { value: 'Koreatown/Larchmont', label: 'Koreatown/Larchmont', color: '#867BC0' },
        { value: 'Beverly Hills/Century City', label: 'Beverly Hills/Century City', color: '#F2ACD8' },
        { value: 'Hollywood/Fairfax/La Brea', label: 'Hollywood/Fairfax', color: '#F2729F' },
      ];
    
      const sortedNeighborhoodOptions = [...neighborhoodOptions].sort((a, b) => {
        // Check if 'a' or 'b' is the currently selected neighborhood
        const aSelected = selectedNeighborhood && selectedNeighborhood.value === a.value;
        const bSelected = selectedNeighborhood && selectedNeighborhood.value === b.value;
        
        if (aSelected && !bSelected) return -1; // Move selected to the left
        if (!aSelected && bSelected) return 1;  // Move selected to the left
        return 0; // Keep original order for the rest
      });
    
      const inNeighborhood = (cafe, neighborhood) => {
        return cafe.neighborhood === neighborhood;
      };
    
      const finalNeighborhoodFilter = (cafe) => {
        if (!selectedNeighborhood) return true; 
        let applyFilter = true;
        applyFilter = applyFilter && inNeighborhood(cafe, neighborhoodFilter.neighborhood);
        return applyFilter;
      };
    
      const handleNeighborhoodClick = (neighborhood) => {
        const isAlreadySelected = selectedNeighborhood && selectedNeighborhood.value === neighborhood.value;
        // Run your original logic
        setSelectedNeighborhood(isAlreadySelected ? null : neighborhood);
        setNeighborhoodFilter((prevFilters) => ({
            ...prevFilters,
            neighborhood: neighborhood.value
        }));
        // setScrollToTop(true);
        setSelectedCafe(null);
        
        var newData = [...data];
        newData.forEach(element => element.is_selected = false);
        setData(newData);
    
        // Close the neighborhood menu and return to the main filters
        // setIsSelectingNeighborhoodMobile(false);
    
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      };
    
      useEffect(() => {
        if (!selectedNeighborhood) {
            setNeighborhoodFunction(null); // No filter applied
        } else {
            setNeighborhoodFunction(() => finalNeighborhoodFilter);
        }
      }, [neighborhoodFilter, selectedNeighborhood]);

    //   useEffect(() => {
    //     if (e.target.value !== selectedMobileDay) setTrackTimeUpdate(true);
    //     if
    //   }, [selectedMobileDay, selectedMobileTime]);

    return (
      <div id="mobile-list" style={mobileState === 'list' ? {display: 'block'} : {display: 'none'}}>
        <div id="mobile-list-filters" ref={scrollContainerRef}>
                {!isSelectingNeighborhoodMobile && !isSelectingTimeMobile && !isSearchingMobile ? (
                  <>
                    {sortedFilters.map((filter) => {
                      // 1. Render the Neighborhood Pill
                      if (filter.isNeighborhood) {
                        return (
                          <motion.div layout key="neighborhood" className="mobile-list-filter" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                            <div 
                                id="filter-neighborhood" 
                                className={`mobile-filter-item bubble ${selectedNeighborhood ? 'selected' : ''}`}
                                onClick={() => setIsSelectingNeighborhoodMobile(true)}
                                style={selectedNeighborhood ? { borderColor: selectedNeighborhood.color, backgroundColor: '#FFFFFF', color: '#000000'} : {}}
                            >
                                <span className='filter-checkbox'>Neighborhood</span>
                            </div>
                          </motion.div>
                        );
                      }
        
                      if (filter.isOpenAt) {
                        return (
                          <motion.div layout key="open-at" className="mobile-list-filter" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                            <div 
                                id="filter-open-at" 
                                // Highlight the pill if a time filter is currently active
                                className={`mobile-filter-item bubble ${mobileTimeState ? 'selected' : ''}`} 
                                onClick={() => {
                                    setIsSelectingTimeMobile(true);
                                }}
                            >
                                <TimeIcon
                                  id='mobile-filter-time-icon' 
                                  className='mobile-filter-icon' 
                                />
                                <span className='filter-checkbox'>Open At</span>
                            </div>
                          </motion.div>
                        );
                      }

                      if (filter.isSearching) {
                        return (
                          <motion.div layout key="search" className="mobile-list-filter" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                            <div 
                                id="filter-search" 
                                // Highlight the pill if a time filter is currently active
                                className={`mobile-filter-item bubble ${(searchValue != 'Search By Name' && searchValue != '') ? 'selected' : ''}`} 
                                onClick={() => {
                                    setIsSearchingMobile(true);
                                }}
                            >
                                <SearchIcon
                                  id='mobile-filter-search-icon' 
                                  className='mobile-filter-icon' 
                                />
                                <span className='filter-checkbox'></span>
                            </div>
                          </motion.div>
                        );
                      }
        
                      // 2. Render the Standard Filter Pills
                      return (
                        <motion.div layout key={filter.id} className="mobile-list-filter" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                            <div 
                                id={`filter-${filter.id.replace('_', '-')}`} 
                                className={`mobile-filter-item bubble ${mobileFilters[filter.id] ? 'selected' : ''} ${filter.className}`} 
                                onClick={() => handleFilterClick(filter.id)}
                            >
                                <filter.Icon 
                                  id={`mobile-filter-${filter.className}-icon`} 
                                  className='mobile-filter-icon' 
                                />
                                <span className='filter-checkbox'>{filter.label}</span>
                            </div>
                        </motion.div>
                      );
                    })}
                  </>
              ) : isSelectingNeighborhoodMobile ? (
                <>
                  {/* A way to back out without selecting anything */}
                  <motion.div layout className="mobile-list-filter" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                    <div className="mobile-filter-item bubble" onClick={() => setIsSelectingNeighborhoodMobile(false)}>
                        <span className='filter-checkbox'>← Back</span>
                    </div>
                  </motion.div>
                  
                  {/* Map through all options */}
                  {sortedNeighborhoodOptions.map((option) => {
                    const isSelected = selectedNeighborhood && selectedNeighborhood.value === option.value;
                    return (
                      <motion.div layout key={option.value} className="mobile-list-filter" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                          <div 
                              className={`mobile-filter-item bubble ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleNeighborhoodClick(option)}
                              style={isSelected ? { borderColor: option.color, backgroundColor: option.color } : {borderColor: option.color}}
                          >
                              <span className='filter-checkbox'>{option.label}</span>
                          </div>
                      </motion.div>
                    );
                  })}
                </>
              ) : isSelectingTimeMobile ? (
                <>
                  {/* Back Button */}
                  <motion.div layout className="mobile-list-filter" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                    <div className="mobile-filter-item bubble" onClick={() => {
                      setIsSelectingTimeMobile(false)
                    }}>
                        <span className='filter-checkbox'>Back</span>
                    </div>
                  </motion.div>
        
                  {/* Native Day Selector */}
                  <motion.div layout className="mobile-list-filter" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                    <div className="mobile-filter-item bubble day">
                        {/* A completely invisible native select sitting on top of your pill design */}
                        {/* 1. The Invisible Native Trigger */}
                        <select 
                          value={selectedMobileDay} 
                          onChange={(e) => {
                            setSelectedMobileDay(e.target.value);
                            setTrackTimeUpdate(true);
                        }}
                          className="hidden-native-input"
                        >
                          <option value="0">Sunday</option>
                          <option value="1">Monday</option>
                          <option value="2">Tuesday</option>
                          <option value="3">Wednesday</option>
                          <option value="4">Thursday</option>
                          <option value="5">Friday</option>
                          <option value="6">Saturday</option>
                        </select>
                        <span className='filter-checkbox'>{dayNames[parseInt(selectedMobileDay)]} ▾</span>
                    </div>
                  </motion.div>
        
                  {/* Native Time Selector */}
                  <motion.div layout className="mobile-list-filter" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                    <div className="mobile-filter-item bubble time">
                        {/* 1. The Invisible Native Trigger */}
                        <input 
                        type="time" 
                        value={selectedMobileTime}
                        onChange={(e) => {
                            setSelectedMobileTime(e.target.value);
                            setTrackTimeUpdate(true);
                        }}
                          className="hidden-native-input"
                        />
        
                        {/* 2. The Visible Custom UI underneath */}
                        {/* (Assuming you have a helper function to format "16:13" to "4:13 PM") */}
                        <span className='filter-checkbox'>{(parseInt(selectedMobileTime.slice(0, 2)) == 0 ? "12" : (parseInt(selectedMobileTime.slice(0, 2)) > 12 ? parseInt(selectedMobileTime.slice(0, 2)) - 12 : parseInt(selectedMobileTime.slice(0, 2)))) + ":" + (parseInt(selectedMobileTime.slice(-2)) < 10 ? (selectedMobileTime.slice(-2)).padStart(2, "0") : parseInt(selectedMobileTime.slice(-2)))  + " " + ((parseInt(selectedMobileTime.slice(0, 2)) >= 12 ? "PM" : "AM"))} ▾</span>
                    </div>
                  </motion.div>

                {(() => {
                    // Determine if this button needs to behave like an "Apply" button
                    const showApply = !mobileTimeState || trackTimeUpdate;

                    return (
                        <motion.div layout className="mobile-list-filter" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                        <div 
                            className="mobile-filter-item bubble time-apply" 
                            style={showApply 
                            ? {backgroundColor: "#058205", borderColor: "#058205", color: "#FFFFFF"}
                            : {backgroundColor: "#FF0000", borderColor: "#FF0000", color: "#FFFFFF"}
                            }
                            onClick={() => {
                            if (showApply) {
                                setMobileTimeState(true);
                                setTrackTimeUpdate(false);
                                
                                handleTimeChange({ 
                                hour: parseInt(selectedMobileTime.slice(0, 2)), 
                                minute: parseInt(selectedMobileTime.slice(-2)), 
                                ampm: (parseInt(selectedMobileTime.slice(0, 2)) >= 12 ? "PM" : "AM"), 
                                day: parseInt(selectedMobileDay), 
                                number: parseInt(selectedMobileTime.replace(":", ""))
                                });
                            } else {
                                setMobileTimeState(false);
                                setTrackTimeUpdate(false);
                                
                                handleTimeChange(null);
                            }
                            }}
                        >
                            <span className='filter-checkbox'>{showApply ? "Apply" : "Clear"}</span>
                        </div>
                        </motion.div>
                    );
                })()}
                </>
              ) : (
                <div className="mobile-filter-search-overall">
                  {/* A way to back out without selecting anything */}
                  <motion.div layout className="mobile-list-filter searchback" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                    <div className="mobile-filter-item bubble" onClick={() => setIsSearchingMobile(false)}>
                        <span className='filter-checkbox'>← Back</span>
                    </div>
                  </motion.div>

                  <motion.div layout className="mobile-list-filter search">
                    <div className={`mobile-filter-item bubble search ${isSearchFocused ? 'focused' : (isSearchSet ? 'set' : '')}`}>
                        {/* <div className='filter-search-container'> */}
                            <div className={`mobile-filter-search${isSearchFocused ? '-focused' : (isSearchSet ? '-set' : '')}`}>
                                <SearchIcon
                                  id='mobile-filter-search-icon-searching' 
                                  className='mobile-filter-icon' 
                                />
                                <input type="text" className='mobile-filter-search-input' value={searchValue} onFocus={handleFocus} onBlur={handleBlur} onChange={handleSearchChange}></input>
                            </div>
                        {/* </div> */}
                    </div>
                  </motion.div>
                </div>
              )}
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
                mobileState={mobileState}
                setMobileState={setMobileState}
                exitMobilePage={exitMobilePage}
                setExitMobilePage={setExitMobilePage}
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