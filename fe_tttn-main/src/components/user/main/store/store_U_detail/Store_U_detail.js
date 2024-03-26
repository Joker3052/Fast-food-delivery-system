import React, { useContext, useEffect, useState } from 'react';
import { baseURL } from '../../../../../Services/axios-customize';
import starImage from '../../../../../assets/images/star.png';
import ModalView from './ModalView';
import { toast } from 'react-toastify';
import { AddOrderItem } from '../../../../../Services/OrderServices';
import { FetchUserByID } from '../../../../../Services/UserServices';
import { useParams } from 'react-router-dom';
import wellcomePic from '../../../../../assets/images/well21.png';
import { ShowCategory } from '../../../../../Services/CategoryServices';
import { GetProductOfStoreByID } from '../../../../../Services/ProductService';
import ModalViewCategory from './ModalViewCategory';
import { Badge } from 'react-bootstrap';
import ModalDeleteAll from '../../product/ModalDeleteAll';
function Store_U_detail() {
    const itemsPerPage = 10; // Số ảnh hiển thị trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [listproduct, setListProduct] = useState([]);
    const [storeU, setStoreU] = useState([]);
    const [selectedPage, setSelectedPage] = useState(1);
    const [IsShowModalView, SetIsShowModalView] = useState(false);
    const [dataStoreView, setDataStoreView] = useState({});
    const id666 = localStorage.getItem('id666');
    const { getIdStore } = useParams();
     //////////////////////////////////////////////
     const itemsPerPage_category = 10; // Số ảnh hiển thị trên mỗi trang
     const [currentPage_category, setcurrentPage_category] = useState(1);
     const [totalPages_category, settotalPages_category] = useState(0);
     const [listcategory, setlistcategory] = useState([]);
     const [selectedPage_category, setselectedPage_category_category] = useState(1);
     const [IsShowModalView_category, SetIsShowModalView_category] = useState(false);
     const [dataStoreView_category, setdataStoreView_category] = useState({});
     const [IsShowModalDeleteAll, SetIsShowModalDeleteAll] = useState(false);
     const handleDeleteCart = () => {
         SetIsShowModalDeleteAll(true)
     }
     const handleViewCategory = (Store1) => {
        // console.log(Store1)
        setdataStoreView_category(Store1)
        SetIsShowModalView_category(true)

    }
    const handleViewStore = (Store1) => {
        // console.log(Store1)
        setDataStoreView(Store1)
        SetIsShowModalView(true)

    }
    const handleClose = () => {
        SetIsShowModalView(false);
        SetIsShowModalView_category(false);
        SetIsShowModalDeleteAll(false);
        getProducts();
    }
    useEffect(() => {
        getstore();
        getProducts();
        getCategories();
    }, [currentPage,currentPage_category]); // Gọi lại khi trang thay đổi

    const getProducts = async () => {
        try {
            let res = await GetProductOfStoreByID(getIdStore);
            if (res && res.data) {
                setListProduct(res.data);
                setTotalPages(Math.ceil(res.data.length / itemsPerPage));
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setSelectedPage(newPage);
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    style={i === selectedPage ? activePageStyle : {}}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentImages = listproduct.slice(startIndex, endIndex);
    const handleAddToCart = async (item) => {
        console.log("666 ", item.id)

        // e.preventDefault();

        try {
            const res = await AddOrderItem(id666, item.id);

            if (res && res.data) {
                // setUser_add("");
                // setproduct_add("");
                toast.success("add success!");
                // Delay the reload by 1.5 seconds

                // setTimeout(() => {
                //     window.location.reload();
                // }, 1500);
            } else {
                toast.error("Error!");
            }
        } catch (error) {
            // toast.error("Error!");
            // console.error("Error:", error);
            handleDeleteCart();
        }
    };
    const getstore = async () => {
        try {
            let res = await FetchUserByID(getIdStore);
            if (res && res.data) {
                setStoreU(res.data);
                console.log("info store", res.data);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const getCategories = async () => {
        try {
            let res = await ShowCategory();
            if (res && res.data) {
                setlistcategory(res.data);
                settotalPages_category(Math.ceil(res.data.length / itemsPerPage_category));
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handlePageChange_category = (newPage) => {
        setcurrentPage_category(newPage);
        setselectedPage_category_category(newPage);
    };

    const renderPagination_category = () => {
        const pages = [];
        for (let i = 1; i <= totalPages_category; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange_category(i)}
                    style={i === selectedPage_category ? activePageStyle : {}}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const startIndex_category = (currentPage_category - 1) * itemsPerPage_category;
    const endIndex_category = startIndex_category + itemsPerPage_category;
    const currentImages_category = listcategory.slice(startIndex_category, endIndex_category);

    return (
        <>
            <div className="store-container">
                <div className="store-info" style={{
                    backgroundImage: `url('${baseURL}${storeU.imgStore}')`,
                    // backgroundSize: 'cover',
                }}>
                    {/* <img src={`${baseURL}${storeU.imgStore}`} alt="Logo" className="backgroundStore" /> */}
                    <img src={`${baseURL}${storeU.image}`} alt="Store Image" />
                    <div className="back-overlay">
                        <h1>{`Store Name: ${storeU.store}`}</h1>
                        <h1>{`Owner: ${storeU.name}`}</h1>
                        <p dangerouslySetInnerHTML={{ __html: `<strong>Address:</strong> ${storeU.address}` }} />
                        <p dangerouslySetInnerHTML={{
                            __html: `<strong>Opening Hours:</strong> <strong>Open at: ${storeU.openAt}</strong> 
                    <strong>Close at: ${storeU.closeAt}</strong> `
                        }} />
                        <p>
                            {typeof storeU.ratings === 'number'
                                ? storeU.ratings % 1 !== 0
                                    ? storeU.ratings.toFixed(2)
                                    : storeU.ratings
                                : storeU.ratings}{' '}
                            <img src={starImage} alt="Star" style={{ width: '20px', height: '20px' }} />{' '}
                            {storeU.numRated} reviews
                        </p>
                    </div>
                </div>
                {/* <div className="home-header">
                    <img src={wellcomePic} alt="wellcome" className="welcome" />
                    <input type="text" placeholder="Search..." className="search-input" />
                </div> */}
                <div className='home-container'>
            <h1>list of categories </h1>
                <ul className="image-list">
                    {currentImages_category.map((image) => (
                        <li key={image.id}>
                            <img src={image.icon} alt={`Ảnh ${image.id}`}
                                onClick={() => handleViewCategory(image)} />
                            <p>{image.name}</p>
                            {/* <p>{image.ratings} <img src={starImage} alt="Star" style={{ width: '20px', height: '20px' }} /> {image.numRated} reviews </p> */}
                            {/* <i className="fa-solid fa-cart-shopping"></i> */}
                        </li>
                    ))}
                </ul>
                <div className="pagination">
                    {renderPagination_category()}
                </div>
            </div>
            <ModalViewCategory
                dataStoreView_category={dataStoreView_category}
                show={IsShowModalView_category}
                handleClose={handleClose}
            />
                <div className="home-container">
                    {/* <section className="button-section">
                        <button className="action-button">Click me</button>
                        <label for="dropdown" className="label">Chọn một tùy chọn:</label>
                        <select className="selection-button" title='món ăn'>
                            <option value="1">O 1</option>
                            <option value="2">O 2</option>
                            <option value="3">O 3</option>
                        </select>
                        <label className="radio-label">
                            <input type="radio" name="radioGroup" className="radio-input" />
                            Radio Button
                        </label>
                        <label className="radio-label">
                            <input type="radio" name="radioGroup" className="radio-input" />
                            Radio Button
                        </label>
                    </section> */}
                </div>
                <div className='home-container'>
                <h1>list of products </h1>
                    <ul className="image-list">
                        {currentImages.map((image) => (
                            <li key={image.id}>
                                <img src={`${baseURL}${image.image}`} alt={`Ảnh ${image.id}`}
                                    onClick={() => handleViewStore(image)} />
                                <p>{image.name}</p>
                                <p>{image.price} đ (${image.priceUsd})</p>
                                {/* <p>{image.ratings} <img src={starImage} alt="Star" style={{ width: '20px', height: '20px' }} /> {image.numRated} reviews </p> */}
                                <p>
                                    {typeof image.ratings === 'number'
                                        ? image.ratings % 1 !== 0 // Kiểm tra xem có phải là số nguyên không
                                            ? image.ratings.toFixed(2) // Làm tròn đến 2 chữ số thập phân nếu là số thập phân
                                            : image.ratings // Giữ nguyên nếu là số nguyên
                                        : image.ratings}{' '}
                                    <img src={starImage} alt="Star" style={{ width: '20px', height: '20px' }} />{' '}
                                    {image.numRated} reviews
                                </p>
                                {!image.isFeatured && (
                                <>
                                    <div>
                                        <Badge bg="danger" style={{ marginBottom: '10px' }} >
                                        Out of stock
                                        </Badge>
                                    </div>
                                </>                               
                            )}
                            
                            {image.isFeatured && (
                                <>
                                    <button className='btn btn-success mx-3 add-to-cart-button'
                                        onClick={() => handleAddToCart(image)}
                                    >
                                        <i className="fa-solid fa-cart-shopping"></i>
                                    </button>
                                </>
                            )}
                            </li>
                        ))}
                    </ul>
                    <div className="pagination">
                        {renderPagination()}
                    </div>
                </div>
            </div>
            <ModalView
                dataStoreView={dataStoreView}
                show={IsShowModalView}
                handleClose={handleClose}
            />
             <ModalDeleteAll
                show={IsShowModalDeleteAll}
                handleClose={handleClose}
            />
        </>
    );
}

const activePageStyle = {
    fontWeight: 'bold', // hoặc bất kỳ hiệu ứng CSS khác bạn muốn thêm
    color: 'red',
};

export default Store_U_detail;
