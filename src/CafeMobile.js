import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from "react";
import './Mobile.css';
import {ReactComponent as BackArrow} from './Logos/back-arrow.svg'

const CafeMobile = ({ mobileState, setMobileState, exitMobilePage, setExitMobilePage, selectedCafe }) => {

  const mobilePageBack = () => {
    setMobileState(exitMobilePage)
    setExitMobilePage('');
  };
  const backText = exitMobilePage.charAt(0).toUpperCase() + exitMobilePage.slice(1);

  const [lightboxImg, setLightboxImg] = useState(null);

  const openLightbox = (src) => setLightboxImg(src);
  const closeLightbox = () => setLightboxImg(null);
  
  return (
    <div className={`mobile-cafe ${mobileState === "page" ? "show" : ""}`}>
        <div className="mobile-cafe-back" onClick={mobilePageBack}>
          <BackArrow className='mobile-cafe-back-arrow'/>
          <div className="mobile-cafe-back-text">Back to {backText} View</div>
        </div>

        <div className="mobile-cafe-names">
          <div className="mobile-cafe-name">{selectedCafe && selectedCafe.name}</div>
          <div className="mobile-cafe-subname">{selectedCafe && selectedCafe.subname}</div>
          <div className="mobile-cafe-neighborhood">
            <span className="mobile-cafe-neighborhood-style" style={selectedCafe && {color: selectedCafe.color_code, border: "2px solid " + selectedCafe.color_code}}>
              {selectedCafe && selectedCafe.neighborhood}
            </span>
          </div>
        </div>

        <div className="photo-gallery">
          <div className="photo-gallery-inner">
            <img src={selectedCafe && selectedCafe.image} alt="photo 1" onClick={() => openLightbox((selectedCafe && selectedCafe.image))} style={{border: '3px solid ' + (selectedCafe && selectedCafe.color_code)}}/>
            <img src={selectedCafe && selectedCafe.c_image2} alt="photo 2" onClick={() => openLightbox((selectedCafe && selectedCafe.c_image2))} style={{border: '3px solid ' + (selectedCafe && selectedCafe.color_code)}}/>
            <img src={selectedCafe && selectedCafe.c_image3} alt="photo 3" onClick={() => openLightbox((selectedCafe && selectedCafe.c_image3))} style={{border: '3px solid ' + (selectedCafe && selectedCafe.color_code)}}/>
          </div>
        </div>

        {lightboxImg && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={closeLightbox}>
              ✕
            </button>
            <img src={lightboxImg} alt="full view" />
          </div>
        </div>
        )}
    </div>
  );
};

export default CafeMobile;