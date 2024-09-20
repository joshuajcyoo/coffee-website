import './App.css';
import Modal from './Modal';
import React, { useRef, useEffect, useState } from 'react';
import Select from 'react-select';

export default function FiltersPanel({data, addFilter}) {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const [filters, setFilters] = useState({
        neighborhood: "All Neighborhoods",
        has_outlets: false,
        open_late: false,
        closes_early: false,
        has_food: false,
        high_prices: false,
        wifi_issues: false
    });

    const inNeighborhood = (cafe, neighborhood) => {
        return cafe.neighborhood === neighborhood;
    };
    const hasOutlets = (cafe) => cafe.outlets > 0;
    const openLate = (cafe) => cafe.open_late;
    const closesEarly = (cafe) => cafe.closes_early;
    const hasFood = (cafe) => cafe.has_food;
    const highPrices = (cafe) => cafe.high_prices;
    const wifiIssues = (cafe) => cafe.wifi_issues;
    const outdoorArea = (cafe) => cafe.outdoor_area;

    const finalFilter = (cafe) => {
        let applyFilter = true;

        if (filters.neighborhood != "All Neighborhoods") applyFilter = applyFilter && inNeighborhood(cafe, filters.neighborhood);
        if (filters.has_outlets) applyFilter = applyFilter && hasOutlets(cafe);
        if (filters.open_late) applyFilter = applyFilter && openLate(cafe);
        if (filters.closes_early) applyFilter = applyFilter && closesEarly(cafe);
        if (filters.has_food) applyFilter = applyFilter && hasFood(cafe);
        if (filters.high_prices) applyFilter = applyFilter && highPrices(cafe);
        if (filters.wifi_issues) applyFilter = applyFilter && wifiIssues(cafe);
        if (filters.outdoor_area) applyFilter = applyFilter && outdoorArea(cafe);

        return applyFilter;
    }

    const handleCheckboxChange = (event) => {
        const {name, checked} = event.target;
        
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: checked
        }));
    };

    const toggleFilter = (filter) => {
        setFilters((prevFilters) => ({
          ...prevFilters,
          [filter]: !prevFilters[filter],
        }));
      };      
    
    const handleNeighborhood = (neighborhood) => {
        setSelectedNeighborhood(neighborhood);
        setFilters((prevFilters) => ({
            ...prevFilters,
            neighborhood: neighborhood.value
        }));
    };

    const neighborhoodOptions = [
        { value: 'All Neighborhoods', label: 'All Neighborhoods', color: '#5F5F5F' },
        { value: 'USC/South Central', label: 'USC/South Central', color: '#FF6961' },
        { value: 'Koreatown/Mid-City', label: 'Koreatown/Mid-City', color: '#867BC0' },
        { value: 'Echo Park/Silver Lake/Chinatown', label: 'Echo Park/Silver Lake/Chinatown', color: '#F6C25C' },
        { value: 'Arts District/Little Tokyo', label: 'Arts District/Little Tokyo', color: '#5FC5F9' },
        { value: 'Culver City/Mar Vista', label: 'Culver City/Mar Vista', color: '#74B78C' },
        { value: 'Downtown', label: 'Downtown', color: '#3683C2' },
        { value: 'WeHo/Melrose/Beverly Hills', label: 'WeHo/Melrose/Beverly Hills', color: '#F2729F' },
    ];

    const [selectedNeighborhood, setSelectedNeighborhood] = useState(neighborhoodOptions[0]);

    const customStyles = {
        control: (styles) => ({
            ...styles,
            boxShadow: 'none',
            border: 'none',
            fontSize: 'clamp(0.8rem, 1.2vw, 1.5rem)',    // Smaller font size
            cursor: 'pointer',      // Set the cursor to pointer
            ':hover': { cursor: 'pointer', backgroundColor: '#C9C9C9' },
            backgroundColor: selectedNeighborhood ? selectedNeighborhood.color : '#555555'
        }),
        option: (styles, { data, isFocused }) => ({
            ...styles,
            backgroundColor: isFocused ? '#FFFFFF' : data.color,
            color: isFocused ? data.color : '#FFFFFF',
            cursor: 'pointer',
        }),
        menu: (styles) => ({
            ...styles,
            marginTop: 0,  // Remove top margin
            marginBottom: 0,  // Remove bottom margin
            borderRadius: '20px',   // Optional: Rounded corners for the menu
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Optional shadow for better visibility
        }),
        menuList: (styles) => ({
            ...styles,
            paddingTop: 0,  // Remove padding at the top
            paddingBottom: 0,  // Remove padding at the bottom
            fontSize: 'clamp(0.8rem, 1.2vw, 1.5rem)'
        }),
        singleValue: (styles, { data }) => ({
            ...styles,
            color: '#FFFFFF',
            padding: '3px 40px',
        }),
        dropdownIndicator: (styles) => ({
            ...styles,
            transform: 'rotate(180deg)', // Rotate the dropdown indicator
            transition: 'transform 0.2s ease', // Smooth transition for rotation
            color: '#FFFFFF'
        }),
        input: (styles) => ({
            ...styles,
            paddingLeft: '40px',
        })
    };

    useEffect(() => {
        addFilter(finalFilter);
    }, [filters, selectedNeighborhood]);
    
    return (
        <div id='filters-panel'>
            <div id="neighborhood-container">
                {/* <select className="neighborhood-dropdown" onChange={handleNeighborhood}>
                    <option value="All Neighborhoods">All Neighborhoods</option>
                    <option value="USC/South Central">USC/South Central</option>
                    <option value="Koreatown/Mid-City">Koreatown/Mid-City</option>
                    <option value="Echo Park/Silver Lake/Chinatown">Echo Park/Silver Lake/Chinatown</option>
                    <option value="Arts District/Little Tokyo">Arts District/Little Tokyo</option>
                    <option value="Culver City/Mar Vista">Culver City/Mar Vista</option>
                    <option value="Downtown">Downtown</option>
                    <option value="WeHo/Melrose/Beverly Hills">WeHo/Melrose/Beverly Hills</option>
                </select> */}

            <Select
                id="neighborhood-select"
                options={neighborhoodOptions}
                onChange={handleNeighborhood}
                styles={customStyles}
                defaultValue={neighborhoodOptions[0]}
                menuPlacement='top'
            />
            </div>
            
            <div id="more-filters-container">
                <button id="more-filters-button" onClick={toggleModal}>
                    More Filters +
                </button>

                <Modal show={showModal} handleClose={toggleModal}>
                    <div id="more-filters-title"><h2>More Filters</h2></div>
                    <div className="filter-row">
                        <div id="filter-has-outlets" className={`filter-item bubble ${filters.has_outlets ? 'selected' : ''}`} onClick={() => toggleFilter('has_outlets')}>
                            <span><img className="filter-icon" src="https://cdn-icons-png.flaticon.com/128/3159/3159502.png"></img></span>
                            <span className='filter-checkbox'>Outlets</span>
                            <span className="info-icon">
                                i
                                <span className="info-tooltip">Coffee shops with some accessible outlets for charging.</span>
                            </span>
                        </div>
                        <div id="filter-has-food" className={`filter-item bubble ${filters.has_food ? 'selected' : ''}`} onClick={() => toggleFilter('has_food')}>
                            <span><img className="filter-icon" src="https://cdn-icons-png.flaticon.com/128/1689/1689974.png"></img></span>
                            <span className='filter-checkbox'>Food Menu</span>
                            <span className="info-icon">
                                i
                                <span className="info-tooltip">Coffee shops that offer sufficient food menus (more than traditional pastries).</span>
                            </span>
                        </div>
                    </div>
                    <div id="filter-open-late" className='filter-item'>
                        <label>
                            <input type="checkbox" name="open_late" checked={filters.open_late} onChange={handleCheckboxChange}/>
                            <span className='filter-checkbox'>Open Late</span>
                        </label>
                        <span className="info-icon">
                            i
                            <span className="info-tooltip">Coffee shops that stay open until 6PM or later.</span>
                        </span>
                    </div>
                    <div id="filter-closes-early" className='filter-item'>
                        <label>
                            <input type="checkbox" name="closes_early" checked={filters.closes_early} onChange={handleCheckboxChange}/>
                            <span className='filter-checkbox'>Doesn't Close Early</span>
                        </label>
                        <span className="info-icon">
                            i
                            <span className="info-tooltip">Coffee shops that stay open until at least 3PM.</span>
                        </span>
                    </div>
                    <div id="filter-high-prices" className='filter-item'>
                        <label>
                            <input type="checkbox" name="high_prices" checked={filters.high_prices} onChange={handleCheckboxChange}/>
                            <span className='filter-checkbox'>Avoids High Prices</span>
                        </label>
                        <span className="info-icon">
                            i
                            <span className="info-tooltip">Coffee shops that avoid high prices (for LA standards.)</span>
                        </span>
                    </div>
                    <div id="filter-wifi-issues" className='filter-item'>
                        <label>
                            <input type="checkbox" name="wifi_issues" checked={filters.wifi_issues} onChange={handleCheckboxChange}/>
                            <span className='filter-checkbox'>Avoids Wi-Fi Issues</span>
                        </label>
                        <span className="info-icon">
                            i
                            <span className="info-tooltip">Coffee shops that have no history of wi-fi issues.</span>
                        </span>
                    </div>
                    <div id="filter-outdoor-area" className='filter-item'>
                        <label>
                            <input type="checkbox" name="wifi_issues" checked={filters.outdoor_area} onChange={handleCheckboxChange}/>
                            <span className='filter-checkbox'>Outdoor Area</span>
                        </label>
                        <span className="info-icon">
                            i
                            <span className="info-tooltip">Coffee shops that feature a significant amount of curated outdoor space.</span>
                        </span>
                    </div>
                </Modal>
            </div>
        
        </div>
    );
}