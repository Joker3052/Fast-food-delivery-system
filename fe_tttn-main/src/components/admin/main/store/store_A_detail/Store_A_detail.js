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
import { GetProductOfStoreByID, PutProduct, ShowProductAdminOfStoreByID } from '../../../../../Services/ProductService';
import ModalViewCategory from './ModalViewCategory';
import { Badge } from 'react-bootstrap';
function Store_A_detail() {
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
    //  const itemsPerPage_category = 10; // Số ảnh hiển thị trên mỗi trang
    //  const [currentPage_category, setcurrentPage_category] = useState(1);
    //  const [totalPages_category, settotalPages_category] = useState(0);
    //  const [listcategory, setlistcategory] = useState([]);
    //  const [selectedPage_category, setselectedPage_category_category] = useState(1);
     const [IsShowModalView_category, SetIsShowModalView_category] = useState(false);
     const [dataStoreView_category, setdataStoreView_category] = useState({});
     const handleEditValid = async (item, getIsValidValue) => {
        try {
            const formData = new FormData();
            formData.append('isValid', getIsValidValue);
            // formData.append('category', typename);


            const res = await PutProduct(item.id, formData);

            if (res && res.data) {
                toast.success('Edit success');
                getProducts();
            } else {
                toast.error('Error!');
            }
        } catch (error) {
            toast.error('Error!');
            console.error('Error:', error);
        }
    };
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
        getProducts();
    }
    useEffect(() => {
        getstore();
        getProducts();
        // getCategories();
    }, [currentPage]); // Gọi lại khi trang thay đổi

    const getProducts = async () => {
        try {
            let res = await ShowProductAdminOfStoreByID(getIdStore);
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

    // const getCategories = async () => {
    //     try {
    //         let res = await ShowCategory();
    //         if (res && res.data) {
    //             setlistcategory(res.data);
    //             settotalPages_category(Math.ceil(res.data.length / itemsPerPage_category));
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data: ", error);
    //     }
    // };

    // const handlePageChange_category = (newPage) => {
    //     setcurrentPage_category(newPage);
    //     setselectedPage_category_category(newPage);
    // };

    // const renderPagination_category = () => {
    //     const pages = [];
    //     for (let i = 1; i <= totalPages_category; i++) {
    //         pages.push(
    //             <button
    //                 key={i}
    //                 onClick={() => handlePageChange_category(i)}
    //                 style={i === selectedPage_category ? activePageStyle : {}}
    //             >
    //                 {i}
    //             </button>
    //         );
    //     }
    //     return pages;
    // };

    // const startIndex_category = (currentPage_category - 1) * itemsPerPage_category;
    // const endIndex_category = startIndex_category + itemsPerPage_category;
    // const currentImages_category = listcategory.slice(startIndex_category, endIndex_category);

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
                {/* <div className='home-container'>
            <h1>list of categories </h1>
                <ul className="image-list">
                    {currentImages_category.map((image) => (
                        <li key={image.id}>
                            <img src={image.icon} alt={`Ảnh ${image.id}`}
                                onClick={() => handleViewCategory(image)} />
                            <p>{image.name}</p>
                        </li>
                    ))}
                </ul>
                <div className="pagination">
                    {renderPagination_category()}
                </div>
            </div> */}
            {/* <ModalViewCategory
                dataStoreView_category={dataStoreView_category}
                show={IsShowModalView_category}
                handleClose={handleClose}
            /> */}
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
                                {!image.isValid && (
                                <>
                                    <div>
                                        <Badge bg="warning"  style={{ marginBottom: '10px' }} >
                                            The Product is awaiting approval!
                                        </Badge>
                                    </div>
                                    <div>
                                        <button className='btn btn-danger' style={{ marginBottom: '10px' }}
                                            onClick={() => handleEditValid(image, true)}
                                        ><i class="fa-solid fa-eye"> Not Ok</i>
                                        </button>
                                    </div>
                                </>
                            )}
                            {image.isValid && (
                                <>
                                    <div>
                                        <Badge bg="success"  style={{ marginBottom: '10px' }} >
                                        Product approved!
                                        </Badge>
                                    </div>
                                    
                                    <div>
                                        <button className='btn btn-success' style={{ marginBottom: '10px' }}
                                            onClick={() => handleEditValid(image, false)}
                                        ><i class="fa-solid fa-eye"> OK</i>
                                        </button>
                                    </div>
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
        </>
    );
}

const activePageStyle = {
    fontWeight: 'bold', // hoặc bất kỳ hiệu ứng CSS khác bạn muốn thêm
    color: 'red',
};

export default Store_A_detail;
