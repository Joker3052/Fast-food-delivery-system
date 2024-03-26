import React, { useContext, useEffect, useState } from 'react';
import { baseURL } from '../../../../../../Services/axios-customize';
import starImage from '../../../../../../assets/images/star.png';
import Intro_U from '../../../../secondary/intro_U/Itro_U';
import ModalView from './ModalView';
import { toast } from 'react-toastify';
import { AddOrderItem } from '../../../../../../Services/OrderServices';
import { useNavigate, useParams } from 'react-router-dom';
import { GetPrCategoryOfMystore, PutProduct } from '../../../../../../Services/ProductService';
import { GetCategoryByID } from '../../../../../../Services/CategoryServices';
import ModalDelete from './ModalDelete';
import ModalEdit from './ModalEdit';
import { Badge } from 'react-bootstrap';
function Product_of_category_EditU() {
    const itemsPerPage = 10; // Số ảnh hiển thị trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [listproduct, setListProduct] = useState([]);
    const [get_category, set_get_category] = useState([]);
    const [selectedPage, setSelectedPage] = useState(1);
    const [IsShowModalView, SetIsShowModalView] = useState(false);
    const [dataStoreView, setDataStoreView] = useState({});
    const id666 = localStorage.getItem('id666');
    const {getIduser, getIdProductofCategory } = useParams();
    const [IsShowModalDelete, SetIsShowModalDelete] = useState(false);
    const [dataStoreDelete, setDataStoreDelete] = useState({});
    const [IsShowModalEdit, SetIsShowModalEdit] = useState(false);
    const [dataStoreEdit, setDataStoreEdit] = useState({});
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
    const handleDeleteStore = (Store1) => {
        console.log(Store1)
        setDataStoreDelete(Store1)
        SetIsShowModalDelete(true)
    }
    const handleEditStore = (Store1) => {
        setDataStoreEdit(Store1)
        SetIsShowModalEdit(true)
    }
    const handleViewStore = (Store1) => {
        // console.log(Store1)
        setDataStoreView(Store1)
        SetIsShowModalView(true)

    }
   const navigate = useNavigate();
    const handleClose = () => {
        SetIsShowModalView(false);
        getProducts();
        SetIsShowModalDelete(false);
        SetIsShowModalEdit(false);
    }
    useEffect(() => {
        getcategory();
        getProducts();
    }, [currentPage]); // Gọi lại khi trang thay đổi

    const getProducts = async () => {
        try {
            let res = await GetPrCategoryOfMystore(getIduser,getIdProductofCategory);
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
    
    const getcategory = async () => {
        try {
            let res = await GetCategoryByID(getIdProductofCategory);
            if (res && res.data) {
                set_get_category(res.data);
                console.log("info store", res.data);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };
  const  handleGoHome=()=>{
        navigate("/");
    }
    return (
        <>
            <Intro_U />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom: '20px',
            }}>
                <img
                    src={`${get_category.icon}`}
                    style={{
                        width: '100px',
                        borderRadius: '50%',
                        marginBottom: '10px',
                    }}
                    alt="Category Icon"
                />
                <p dangerouslySetInnerHTML={{ __html: `<strong>Type:</strong> ${get_category.name}` }} />
            </div>

            <div className='home-container'>
                <h1>list of products 666</h1>
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
                                        ><i class="fa-solid fa-eye"> Out of stock</i>
                                        </button>
                                    </div>
                                </>
                            )}                           
                            {image.isFeatured && (
                                <>                                   
                                    <div>
                                        <button className='btn btn-success' style={{ marginBottom: '10px' }}
                                            onClick={() => handleEditFeatured(image, false)}
                                        ><i class="fa-solid fa-eye-slash"> in stock</i>
                                        </button>
                                    </div>
                                </>
                            )}
                            <button className='btn btn-danger'
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

export default Product_of_category_EditU;
