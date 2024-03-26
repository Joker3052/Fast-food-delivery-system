// Header.js

import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logoApp from '../../../assets/images/logo3.png';
import './header.css';
import { UserContext } from '../../../context/UserContext';
import { toast } from 'react-toastify';
import { NavDropdown } from 'react-bootstrap';

function Header_admin() {
  const { logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    toast.success("logout success!");
    navigate("/");
  };
  return (
    <nav>
      <div className="header-container">
        <div className="logo-container">
          <img src={logoApp} alt="Logo" className="logo" />
        </div>
        <ul className="menu">
          <li><NavLink to="/" activeClassName="active">Dashboard</NavLink></li>
          <li><NavLink to="/product_A" activeClassName="active">Product & Category</NavLink></li>
          <li><NavLink to="/storeA" activeClassName="active">Store</NavLink></li>
          <li><NavLink to="/userA" activeClassName="active">User</NavLink></li>
          <li><NavLink to="/orderA" activeClassName="active">Order</NavLink></li>
          <li><NavLink to="/shipperA" activeClassName="active">Shipper</NavLink></li>
          {((user && user.auth)) && (
            <NavDropdown className="fa-cart-shopping-container" title={<img src={localStorage.getItem('image')} alt="User Avatar" className="user-avatar" />}>
              <NavDropdown.Item as={NavLink} to="/user_info">
                  My Info
                </NavDropdown.Item>
              {(localStorage.getItem('isStore') === "true") &&
                <NavDropdown.Item as={NavLink} to="/myStore">
                  My Store
                </NavDropdown.Item>
              }
              {/* <NavDropdown.Item as={NavLink} to="/orderA">
                Orders
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/payment">
                payment
              </NavDropdown.Item> */}
            </NavDropdown>
          )}
        </ul>
        {((user && user.auth)) ?
          (<div className="login-container">
            <button onClick={() => handleLogout()} className="login-button">Logout</button>
          </div>) :
          (< Link to="/login">
            <div className="login-container">
              <button className="login-button">Login</button>
            </div>
          </Link>)
        }

      </div>
    </nav >
  );
}

export default Header_admin;
