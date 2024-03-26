import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { baseURL } from '../../../../../Services/axios-customize';
import { useNavigate, useParams } from 'react-router-dom';

function ModalViewCategory(props) {
  const { show, handleClose, dataStoreView_category } = props;
  const [img_url, set_img_url] = useState("");
  const [name, set_name] = useState("");
  const navigate = useNavigate();
  const { getIdStore } = useParams();
  useEffect(() => {
    if (show) {
      set_img_url(dataStoreView_category.icon)
      set_name(dataStoreView_category.name)
    }
  }, [dataStoreView_category])
  const handleViewStore = (item) => {
    navigate(`/product_of_category_StoreU/${getIdStore}/${item}`)
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Product: {name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-content">
          <div className="image-container-modal">
            <img src={img_url} alt={name} className="modal-image" />
          </div>
          <div className="info-container">
            <p><strong>Type:</strong> {name}</p>
          </div>
        </div>
        < div className="view-all-button-container">        
        <button className="view-all-button" onClick={()=>handleViewStore(dataStoreView_category.id)}>View More</button>    
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

export default ModalViewCategory;
