import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './App.css';

const TimeInput = ({ hour, minute, ampm, day, isActive, setIsActive, changeTime }) => {
//   const currentDate = new Date();
//   let currentHour = currentDate.getHours();
//   currentHour = currentHour % 12 || 12;
//   const currentMinute = Math.floor(currentDate.getMinutes() / 15) * 15;
//   const isPM = currentHour >= 12;
//   const currentDay = currentDate.getDay();

//   const [hour, setHour] = useState(currentHour);
//   const [minute, setMinute] = useState(currentMinute);
//   const [ampm, setAmpm] = useState(isPM ? 'AM' : 'PM');
//   const [day, setDay] = useState(currentDay);

  const [isHovered, setIsHovered] = useState(false);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const options = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
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
          const newHour = hour === 12 ? 1 : hour + 1;
          const newTimeNumber = convertTimeToNumber(newHour, minute, ampm);
          changeTime({ hour: newHour, minute, ampm, day, number: newTimeNumber});
      }
  };
  const subtractHour = () => {
      if (isActive) {
          const newHour = hour === 0 ? 11 : hour - 1;
          const newTimeNumber = convertTimeToNumber(newHour, minute, ampm);
          changeTime({ hour: newHour, minute, ampm, day, number: newTimeNumber});
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
      fontSize: 'clamp(0.7rem, 1.0vw, 1.2rem)',
      cursor: 'pointer',
      ':hover': { backgroundColor: '#000000', borderColor: '#000000'},
      backgroundColor: isHovered ? '#000000' : '#FFFFFF',
      transition: 'border 0.3s ease, background-color 0.3s ease',
      width: '10vw',
      height: '0.8vw'
    }),
    valueContainer: (styles) => ({
      ...styles,
      padding: '8.5px 8px',
      height: '100%', // Ensures the value container takes the full height
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isFocused || isSelected ? '#000000' : '#FFFFFF',
      color: isFocused || isSelected ? '#FFFFFF' : '#000000',
      cursor: 'pointer'
    }),
    menu: (styles) => ({
      ...styles,
      marginTop: 0,  
      marginBottom: 0,   
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    }),
    menuList: (styles) => ({
      ...styles,
      paddingTop: 0,  
      paddingBottom: 0,
      fontSize: 'clamp(0.7rem, 1.0vw, 1.2rem)',
      backgroundColor: 'black'
    }),
    singleValue: (styles) => ({
      ...styles,
      height: '100%', 
      color: isHovered && isActive ? '#FFFFFF' : '#000000'
    }),
    indicatorsContainer: (styles) => ({
      ...styles,
      height: '100%'
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      color: isHovered && isActive ? '#FFFFFF' : '#000000',
      marginLeft: '0',
      paddingLeft: '0'
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: 'none' // Change the color of the separator line here
    }),
    input: (styles) => ({
      ...styles,
      color: isHovered ? '#FFFFFF' : '#000000'
    })
  }

  return (
    <div className={`time-input${isActive ? "-active" : "-inactive"}`}>
      <div id="time-clock" className="input-group">
        <div className="input-control">
          <button className="stacked-button" onClick={addHour}>+</button>
          <button className="stacked-button" onClick={subtractHour}>-</button>
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
        <div className="input-control">
          <button className="stacked-button" onClick={addMinutes}>+</button>
          <button className="stacked-button" onClick={subtractMinutes}>-</button>
        </div>
      </div>

      <div id={`time-input-ampm${isActive ? "-active" : "-inactive"}`} className="input-group ampm-group" onClick={toggleAmPm}>
        {ampm}
      </div>

      <div id="time-input-day" className="input-group day-group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Select
          defaultValue={options[day]}
          onChange={handleDayChange}
          options={options}
          styles={dayStyles}
          isDisabled={isActive ? false : true}
          isSearchable={false}
        />
      </div>
    </div>
  );
};

export default TimeInput;