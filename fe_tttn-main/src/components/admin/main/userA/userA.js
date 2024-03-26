import React, { useEffect, useState } from 'react';
import { baseURL } from '../../../../Services/axios-customize';
import { FetchAllUser, PutUser, PutstoreAllInvalidPr } from '../../../../Services/UserServices';

import ModalView from './ModalView';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import Intro_A from '../../secondary/intro_A/Intro_A';
import { toast } from 'react-toastify';
function UserA() {
    const itemsPerPage = 10; // Số ảnh hiển thị trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [listuser, setlistuser] = useState([]);
    const [selectedPage, setSelectedPage] = useState(1);
    const [IsShowModalView, SetIsShowModalView] = useState(false);
    const [dataStoreView, setDataStoreView] = useState({});
    const handleEditAndInvalid = async (item, getIsStoreValue) => {
        try {
            console.log('555: ',item)
            await handleEditIsStore(item, getIsStoreValue);
            await handleAllProductInvalid(item.id);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleAllProductInvalid = async (item) => {
        try {
            const res = await PutstoreAllInvalidPr(item);

            if (res && res.data) {
                toast.success('Edit success');
                getUser();
            } else {
                toast.error('Error!');
            }
        }
        catch (error) {
            toast.error('Error!');
            console.error('Error:', error);
        }
    }
    const handleEditIsStore = async (item, getIsStoreValue) => {
        try {
            const formData = new FormData();
            formData.append('isStore', getIsStoreValue);
            // formData.append('category', typename);


            const res = await PutUser(item.id, formData);

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
            let res = await FetchAllUser();
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
            <Intro_A />
            <div className='home-container'>
                <h1>All Users</h1>
                <ul className="image-list">
                    {currentImages.map((image) => (
                        !image.isAdmin && (
                            <li key={image.id}>
                                <img src={`${baseURL}${image.image}`} alt={`Ảnh ${image.id}`}
                                    onClick={() => handleViewStore(image)} />
                                <p>{image.name}</p>
                                {image.store !== null && !image.isStore && (
                                    <>
                                        <div>
                                            <Badge bg="warning" text="dark" style={{ marginBottom: '10px' }} >
                                                The store is awaiting approval!
                                            </Badge>
                                        </div>
                                        <button className='btn btn-warning mx-3'
                                            onClick={() => handleEditIsStore(image, true)}
                                        ><i class="fa-solid fa-eye-slash"> not ok</i>
                                        </button>
                                    </>
                                )}
                                {image.store !== null && image.isStore && (
                                    <>
                                        <div>
                                            <Badge bg="info" style={{ marginBottom: '10px' }}>The store</Badge>
                                        </div>
                                        <button className='btn btn-info mx-3'
                                            onClick={() => handleEditAndInvalid(image, false)}
                                        >
                                            <i className="fa-solid fa-eye"> ok</i>
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

export default UserA;
