import React, { useEffect, useState } from 'react';
import { baseURL } from '../../../../Services/axios-customize';
import { FetchAllShipper, FetchAllUser, PutShipper, PutUser, PutstoreAllInvalidPr } from '../../../../Services/UserServices';
import AvtShipper from '../../../../assets/images/shipperman.png';
import ModalView from './ModalView';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import Intro_ShipperA from '../../secondary/intro_A/Intro_ShipperA';
import { toast } from 'react-toastify';
function ShipperFalseA() {
    const itemsPerPage = 10; // Số ảnh hiển thị trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [listuser, setlistuser] = useState([]);
    const [selectedPage, setSelectedPage] = useState(1);
    const [IsShowModalView, SetIsShowModalView] = useState(false);
    const [dataStoreView, setDataStoreView] = useState({});
   
    const handleEditIsShipper = async (item, getIsStoreValue) => {
        try {
            const formData = new FormData();
            formData.append('isFeatured', getIsStoreValue);
            // formData.append('category', typename);


            const res = await PutShipper(item.id, formData);

            if (res && res.data) {
                toast.success('Edit success');
                getUser();
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
        getUser();
    }
    useEffect(() => {
        getUser();
    }, [currentPage]); // Gọi lại khi trang thay đổi

    const getUser = async () => {
        try {
            let res = await FetchAllShipper();
            if (res && res.data) {
                setlistuser(res.data);
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
    const currentImages = listuser.slice(startIndex, endIndex);

    return (
        <>
            <Intro_ShipperA/>
            <div className='home-container'>
                <h1>Shippers have not been approved yet</h1>
                <ul className="image-list">
                    {currentImages.map((image) => (
                        !image.isAdmin && !image.isFeatured && (
                            <li key={image.id}>
                                <img src={`${AvtShipper}`} alt={`Ảnh ${image.id}`}
                                    onClick={() => handleViewStore(image)} />
                                <p>{image.name}</p>
                                {  !image.isFeatured && (
                                    <>
                                        <div>
                                            <Badge bg="warning" text="dark" style={{ marginBottom: '10px' }} >
                                                shipper is awaiting approval!
                                            </Badge>
                                        </div>
                                        <button className='btn btn-warning mx-3'
                                            onClick={() => handleEditIsShipper(image, true)}
                                        ><i class="fa-solid fa-eye-slash"> not ok</i>
                                        </button>
                                    </>
                                )}
                            </li>
                        )
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

export default ShipperFalseA;
