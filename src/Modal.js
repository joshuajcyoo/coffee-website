import React from 'react';

const Modal = ({ show, handleClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
