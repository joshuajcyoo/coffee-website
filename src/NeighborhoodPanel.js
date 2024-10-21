import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import Select from 'react-select';

export default function NeighborhoodPanel({setNeighborhoodFunction, setScrollToTop}) {
    const [filters, setFilters] = useState({
        neighborhood: "All Neighborhoods"
    });

    const inNeighborhood = (cafe, neighborhood) => {
        return cafe.neighborhood === neighborhood;
    };

    const finalFilter = (cafe) => {
        let applyFilter = true;

        if (filters.neighborhood != "All Neighborhoods") applyFilter = applyFilter && inNeighborhood(cafe, filters.neighborhood);

        return applyFilter;
    };

    const handleNeighborhood = (neighborhood) => {
        setSelectedNeighborhood(neighborhood);
        setFilters((prevFilters) => ({
            ...prevFilters,
            neighborhood: neighborhood.value
        }));
    };

    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const neighborhoodOptions = [
        { value: 'All Neighborhoods', label: 'All Neighborhoods', color: '#000000' },
        { value: 'USC/Exposition Park', label: 'USC/Exposition Park', color: '#FF6961' },
        { value: 'Silver Lake/Los Feliz/Frogtown', label: 'Silver Lake/Los Feliz/Frogtown', color: '#F3A054' },
        { value: 'Echo Park/Chinatown', label: 'Echo Park/Chinatown', color: '#F6C25C' },
        { value: 'Highland Park/Eagle Rock', label: 'Highland Park/Eagle Rock', color: '#AEC986' },
        { value: 'Culver City/Mid-City', label: 'Culver City/Mid-City', color: '#74B78C' },
        { value: 'Santa Monica/Sawtelle', label: 'Santa Monica/Sawtelle', color: '#5BC6CC' },
        { value: 'Venice/Mar Vista', label: 'Venice/Mar Vista', color: '#5FC5F9' },
        { value: 'Downtown/Arts District', label: 'Downtown/Arts District', color: '#3683C2' },
        { value: 'Koreatown/Larchmont', label: 'Koreatown/Larchmont', color: '#867BC0' },
        { value: 'Beverly Hills/Century City', label: 'Beverly Hills/Century City', color: '#F2ACD8' },
        { value: 'Hollywood/Fairfax/La Brea', label: 'Hollywood/Fairfax/La Brea', color: '#F2729F' },
    ];

    const [selectedNeighborhood, setSelectedNeighborhood] = useState(neighborhoodOptions[0]);

    const neighborhoodStyles = {
        control: (styles) => ({
            ...styles,
            border: '2px solid' + selectedNeighborhood.color,
            boxShadow: 'none',
            fontSize: 'clamp(0.8rem, 1.2vw, 1.5rem)',
            cursor: 'pointer',
            ':hover': { cursor: 'pointer', borderColor: selectedNeighborhood.color },
            backgroundColor: isHovered && !isMenuOpen ? selectedNeighborhood.color : 'transparent',
        }),
        option: (styles, { data, isFocused }) => ({
            ...styles,
            backgroundColor: isFocused ? '#FFFFFF' : data.color,
            color: isFocused ? data.color : '#FFFFFF',
            cursor: 'pointer',
        }),
        menu: (styles) => ({
            ...styles,
            marginTop: 0,
            marginBottom: 0,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }),
        menuList: (styles) => ({
            ...styles,
            paddingTop: 0,
            paddingBottom: 0,
            minHeight: '32.5vw',
            fontSize: 'clamp(0.8rem, 1.25vw, 1.4rem)',
            borderRadius: '3px'
        }),
        singleValue: (styles) => ({
            ...styles,
            padding: '3px 40px',
            color: isMenuOpen ? selectedNeighborhood.color : (isHovered ? '#FFFFFF' : selectedNeighborhood.color),
            transition: 'color 0.2s ease',
        }),
        dropdownIndicator: (styles) => ({
            ...styles,
            transform: 'rotate(180deg)', 
            transition: 'transform 0.2s ease',
            color: isMenuOpen ? selectedNeighborhood.color : (isHovered ? '#FFFFFF' : selectedNeighborhood.color),
            ':hover' : isMenuOpen ? {color: selectedNeighborhood.color} : {color: '#FFFFFF'}
        }),
        indicatorSeparator: (styles) => ({
            ...styles,
            backgroundColor: isMenuOpen ? selectedNeighborhood.color : (isHovered ? '#FFFFFF' : selectedNeighborhood.color),
        }),
        input: (styles) => ({
            ...styles,
            paddingLeft: '40px',
            color: isHovered ? selectedNeighborhood.color : '#FFFFFF'
        })
    };

    useEffect(() => {
        console.log(filters);
        if (filters.neighborhood === "All Neighborhoods") {
            setNeighborhoodFunction(null);
            setScrollToTop(true);
        }
        else {
            setNeighborhoodFunction(() => finalFilter);
            setScrollToTop(true);
        }
        setIsHovered(false);
    }, [filters, selectedNeighborhood]);
    
    return (
        <div id='filters-panel'>
            <div id="neighborhood-container" onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
                <Select
                    id="neighborhood-select"
                    options={neighborhoodOptions}
                    onChange={handleNeighborhood}
                    styles={neighborhoodStyles}
                    defaultValue={neighborhoodOptions[0]}
                    menuPlacement='top'
                    isSearchable={false}
                    onMenuOpen={() => setIsMenuOpen(true)} 
                    onMenuClose={() => setIsMenuOpen(false)}
                />
            </div>
        </div>
    );
}