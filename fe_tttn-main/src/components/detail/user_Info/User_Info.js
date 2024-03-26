import React, { useEffect, useState } from "react";
import { FetchUserByID, PutUser } from "../../../Services/UserServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../Services/axios-customize";
import ModalChangePass from "./ModalChangePass";

function User_Info() {
    const [showUser, setshowUser] = useState([]);
    const [email, set_email] = useState('');
    const [name, set_name] = useState('');
    const [phone, set_phone] = useState('');
    const [address, set_address] = useState('');
    const [description, set_description] = useState('');
    // const [pass_word, set_pass_word] = useState('');
    const [image, set_image] = useState(null);
    const navigate = useNavigate();
    const id666 = localStorage.getItem('id666');
    const [IsShowModalView, SetIsShowModalView] = useState(false);
    const handleViewStore = () => {
        SetIsShowModalView(true)
    }
    const handleClose = () => {
      SetIsShowModalView(false);
    }
    useEffect(() => {
        getUser();
    }, []); // Gọi lại khi trang thay đổi
    const handleEditUser = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('address', address);
            formData.append('description', description);
            formData.append('image', image);
            // formData.append('password', pass_word);
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
                set_name(res.data.name)
                set_phone(res.data.phone)
                set_address(res.data.address)
                set_description(res.data.description)
                set_image(res.data.image)
                // set_pass_word(res.data.pass_word)
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
                            src={`${baseURL}${showUser.image}`}
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                marginBottom: '10px',
                            }}
                            alt="Category Icon"
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
                        {/* <div className="form-row_info">
                            <div className="input-data_info">
                                <input className="input_info" type="text" required value={pass_word}
                                    onChange={(e) => set_pass_word(e.target.value)}
                                />
                                <div className="underline_info"></div>
                                <label htmlFor="">password</label>
                            </div>
                        </div> */}
                        <div className="form-row_info">
                            <div className="input-data_info">
                                <input className="input_info" type="text" value={address}
                                    onChange={(e) => set_address(e.target.value)}
                                />
                                <div className="underline_info"></div>
                                <label htmlFor="">Address</label>
                            </div>
                            <div className="input-data_info">
                                <input className="input_info" type="number" value={phone}
                                    onChange={(e) => set_phone(e.target.value)}
                                />
                                <div className="underline_info"></div>
                                <label htmlFor="">Phone</label>
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
                        <div className="form-row_info">
                            <div className="input-data_info textarea_info">
                                <textarea type="text" rows="8" cols="80" value={description}
                                    onChange={(e) => set_description(e.target.value)}
                                ></textarea>
                                <br />
                                <div className="underline_info"></div>
                                <label htmlFor="">Write your message</label>
                                <br />

                            </div>
                        </div>
                    </form>
                    <button className='btn btn-success mx-3 add-to-cart-button'
                        onClick={() => handleEditUser()}
                    >
                        SUBMIT
                    </button>
                </div>
                <button className='btn btn-info mx-3 add-to-cart-button'
                        onClick={() => handleViewStore()}
                    >
                        Change Password
                    </button>
            </div>
            <ModalChangePass
                show={IsShowModalView}
                handleClose={handleClose}
            />
        </>
    );
}

export default User_Info;
