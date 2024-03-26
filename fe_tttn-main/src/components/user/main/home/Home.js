// Home.js

import React, { useEffect, useState } from 'react';
// import './Home.css';
import wellcomePic from '../../../../assets/images/slogan.png';
import Carousel from '../../secondary/carousel/Carousel';
import Product_lim_U from '../../secondary/product_lim_U/Product_lim_U';
import Footer from '../../Footer/Footer';
function Home() {


  return (
    <>
      <div className="home-header">
        <img src={wellcomePic} alt="wellcome" className="welcome" />
      </div>
      <div className="home-container">
        <section>
          <Carousel />
        </section>
        <section>
          <h1>list of products</h1>
          <Product_lim_U />
        </section>
      </div>
      <Footer/>
    </>
  );
}

export default Home;
