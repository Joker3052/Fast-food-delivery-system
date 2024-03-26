import React, { useEffect, useState } from 'react';
import { ShowCategory } from '../../../../Services/CategoryServices';
import ModalViewCategory from './ModalViewCategory';
function Categories_U() {
    const itemsPerPage_category = 10; // Số ảnh hiển thị trên mỗi trang
    const [currentPage_category, setcurrentPage_category] = useState(1);
    const [totalPages_category, settotalPages_category] = useState(0);
    const [listcategory, setlistcategory] = useState([]);
    const [selectedPage_category, setselectedPage_category_category] = useState(1);
    const [IsShowModalView_category, SetIsShowModalView_category] = useState(false);
    const [dataStoreView_category, setdataStoreView_category] = useState({});
    const handleViewCategory = (Store1) => {
        // console.log(Store1)
        setdataStoreView_category(Store1)
        SetIsShowModalView_category(true)

    }
    const handleClose = () => {
        SetIsShowModalView_category(false);
        getCategories();
    }
    useEffect(() => {
        getCategories();
    }, [currentPage_category]); // Gọi lại khi trang thay đổi

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
            {/* <Intro_U /> */}
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
        </>
    );
}

const activePageStyle = {
    fontWeight: 'bold', // hoặc bất kỳ hiệu ứng CSS khác bạn muốn thêm
    color: 'red',
};

export default Categories_U;
