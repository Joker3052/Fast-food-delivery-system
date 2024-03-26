import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { completeRegistration } from '../../../Services/UserServices';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function ModalOtpRegister(props) {
  const { show, handleClose, dataStoreView_category } = props;
  const [otp, set_otp] = useState("");
  const navigate = useNavigate();
  const handleView = async () => {
    try {
     
      const res = await completeRegistration(otp);

      if (res && res.data) {
        set_otp('');
        toast.success("successful!");
        navigate("/login");
      } else {
        toast.error(" failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error("OTP has expired .");
    }
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>You have 60 seconds before the OTP expires</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Otp"
                value={otp}
                onChange={(event) => set_otp(event.target.value)}
              />
            </div>
        < div className="view-all-button-container">        
        <button className="view-all-button" onClick={()=>handleView()}>Send Otp</button>    
    </div>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={handleClose}>
          Close
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalOtpRegister;
