import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { baseURL } from '../../../../../Services/axios-customize';
import { useNavigate } from 'react-router-dom';

function ModalView(props) {
  const { show, handleClose, dataStoreView } = props;
  const [img_url, set_img_url] = useState("");
  const [name, set_name] = useState("");
  const [price, set_price] = useState("");
  const [priceUsd, set_priceUsd] = useState("");
  const [typename, set_typename] = useState("");
  const [storeName, set_storeName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (show) {
      set_img_url(`${baseURL}${dataStoreView.image}`)
      set_name(dataStoreView.name)
      set_price(dataStoreView.price)
      set_priceUsd(dataStoreView.priceUsd)
      set_typename(dataStoreView.category.name)
      set_storeName(dataStoreView.user.store)
    }
  }, [dataStoreView])
  const handleViewStore = (item) => {
    navigate(`/store_U_detail/${item}`)
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
          <p><strong>Store:</strong> {storeName}</p>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Price:</strong> {price}đ (${priceUsd})</p>
            <p><strong>Type:</strong> {typename}</p>
          </div>
        </div>  
        < div className="view-all-button-container">        
        <button className="view-all-button" onClick={()=>handleViewStore(dataStoreView.user.id)}>View Store</button>    
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

export default ModalView;
