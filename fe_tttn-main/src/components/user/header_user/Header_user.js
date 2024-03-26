// Header.js

import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logoApp from '../../../assets/images/logo3.png';
import './header.css';
import { UserContext } from '../../../context/UserContext';
import { toast } from 'react-toastify';
import { NavDropdown } from 'react-bootstrap';
import Cart from '../secondary/cart/Cart';
// import { useCart } from '../../../context/CartContext';
function Header_user() {
  const { logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  // Lấy giá trị 'countcart' từ local storage
  const countcart = localStorage.getItem('countcart');

  const handleLogout = () => {
    logout();
    // window.location.reload();
    toast.success("logout success!");
    navigate("/");
  };

  return (
    <nav>
      <div className="header-container">
        <div className="logo-container">
          <Link to="/">
            <img src={logoApp} alt="Logo" className="logo" />
          </Link>
        </div>
        <ul className="menu">
          {/* <li><NavLink to="/" activeClassName="active">Home</NavLink></li> */}
          {/* <li><NavLink to="/storeU" activeClassName="active">Stores</NavLink></li> */}
          {/* <li><NavLink to="/allproduct" activeClassName="active">Food & Beverages</NavLink></li> */}
          {/* <li><NavLink to="/product_New" activeClassName="active">New</NavLink></li> */}
          {/* <li><NavLink to="/stor" activeClassName="active">On sale</NavLink></li> */}
          {/* <li><NavLink to="/topRated" activeClassName="active">Top Rated</NavLink></li> */}
          {/* <li><NavLink to="/myStore" activeClassName="active">My Store</NavLink></li>
          <li><NavLink to="/orderU" activeClassName="active">Orders</NavLink></li>
          <li><NavLink to="/payment" activeClassName="active">payment</NavLink></li> */}
          {/* <li><NavLink to="/about" activeClassName="active">About</NavLink></li> */}
          {/* {((user && user.auth)) && (
            <li>
              <NavLink to="/checkout" activeClassName="active" className="fa-cart-shopping-container">
                <img src={localStorage.getItem('image')} alt="User Avatar" className="user-avatar" />
              </NavLink>
            </li>
          )} */}
          {((user && user.auth)) && (
            <>
              <li><NavLink to="/storeU" activeClassName="active">Stores</NavLink></li>
              <li><NavLink to="/allproduct" activeClassName="active">Food & Beverages</NavLink></li>
              <li>
                <NavLink to="/checkout" activeClassName="active" className="fa-cart-shopping-container">
                  {/* <i className="fa-solid fa-cart-shopping cart-logo" data-count={localStorage.getItem('countcart')}></i> */}
                  {/* <i className="fa-solid fa-cart-shopping cart-logo" data-count={countcart}></i> */}
                  <Cart />
                </NavLink>

              </li>
              <NavDropdown className="fa-cart-shopping-container" title={<img src={localStorage.getItem('image')} alt="User Avatar" className="user-avatar" />}>
                <NavDropdown.Item as={NavLink} to="/user_info">
                  My Info
                </NavDropdown.Item>
                {(localStorage.getItem('isStore') === "true") &&
                  <NavDropdown.Item as={NavLink} to="/myStore">
                    My Store
                  </NavDropdown.Item>
                }
                 {(localStorage.getItem('isStore') === "false") &&
                  <NavDropdown.Item as={NavLink} to="/store_info">
                    Register Store
                  </NavDropdown.Item>
                }
                <NavDropdown.Item as={NavLink} to="/orderU">
                  Orders
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/payment">
                  payment
                </NavDropdown.Item>
              </NavDropdown>
            </>
          )}
          {/* <li>
            <img src={localStorage.getItem('image')} alt="User Avatar" className="user-avatar" />
          </li> */}
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
    </nav>
  );
}

export default Header_user;
