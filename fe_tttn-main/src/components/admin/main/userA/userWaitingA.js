import React, { useEffect, useState } from 'react';
import { baseURL } from '../../../../Services/axios-customize';
import { FetchAllUser, PutUser } from '../../../../Services/UserServices';
import ModalView from './ModalView';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import Intro_A from '../../secondary/intro_A/Intro_A';
import { toast } from 'react-toastify';
function UserWaitingA() {
     
    const [listuser, setlistuser] = useState([]);
    const [IsShowModalView, SetIsShowModalView] = useState(false);
    const [dataStoreView, setDataStoreView] = useState({});
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
    }, []); // Gọi lại khi trang thay đổi

    const getUser = async () => {
        try {
            let res = await FetchAllUser();
            if (res && res.data) {
                setlistuser(res.data);
              
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

   
    
   

    return (
        <>
            <Intro_A/>
            <div className='home-container'>
                <h1>Users Are Waiting</h1>
                <ul className="image-list">
                    {listuser.map((image) => (
                        !image.isAdmin && image.store !== null && !image.isStore && (
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
                                        onClick={() => handleEditIsStore(image,true)}
                                        ><i class="fa-solid fa-eye-slash"> not ok</i>
                                        </button>
                                    </>
                                )}
                                                                             
                            </li>
                        )
                    ))}
                </ul>
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

export default UserWaitingA;
