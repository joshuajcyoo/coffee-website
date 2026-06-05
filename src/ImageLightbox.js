// ImageLightbox.jsx
import React from 'react';
import { useState, useEffect } from "react";
import { createPortal } from 'react-dom'; // 1. Import this
import './Mobile.css'; // Import the CSS file

const ImageLightbox = ({ imageSrc, onClose }) => {
  if (!imageSrc) {
    return null; // Don't render if there's no image source
  }

  return createPortal(
    // 1. The Overlay: This darkens and captures clicks for closing
    <div className="lightbox-overlay" onClick={onClose}>

    <button className="lightbox-close-btn" onClick={onClose}>
        &times;
    </button>
      
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        
        <img src={imageSrc} alt="Enlarged view" className="lightbox-image" />
                
      </div>
    </div>,
    document.body
  );
};

export default ImageLightbox;