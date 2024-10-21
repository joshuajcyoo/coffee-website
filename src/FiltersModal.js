import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

const FiltersModal = ({ show, handleClose, children }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}><img className="close-icon" src="https://cdn-icons-png.flaticon.com/128/800/800878.png"></img></button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default FiltersModal;
