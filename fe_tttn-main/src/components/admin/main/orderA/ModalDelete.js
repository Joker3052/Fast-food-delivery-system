import { useEffect,useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { DeleteOrderByID } from '../../../../Services/OrderServices';
function ModalDelete(props) {
  const { show, handleClose,dataStoreDelete } = props;
  const [store, set_store] = useState("");
  const [name, set_name] = useState('');

  const handleDeleteUser = async () => {
try {
      let res = await DeleteOrderByID(dataStoreDelete.id)
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
      set_store(dataStoreDelete.store)
      set_name(dataStoreDelete.user.name);
      
    }
  }, [dataStoreDelete])


  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>delete order of store : {store} ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="modal-content">
        <h2 className="text-danger">Warning this action cannot be undone!</h2>
          <div className="store-container-modal">
           <h4>Orders by customer: {name}</h4>
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
