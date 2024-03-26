// Home.js

import React, { useEffect, useState } from 'react';
import wellcomePic from '../../../../../assets/images/slogan.png';
import { FetchAllStore } from '../../../../../Services/UserServices';
import { baseURL } from '../../../../../Services/axios-customize';
import starImage from '../../../../../assets/images/star.png';
import { Link, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
function StoreA() {
  const navigate = useNavigate();
  const [listStore, setListStore] = useState([]);
  const [originalListStore, setOriginalListStore] = useState([]); // Thêm biến tạm thời
  useEffect(() => {
    getStore();
  }, []);
  
  const getStore = async () => {
    try {
      let res = await FetchAllStore();
      if (res && res.data) {
        setListStore(res.data);
        setOriginalListStore(res.data);
        // console.log('stores: ',res.data)
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
const handleViewStore=(item)=>{
  navigate(`/store_A_detail/${item}`)
}
const handleSearch = debounce((event) => {
  console.log(event.target.value);
  let term = event.target.value;
  if (term) {
    let searchImgName = originalListStore.filter((item) =>
      item.store.includes(term)
    );
    setListStore(searchImgName);
  } else {
    setListStore(originalListStore); // Sử dụng dữ liệu gốc khi không có từ khóa tìm kiếm
  }
}, 1000);
  return (
    <>
   <div className="home-header">
        <img src={wellcomePic} alt="wellcome" className="welcome" />
        <input type="text" placeholder="Search..." className="search-input" onChange={(event) => handleSearch(event)} />
      </div>
      <div className="home-container">
      
        <ul className="image-list-store">
        {listStore.map((image) => (
          <li key={image.id}>
            <img src={`${baseURL}${image.imgStore}`} alt={`Ảnh ${image.id}`} />
            <p>{image.store}</p>
            <p>
              {typeof image.ratings === 'number'
                ? image.ratings % 1 !== 0
                  ? image.ratings.toFixed(2)
                  : image.ratings
                : image.ratings}{' '}
              <img src={starImage} alt="Star" style={{ width: '20px', height: '20px' }} />{' '}
              {image.numRated} reviews
            </p>
            <div className="view-all-button-container">
        
          <button className="view-all-button" onClick={()=>handleViewStore(image.id)}>View Store</button>
       
      </div>
          </li>
        ))}
      </ul>
      </div>

    </>
  );
}

export default StoreA;
