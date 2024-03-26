import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { baseURL } from '../../../../../Services/axios-customize';

function ModalView(props) {
  const { show, handleClose, dataStoreView } = props;
  const [img_url, set_img_url] = useState("");
  const [name, set_name] = useState("");
  const [price, set_price] = useState("");
  const [priceUsd, set_priceUsd] = useState("");
  const [typename, set_typename] = useState("");

  useEffect(() => {
    if (show) {
      set_img_url(`${baseURL}${dataStoreView.image}`)
      set_name(dataStoreView.name)
      set_price(dataStoreView.price)
      set_priceUsd(dataStoreView.priceUsd)
      set_typename(dataStoreView.category.name)
    }
  }, [dataStoreView])

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
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Price:</strong> {price}đ (${priceUsd})</p>
            <p><strong>Type:</strong> {typename}</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalView;
