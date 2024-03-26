import React, { useEffect, useState } from 'react';
import { baseURL } from '../../../../../Services/axios-customize';
import { GetProductOfMyStoreByID, PutProduct } from '../../../../../Services/ProductService';
import starImage from '../../../../../assets/images/star.png';
import Intro_U from '../../../secondary/intro_U/Itro_U';
import ModalView from './ModalView';
import ModalAddNew from './ModalAddNew';
import ModalDelete from './ModalDelete';
import ModalEdit from './ModalEdit';
import { ShowCategory } from '../../../../../Services/CategoryServices';
import ModalViewCategory from './ModalViewCategory';
import { Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FetchUserByID } from '../../../../../Services/UserServices';
import { Link } from 'react-router-dom';
function MyStore() {
    const id666 = localStorage.getItem('id666');
    const itemsPerPage = 10; // Số ảnh hiển thị trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [listproduct, setListProduct] = useState([]);
    const [selectedPage, setSelectedPage] = useState(1);
    const [IsShowModalView, SetIsShowModalView] = useState(false);
    const [dataStoreView, setDataStoreView] = useState({});
    const [IsShowModalAddNew, SetIsShowModalAddNew] = useState(false);
    const [IsShowModalDelete, SetIsShowModalDelete] = useState(false);
    const [dataStoreDelete, setDataStoreDelete] = useState({});
    const [IsShowModalEdit, SetIsShowModalEdit] = useState(false);
    const [dataStoreEdit, setDataStoreEdit] = useState({});
    const [storeU, setStoreU] = useState([]);
    //////////////////////////////////////////////
    const itemsPerPage_category = 10; // Số ảnh hiển thị trên mỗi trang
    const [currentPage_category, setcurrentPage_category] = useState(1);
    const [totalPages_category, settotalPages_category] = useState(0);
    const [listcategory, setlistcategory] = useState([]);
    const [selectedPage_category, setselectedPage_category_category] = useState(1);
    const [IsShowModalView_category, SetIsShowModalView_category] = useState(false);
    const [dataStoreView_category, setdataStoreView_category] = useState({});
    // const [getIsFeatured, SetgetIsFeatured] = useState(false);
    const handleEditFeatured = async (item, getIsFeaturedValue) => {
        try {
            const formData = new FormData();
            formData.append('isFeatured', getIsFeaturedValue);
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

    const handleViewStore = (Store1) => {
        // console.log(Store1)
        setDataStoreView(Store1)
        SetIsShowModalView(true)

    }
    const handleViewCategory = (Store1) => {
        // console.log(Store1)
        setdataStoreView_category(Store1)
        SetIsShowModalView_category(true)

    }
    const handleDeleteStore = (Store1) => {
        // console.log(Store1)
        setDataStoreDelete(Store1)
        SetIsShowModalDelete(true)
    }
    const handleEditStore = (Store1) => {
        setDataStoreEdit(Store1)
        SetIsShowModalEdit(true)
    }
    const handleClose = () => {
        SetIsShowModalView(false);
        SetIsShowModalAddNew(false);
        SetIsShowModalDelete(false);
        SetIsShowModalEdit(false);
        getProducts();
        getCategories();
        SetIsShowModalView_category(false);
    }
    useEffect(() => {
        getProducts();
        getCategories();
        getstore();
    }, [currentPage, currentPage_category]); // Gọi lại khi trang thay đổi

    const getProducts = async () => {
        try {
            let res = await GetProductOfMyStoreByID(id666);
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
    const getstore = async () => {
        try {
            let res = await FetchUserByID(id666);
            if (res && res.data) {
                setStoreU(res.data);
                console.log("info store", res.data);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };
    return (
        <>
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
                <Link to={`/store_info`}>
                    <button className='btn btn-warning mx-3'
                    ><i className="fa-solid fa-pen-to-square"></i>
                    </button>
                </Link>
                <Link to={`/cusOrder`}>
                    <button className='btn btn-info mx-3'
                    >
                        Customer 's order
                    </button>
                </Link>
            </div>
            <div className='home-container'>
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
            </div>
            <ModalViewCategory
                dataStoreView_category={dataStoreView_category}
                show={IsShowModalView_category}
                handleClose={handleClose}
            />
            <div className='home-container'>
                <section className="button-section">
                    <button className='action-button'
                        onClick={() => SetIsShowModalAddNew(true)}
                    >Add new product</button>
                </section>
                <h1>Your Products</h1>
                <ul className="image-list">
                    {currentImages.map((image) => (
                        <li key={image.id}>
                            <img src={`${baseURL}${image.image}`} alt={`Ảnh ${image.id}`}
                                onClick={() => handleViewStore(image)} />
                            <p>{image.name}</p>
                            <p>{image.price} đ</p>
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
                                        <Badge bg="warning" text="dark" style={{ marginBottom: '10px' }} >
                                            The Product is awaiting approval!
                                        </Badge>
                                    </div>
                                </>
                            )}
                            {!image.isFeatured && (
                                <>
                                    <div>
                                        <button className='btn btn-danger' style={{ marginBottom: '10px' }}
                                            onClick={() => handleEditFeatured(image, true)}
                                        ><i class="fa-solid fa-eye-slash"> Out of stock</i>
                                        </button>
                                    </div>
                                </>
                            )}
                            {image.isFeatured && (
                                <>
                                    <div>
                                        <button className='btn btn-success' style={{ marginBottom: '10px' }}
                                            onClick={() => handleEditFeatured(image, false)}
                                        ><i class="fa-solid fa-eye"> in stock</i>
                                        </button>
                                    </div>
                                </>
                            )}
                            <button className='btn btn-danger mx-3'
                                onClick={() => handleDeleteStore(image)}
                            ><i className="fa-solid fa-trash"></i>
                            </button>
                            <button className='btn btn-warning mx-3'
                                onClick={() => handleEditStore(image)}
                            ><i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="pagination">
                    {renderPagination()}
                </div>
            </div>
            <ModalView
                dataStoreView={dataStoreView}
                show={IsShowModalView}
                handleClose={handleClose}
            />
            <ModalAddNew
                show={IsShowModalAddNew}
                handleClose={handleClose}
            />
            <ModalDelete
                show={IsShowModalDelete}
                dataStoreDelete={dataStoreDelete}
                handleClose={handleClose}
            />
            <ModalEdit
                show={IsShowModalEdit}
                dataStoreEdit={dataStoreEdit}
                handleClose={handleClose}
            />
        </>
    );
}

const activePageStyle = {
    fontWeight: 'bold', // hoặc bất kỳ hiệu ứng CSS khác bạn muốn thêm
    color: 'red',
};

export default MyStore;
