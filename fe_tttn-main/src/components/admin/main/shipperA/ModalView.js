import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { baseURL } from '../../../../Services/axios-customize';
import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ModalView(props) {
  const { show, handleClose, dataStoreView } = props;
  const [img_url, set_img_url] = useState("");
  const [name, set_name] = useState("");
  const [email, set_email] = useState("");
  const [address, set_address] = useState("");
  const [phone, set_phone] = useState("");
  useEffect(() => {
    if (show) {
      set_img_url(`${baseURL}${dataStoreView.image}`)
      set_name(dataStoreView.name)
      set_phone(dataStoreView.phone)
      set_address(dataStoreView.address)
      set_email(dataStoreView.email)
    }
  }, [dataStoreView])

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Shipper: {name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-content">
          {/* <div className="image-container-modal">
            <img src={img_url} alt={name} className="modal-image" />
          </div> */}
          <div className="info-container">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Address:</strong> {address}</p>
            
           
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={handleClose}>
          Close
        </Button> */}
        {dataStoreView.store !== null && dataStoreView.isStore && (
              <>               
                <Link to={`/store_A_detail/${dataStoreView.id}`}>
                  <button className='btn btn-info mx-3'
                  // onClick={() => handleEditStore(image)}
                  ><i class="fa-solid fa-eye"> view</i>
                  </button>
                </Link>

              </>
            )}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalView;
