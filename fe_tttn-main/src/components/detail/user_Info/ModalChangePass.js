import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { PutUser, completeRegistration } from '../../../Services/UserServices';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function ModalChangePass(props) {
  const { show, handleClose, dataStoreView_category } = props;
  const [password, set_password] = useState("");
  const navigate = useNavigate();
  const id666 = localStorage.getItem('id666');
  const handleEditUser = async () => {
    try {
      if(!password){
        toast.error('enter pass!');
      }
      else{
        const formData = new FormData();
        formData.append('password', password);
        // formData.append('password', pass_word);
        const res = await PutUser(id666, formData);

        if (res && res.data) {
            toast.success('Edit success');
            set_password('');
            handleClose();
        } else {
            toast.error('Error!');
        }
      }
    } catch (error) {
        toast.error('Error!');
        console.error('Error:', error);
    }
};
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New passwords</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter new password"
                value={password}
                onChange={(event) => set_password(event.target.value)}
              />
            </div>
        < div className="view-all-button-container">        
        <button className="view-all-button" onClick={()=>handleEditUser()}>SUBMIT</button>    
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

export default ModalChangePass;
