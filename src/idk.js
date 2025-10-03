            <div className="card-content">
                <hr className="card-divider" />
                <div className='card-image-container'>
                    <img src={cardData.image} alt={cardData.name} className="card-image" />
                </div>
    
                <div className="card-open-modal" onClick={toggleCafeModal}>
                    View Full Page
                    <OpenCardIcon className="card-open-icon" />
                </div>

                <CafeModal show={showCafeModal} handleClose={toggleCafeModal} color={cardData.color_code}>
                    <div className='cafe-modal-title'>{cardData.name}<span className='cafe-modal-subname'>{cardData.subname}</span></div>
                    <div><span className='cafe-modal-neighborhood' style={{border: '2px solid ' + cardData.color_code, color: cardData.color_code}}>{cardData.neighborhood}</span></div>

                    <div className={`cafe-modal-images${hoveredImage !== null ? '-hovered' : ''}`}>
                        <div className={`cafe-modal-image-container ${hoveredImage === 1 ? 'hovered' : ''}`} onMouseEnter={() => setHoveredImage(1)} onMouseLeave={() => setHoveredImage(null)}>
                            <img className="cafe-modal-image" src={cardData.image} />
                        </div>
                        <div className={`cafe-modal-image-container ${hoveredImage === 2 ? 'hovered' : ''}`} onMouseEnter={() => setHoveredImage(2)} onMouseLeave={() => setHoveredImage(null)}>
                            <img className="cafe-modal-image" src={cardData.c_image2} />
                        </div>
                        <div className={`cafe-modal-image-container ${hoveredImage === 3 ? 'hovered' : ''}`} onMouseEnter={() => setHoveredImage(3)} onMouseLeave={() => setHoveredImage(null)}>
                            <img className="cafe-modal-image" src={cardData.c_image3} />
                        </div>
                    </div>

                    {cardData.description && 
                    <>
                        <div className='cafe-modal-about-title'>About</div>
                        <div className='cafe-modal-description'>{cardData.description}
                        {cardData.suggested_drink && 
                            <div className='cafe-modal-suggestion'>For a drink recommendation, try the <span className='cafe-modal-suggested-drink'>{cardData.suggested_drink}</span>.</div>
                        }
                        {cardData.suggested_food && 
                            <div className='cafe-modal-suggestion'>For a food recommendation, try the <span className='cafe-modal-suggested-food'>{cardData.suggested_food}</span>.</div>
                        }
                        </div>
                    </>
                    }

                    <div className='cafe-modal-hours-title'>Hours & Location</div>
                    <div className='cafe-modal-hours-location'>
                        <div className='cafe-modal-location'>
                            <div className='cafe-modal-address-title'>Address:<span className='cafe-modal-address'>{cardData.address}</span></div>
                            <div className="cafe-modal-google-maps-container">
                                <a href={cardData.google_maps_page} target="_blank" rel="noopener noreferrer" className="cafe-modal-google-maps">
                                    <img src={GoogleMaps} alt="Google Maps Logo" id='cafe-modal-google-maps-logo' className="card-google-maps-logo" />
                                    Open in Google Maps
                                </a>
                            </div>
                        </div>
                        <div className='cafe-modal-hours-table-container'>
                            <table className="cafe-modal-hours-table">
                                <thead>
                                    <tr className='cafe-modal-hours-table-top-row'>
                                        <th>Sun</th><th>Mon</th><th>Tues</th><th>Wed</th><th>Thurs</th><th>Fri</th><th>Sat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {formattedHours.map((hour, index) => {
                                            if (index % 2 === 0) {
                                                return <td style={{}} key={index}>{hour}</td>;
                                            }
                                        })}
                                    </tr>
                                    <tr className='cafe-modal-hours-table-bottom-row'>
                                        {formattedHours.map((hour, index) => {
                                            if (index % 2 != 0) {
                                                return <td style={{}} key={index}>{hour}</td>;
                                            }
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='cafe-modal-score-title'>Score</div>
                    <div className='cafe-modal-score' style={{color: cardData.color_code}}><span style={{border: '2px solid ' + cardData.color_code, borderRadius: '3px', paddingLeft: '0.3vw', paddingRight: '0.3vw', paddingTop: '0.1vw', paddingBottom: '0.1vw'}}>{cardData.score}/10</span></div>
                    <div className='cafe-modal-score-bar'>
                        <ScoreBar cardData={cardData} cafeModal={true} scoreBarHover={scoreBarHover} setScoreBarHover={setScoreBarHover}/>
                        {/* <div className='card-score-score' style={{color: cardData.color_code}}>{cardData.score}/10</div> */}
                    </div>

                    <div className='cafe-modal-tags-title'>Filters</div>
                    <CardTags cardData={cardData} />

                    {cardData.thanks && 
                    <div className='cafe-modal-thanks'>{cardData.thanks}</div>
                    }
                </CafeModal>
            </div>