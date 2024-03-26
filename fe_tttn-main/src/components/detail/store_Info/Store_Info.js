import React, { useEffect, useState } from "react";
import { FetchUserByID, PutUser } from "../../../Services/UserServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../Services/axios-customize";

function Store_Info() {
    const [showUser, setshowUser] = useState([]);
    const [name, set_name] = useState('');
    const [openAt, set_openAt] = useState('');
    const [closeAt, set_closeAt] = useState('');
    const [image, set_image] = useState(null);
    const navigate = useNavigate();
    const id666 = localStorage.getItem('id666');
    useEffect(() => {
        getUser();
    }, []); // Gọi lại khi trang thay đổi
    const handleEditUser = async () => {
        try {
            const formData = new FormData();
            formData.append('store', name);
            formData.append('openAt', openAt);
            formData.append('closeAt', closeAt);
            formData.append('imgStore', image);
            const res = await PutUser(id666, formData);

            if (res && res.data) {
                toast.success('Edit success');
                getUser();
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error('Error!');
            }
        } catch (error) {
            toast.error('Error!');
            console.error('Error:', error);
        }
    };
    const getUser = async () => {
        try {
            let res = await FetchUserByID(id666);
            if (res && res.data) {
                setshowUser(res.data);
                set_name(res.data.store)
                set_openAt(res.data.openAt)
                set_closeAt(res.data.closeAt)
                set_image(res.data.imgStore)
                console.log("info store", res.data);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };
    return (
        <>
            {/* action="/" */}
            <div className="body_info">
                <div className="container_info">

                    <div className="text_info">
                        <img
                            src={`${baseURL}${showUser.imgStore}`}
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                marginBottom: '10px',
                            }}
                            alt="Store Icon"
                        />
                    </div>
                    <form className="form_info"  >
                        <div className="form-row_info">
                            <div className="input-data_info">
                                <input className="input_info" type="text" value={`${showUser.email}`} />
                                <div className="underline_info"></div>
                                {/* <label  htmlFor="">Email </label> */}
                            </div>
                            <div className="input-data_info">
                                <input className="input_info" type="text" required value={name}
                                    onChange={(e) => set_name(e.target.value)}
                                />
                                <div className="underline_info"></div>
                                <label htmlFor="">Name</label>
                            </div>
                        </div>

                        <div className="form-row_info">
                            <div className="input-data_info">
                                <input
                                    className="input_info"
                                    type="time"
                                    value={openAt}
                                    onChange={(e) => set_openAt(e.target.value)}
                                />
                                <div className="underline_info"></div>
                                <label>openAt</label>
                            </div>
                            <div className="input-data_info">
                                <input
                                    className="input_info"
                                    type="time"
                                    value={closeAt}
                                    onChange={(e) => set_closeAt(e.target.value)}
                                />
                                <div className="underline_info"></div>
                                <label>closeAt</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Image</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={(event) => set_image(event.target.files[0])}
                            />
                        </div>
                       
                    </form>
                    <button className='btn btn-success mx-3 add-to-cart-button'
                        onClick={() => handleEditUser()}
                    >
                        SUBMIT
                    </button>
                </div>
            </div>
        </>
    );
}

export default Store_Info;
