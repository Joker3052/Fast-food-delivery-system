import React, { useEffect, useRef, useState } from 'react';
import { baseURL } from '../../../../../Services/axios-customize';
import starImage from '../../../../../assets/images/star.png';
import ModalView from './ModalView';
import { toast } from 'react-toastify';
import { AddOrderItem } from '../../../../../Services/OrderServices';
import Footer from '../../../Footer/Footer';
import wellcomePic from '../../../../../assets/images/slogan.png';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { SearchPrAll } from '../../../../../Services/ProductService';
import { Badge } from 'react-bootstrap';
import ModalDeleteAll from '../../product/ModalDeleteAll';
function SearchU() {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [listproduct, setListProduct] = useState([]);
    const [selectedPage, setSelectedPage] = useState(1);
    const [IsShowModalView, SetIsShowModalView] = useState(false);
    const [dataStoreView, setDataStoreView] = useState({});
    const id666 = localStorage.getItem('id666');
    const searchInputRef = useRef(null);
    const [searchError, setSearchError] = useState(false); // Thêm state để kiểm soát trạng thái lỗi
    const { getTheSearch } = useParams();
    const navigate = useNavigate();
    const [IsShowModalDeleteAll, SetIsShowModalDeleteAll] = useState(false);
    const handleDeleteCart = () => {
        SetIsShowModalDeleteAll(true)
    }
    const handleViewStore = (Store1) => {
        setDataStoreView(Store1);
        SetIsShowModalView(true);
    };

    const handleClose = () => {
        SetIsShowModalView(false);
        getProducts();
        SetIsShowModalDeleteAll(false);
    };

    const getProducts = async () => {
        try {
            let res = await SearchPrAll(getTheSearch);
            if (res && res.data) {
                console.log("pr: ", res.data);
                setListProduct(res.data);
                setTotalPages(Math.ceil(res.data.length / itemsPerPage));
                setSearchError(false); // Reset trạng thái lỗi nếu dữ liệu được tìm thấy
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
            setSearchError(true); // Đặt trạng thái lỗi nếu có lỗi
        }
    };

    const handleSearch = debounce((event) => {
        let term = event.target.value;
        if (term) {
            navigate(`/searchU/${term}`);
            console.log(term);
        } else {
            navigate(`/searchU`);
            console.log(term);
        }
    }, 1000);

    useEffect(() => {
        getProducts();
        searchInputRef.current.focus();
    }, [currentPage, getTheSearch]);

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
        console.log("666 ", item.id);

        try {
            const res = await AddOrderItem(id666, item.id);

            if (res && res.data) {
                toast.success("add success!");
            } else {
                toast.error("Error!");
            }
        } catch (error) {
            // toast.error("Error!");
            // console.error("Error:", error);
            handleDeleteCart();
        }
    };

    return (
        <>
            <div className="home-header">
                <img src={wellcomePic} alt="wellcome" className="welcome" />
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    onChange={(event) => handleSearch(event)}
                />
            </div>
            <div className="home-container">

            </div>
           
            <div className="home-container">
                <h1>New products</h1>
                {searchError ? (
                    <p style={{ color: 'red' }}>Search not found</p>
                ) : (
                    <>
                        <ul className="image-list">
                            {currentImages.map((image) => (
                                <li key={image.id}>
                                    <img
                                        src={`${baseURL}${image.image}`}
                                        alt={`Ảnh ${image.id}`}
                                        onClick={() => handleViewStore(image)}
                                    />
                                    <p>{image.name}</p>
                                    <p>{image.price} đ (${image.priceUsd})</p>
                                    <p>
                                        {typeof image.ratings === 'number'
                                            ? image.ratings % 1 !== 0
                                                ? image.ratings.toFixed(2)
                                                : image.ratings
                                            : image.ratings}{' '}
                                        <img
                                            src={starImage}
                                            alt="Star"
                                            style={{ width: '20px', height: '20px' }}
                                        />{' '}
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
                        <div className="pagination">{renderPagination()}</div>
                    </>
                )}
            </div>
            <Footer />
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
    fontWeight: 'bold',
    color: 'red',
};

export default SearchU;
