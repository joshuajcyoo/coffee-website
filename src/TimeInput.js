import './App.css';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {ReactComponent as PlusIcon} from './Logos/filter-plus.svg'
import {ReactComponent as MinusIcon} from './Logos/filter-minus.svg'

const TimeInput = ({ hour, minute, ampm, day, isActive, setIsActive, changeTime }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAmPmPressed, setIsAmPmPressed] = useState(false);

  const options = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tues' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ]

  const convertTimeToNumber = (hour, minute, ampm) => {
      let adjustedHour = hour;
      if (ampm === 'PM' && hour !== 12) {adjustedHour += 12;} 
      else if (ampm === 'AM' && hour === 12) {adjustedHour = 0;}

      const timeAsNumber = adjustedHour * 100 + minute;
      return timeAsNumber;
  };

  const addHour = () => {
      if (isActive) {
          const newHour = hour === 11 ? 0 : hour + 1;
          const newAmPm = hour === 11 ? (ampm === 'AM' ? 'PM' : 'AM') : ampm;
          const newTimeNumber = convertTimeToNumber(newHour, minute, newAmPm);
          changeTime({ hour: newHour, minute, ampm: newAmPm, day, number: newTimeNumber});
      }
  };
  const subtractHour = () => {
      if (isActive) {
          const newHour = hour === 0 ? 11 : hour - 1;
          const newAmPm = hour === 0 ? (ampm === 'AM' ? 'PM' : 'AM') : ampm;
          const newTimeNumber = convertTimeToNumber(newHour, minute, newAmPm);
          changeTime({ hour: newHour, minute, ampm: newAmPm, day, number: newTimeNumber});
      }
  };

  const addMinutes = () => {
      if (isActive) {
          const newMinute = minute === 45 ? 0 : minute + 15;
          const newHour = minute === 45 ? hour + 1 : hour;
          const newAmPm = minute === 45 && hour === 11 ? (ampm === 'AM' ? 'PM' : 'AM') : ampm;
          const newTimeNumber = convertTimeToNumber(newHour, newMinute, newAmPm);
          changeTime({ hour: newHour, minute: newMinute, ampm: newAmPm, day, number: newTimeNumber});
      }
  };
  const subtractMinutes = () => {
      if (isActive) {
          const newMinute = minute === 0 ? 45 : minute - 15;
          const newHour = minute === 0 ? (hour === 0 ? 11 : hour - 1) : hour;
          const newAmPm = minute === 0 && hour === 0 ? (ampm === 'AM' ? 'PM' : 'AM') : ampm;
          const newTimeNumber = convertTimeToNumber(newHour, newMinute, newAmPm);
          changeTime({ hour: newHour, minute: newMinute, ampm: newAmPm, day, number: newTimeNumber});
      }
  };

  const toggleAmPm = () => {
      if (isActive) {
          const newAmPm = ampm === 'AM' ? 'PM' : 'AM';
          const newTimeNumber = convertTimeToNumber(hour, minute, newAmPm);
          changeTime({ hour, minute, ampm: newAmPm, day, number: newTimeNumber});
      }
  };

  const handleDayChange = (event) => {
      if (isActive) {
          const newDay = parseInt(event.value);
          const newTimeNumber = convertTimeToNumber(hour, minute, ampm);
          changeTime({ hour, minute, ampm, day: newDay, number: newTimeNumber});
      }
  };

  const dayStyles = {
    control: (styles) => ({
      ...styles,
      boxShadow: 'none',
      border: isActive ? '2px solid #000000' : '2px solid transparent',
      borderRadius: '3px',
      fontSize: 'clamp(0.6rem, 1.0vw, 1.2rem)',
      cursor: 'pointer',
      ':hover': isMenuOpen ? {backgroundColor: '#000000', borderColor: '#000000'} : { backgroundColor: '#D2D2D2', borderColor: '#000000'},
      backgroundColor: isMenuOpen ? '#000000' : '#FFFFFF',
      transition: 'border 0.3s ease, background-color 0.3s ease',
      // width: 'clamp(3rem, 8vw, 10rem)',
      height: 'clamp(2rem, 2.8vw, 3rem)',
      minHeight: 0
    }),
    valueContainer: (styles) => ({
      ...styles,
      // padding: '8.5px 10px',
      // paddingTop: 'clamp(0.3rem, 0.6vw, 0.9rem)',
      // paddingBottom: 'clamp(0.3rem, 0.6vw, 0.9rem)',
      // height: '100%', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 'clamp(0.7rem, 1vw, 0.7rem)',
      paddingRight: 0,
      marginRight: 0,
      padding: 0,
    }),
    option: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: isFocused ? '#D2D2D2' : '#FFFFFF',
      color: '#000000',
      cursor: 'pointer'
    }),
    menu: (styles) => ({
      ...styles,
      marginTop: 0,  
      marginBottom: 0,   
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      border: '2px solid black'
    }),
    menuList: (styles) => ({
      ...styles,
      paddingTop: 0,  
      paddingBottom: 0,
      fontSize: 'clamp(0.6rem, 1.0vw, 1.2rem)',
      backgroundColor: 'black'
    }),
    singleValue: (styles) => ({
      ...styles,
      // height: '100%', 
      color: isMenuOpen ? '#FFFFFF' : '#000000',
    }),
    indicatorsContainer: (styles) => ({
      ...styles,
      height: '100%',
      svg: {
        width: 'clamp(0.7rem, 1.2vw, 1.2rem)', // Adjust width of the SVG icon
        height: 'clamp(0.7rem, 1.2vw, 1.2rem)', // Adjust height of the SVG icon
      }
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      color: isMenuOpen ? '#FFFFFF' : '#000000',
      marginLeft: '0',
      paddingRight: '0',
      transform: 'rotate(180deg)', 
      marginTop: 'clamp(0.2rem, 0.3vw, 0.2rem)',
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: 'none'
    }),
    input: (styles) => ({
      ...styles,
      color: isHovered ? '#FFFFFF' : '#000000'
    })
  }

  return (
    <div className={`time-input${isActive ? "-active" : "-inactive"}`}>
      <div id="time-clock" className="input-group">
        <div className="input-control left">
          <button className="stacked-button" onClick={addHour}><PlusIcon id="time-plus-icon"/></button>
          <button className="stacked-button" onClick={subtractHour}><MinusIcon id="time-minus-icon"/></button>
        </div>
        <input 
          type="text" 
          className="time-field"
          value={hour === 0 ? 12 : (hour.toString().padStart(2, '0'))}
          readOnly 
        />
        <span id="time-colon">:</span>
        <input 
          type="text" 
          className="time-field"
          value={minute.toString().padStart(2, '0')} 
          readOnly 
        />
        <div className="input-control right">
          <button className="stacked-button" onClick={addMinutes}><PlusIcon id="time-plus-icon"/></button>
          <button className="stacked-button" onClick={subtractMinutes}><MinusIcon id="time-minus-icon"/></button>
        </div>
      </div>

      <div id={`time-input-ampm${isActive ? "-active" : "-inactive"}`} className="input-group ampm-group" onClick={toggleAmPm} onMouseDown={() => setIsAmPmPressed(true)} onMouseUp={() => setIsAmPmPressed(false)} style={{transform: isAmPmPressed ? 'scale(0.9)' : 'scale(1)'}}>
        {ampm}
      </div>

      <div id="time-input-day" className="input-group day-group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Select
          defaultValue={options[day]}
          onChange={handleDayChange}
          options={options}
          menuPlacement='top'
          styles={dayStyles}
          isSearchable={false}
          onMenuOpen={() => setIsMenuOpen(true)}
          onMenuClose={() => setIsMenuOpen(false)}
        />
      </div>

    </div>
  );
};

export default TimeInput;