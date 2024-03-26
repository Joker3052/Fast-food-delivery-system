import { useEffect,useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { DelProduct } from '../../../../../Services/ProductService';
import { baseURL } from '../../../../../Services/axios-customize';
function ModalDelete(props) {
  const { show, handleClose,dataStoreDelete } = props;
  const [image, set_image] = useState("");
  const [name, set_name] = useState('');

  const handleDeleteUser = async () => {
try {
      let res = await DelProduct(dataStoreDelete.id)
      if (res && res.data) {
        handleClose();
        toast.success("Create success")
      } else {
        toast.error("Create success")
      }
    } catch (error) {
      toast.error("Error!")
      console.error("Error:", error)
    }
  }
  useEffect(() => {
    if (show) {
      set_image(`${baseURL}${dataStoreDelete.image}`)
      set_name(dataStoreDelete.name);
      
    }
  }, [dataStoreDelete])


  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>delete Product : {name} ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="modal-content">
        <h2 className="text-danger">Warning this action cannot be undone!</h2>
          <div className="image-container-modal">
            <img src={image} alt={name} className="modal-image" />
          </div>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button className='btn btn-danger' variant="primary" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDelete;
