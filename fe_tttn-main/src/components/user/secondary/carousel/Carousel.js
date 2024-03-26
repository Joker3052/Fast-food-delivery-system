// Carousel.js
import { baseURL } from '../../../../Services/axios-customize';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { FetchAllStore } from '../../../../Services/UserServices';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.css';
const Carousel = () => {
   const [listStore, setListStore] = useState([]);
   const getStore = async () => {
    try {
      let res = await FetchAllStore();
      if (res && res.data) {
        setListStore(res.data);
        // console.log("1",res.data)
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
   useEffect(() => {
    getStore();
  }, []); // Gọi lại khi trang thay đổi
  // const images = [
  //   'https://placekitten.com/800/400',
  //   'https://placekitten.com/800/401',
  //   'https://placekitten.com/800/402',
  //   // Add more image URLs as needed
  // ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: <button className="slick-prev"></button>,
    nextArrow: <button className="slick-next"></button>,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {listStore.map((imageUrl, index) => (
          <div key={index} className="image-container">
              <img src={`${baseURL}${imageUrl.imgStore}`} alt={`Ảnh ${imageUrl.id}`} />
            <div className="image-overlay">
            <p>{imageUrl.store}</p>
            </div>
          </div>
        ))}
         {/* {listStore.map((imageUrl, index) => (
          console.log("hh",imageUrl.name)
        ))} */}
      </Slider>
    </div>
  );
};

export default Carousel;
