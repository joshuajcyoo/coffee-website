import React from 'react';
import './App.css';

const Modal = ({ show, handleClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}><img className="close-icon" src="https://cdn-icons-png.flaticon.com/128/800/800878.png"></img></button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
