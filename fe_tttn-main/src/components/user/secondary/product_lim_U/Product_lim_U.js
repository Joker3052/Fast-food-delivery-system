import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import thư viện Link
import { baseURL } from '../../../../Services/axios-customize';
import { Productlimit10 } from '../../../../Services/ProductService';
import starImage from '../../../../assets/images/star.png';

function Product_lim_U() {
  const itemsPerPage = 10;
  const [listproduct, setlistproduct] = useState([]);

  useEffect(() => {
    getproduct();
  }, []);

  const getproduct = async () => {
    try {
      let res = await Productlimit10();
      if (res && res.data) {
        setlistproduct(res.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <>
      <ul className="image-list">
        {listproduct.map((image) => (
          <li key={image.id}>
            <img src={`${baseURL}${image.image}`} alt={`Ảnh ${image.id}`} />
            <p>{image.name}</p>
            <p>
              {typeof image.ratings === 'number'
                ? image.ratings % 1 !== 0
                  ? image.ratings.toFixed(2)
                  : image.ratings
                : image.ratings}{' '}
              <img src={starImage} alt="Star" style={{ width: '20px', height: '20px' }} />{' '}
              {image.numRated} reviews
            </p>
          </li>
        ))}
      </ul>

      {/* Thêm nút "Xem tất cả" */}
      <div className="view-all-button-container">
        <Link to="/allProduct">
          <button className="view-all-button">View More</button>
        </Link>
      </div>
    </>
  );
}

export default Product_lim_U;
