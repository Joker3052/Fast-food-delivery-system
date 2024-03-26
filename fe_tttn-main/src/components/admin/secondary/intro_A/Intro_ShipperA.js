// Home.js

import React from 'react';
import wellcomePic from '../../../../assets/images/slogan.png';
import { NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import logoApp from '../../../../assets/images/logo1.jpg';
function Intro_ShipperA() {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="home-header">
        <img src={wellcomePic} alt="wellcome" className="welcome" />
        
        {/* <input type="text" placeholder="Search..." className="search-input" onClick={()=>handleSearch()} /> */}
      </div>
      <div className="home-container">
        <section className="button-section">
          {/* <button className="action-button">Click me</button>
          <label for="dropdown" className="label">Chọn một tùy chọn:</label> */}
          {/* <select className="selection-button" title='món ăn'>
            <option value="1">O 1</option>
            <option value="2">O 2</option>
            <option value="3">O 3</option>
          </select> */}
          <NavDropdown className="fa-cart-shopping-container" title={<img src={logoApp} alt="User Avatar" className="user-avatar" />}>
            <NavDropdown.Item as={NavLink} to="/shipperA">
              All Users
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/shipperTrueA">
            Shippers have been approved
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/shipperFalseA">
            Shippers have not been approved yet
            </NavDropdown.Item>
          </NavDropdown>
          {/* <label className="radio-label">
            <input type="radio" name="radioGroup" className="radio-input" />
            Radio Button
          </label>
          <label className="radio-label">
            <input type="radio" name="radioGroup" className="radio-input" />
            Radio Button
          </label> */}
        </section>
      </div>
    </>
  );
}

export default Intro_ShipperA;
