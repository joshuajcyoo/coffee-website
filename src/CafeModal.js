import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

const CafeModal = ({ show, handleClose, children }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="cafe-modal-backdrop" onClick={handleClose}>
      <div className="cafe-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}><img className="close-icon" src="https://cdn-icons-png.flaticon.com/128/800/800878.png"></img></button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default CafeModal;
