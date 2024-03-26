import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { baseURL } from '../../../../../Services/axios-customize';

function ModalView(props) {
  const { show, handleClose, dataStoreView } = props;
  const [img_url, set_img_url] = useState("");
  const [name, set_name] = useState("");
  useEffect(() => {
    if (show) {
      set_img_url(dataStoreView.icon)
      set_name(dataStoreView.name)
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
