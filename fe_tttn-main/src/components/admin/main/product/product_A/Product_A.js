import React, { useEffect, useState } from 'react';
import { baseURL } from '../../../../../Services/axios-customize';
import { PutProduct, ShowProductAdmin } from '../../../../../Services/ProductService';
import starImage from '../../../../../assets/images/star.png';
import ModalView from './ModalView';
import { toast } from 'react-toastify';
import IntroP_C_A from '../../../secondary/introP_C_A/ItroP_C_A';
import { Badge } from 'react-bootstrap';
function Product_A() {
    const itemsPerPage = 10; // Số ảnh hiển thị trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [listproduct, setListProduct] = useState([]);
    const [selectedPage, setSelectedPage] = useState(1);
    const [IsShowModalView, SetIsShowModalView] = useState(false);
    const [dataStoreView, setDataStoreView] = useState({});
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
    const handleViewStore = (Store1) => {
        // console.log(Store1)
        setDataStoreView(Store1)
        SetIsShowModalView(true)

    }
    const handleClose = () => {
        SetIsShowModalView(false);
        getProducts();
    }
    useEffect(() => {
        getProducts();
    }, [currentPage]); // Gọi lại khi trang thay đổi

    const getProducts = async () => {
        try {
            let res = await ShowProductAdmin();
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

    return (
        <>
            <IntroP_C_A />
            <div className='home-container'>
                <h1>All Products</h1>
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

export default Product_A;
