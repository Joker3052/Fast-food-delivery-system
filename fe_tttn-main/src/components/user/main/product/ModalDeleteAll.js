import { useEffect,useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { DeleteAllOrderItem } from '../../../../Services/OrderServices';
function ModalDeleteAll(props) {
  const { show, handleClose } = props;
const id666 = localStorage.getItem('id666');

  const handleDeleteUser = async () => {
try {
      let res = await DeleteAllOrderItem(id666)
      if (res && res.data) {
        handleClose();
        toast.success("delete success")
      } else {
        toast.error("fail")
      }
    } catch (error) {
      toast.error("Error!")
      console.error("Error:", error)
    }
  }
  // useEffect(() => {
  //   if (show) {
  //     set_image(`${baseURL}${dataStoreDelete.image}`)
  //     set_name(dataStoreDelete.name);
      
  //   }
  // }, [dataStoreDelete])


  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm deletion of all products?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="modal-content">
        <h2 className="text-danger">You already have products from another store in your cart. If you want to purchase 
        this product, you need to remove all items from your cart.</h2>
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

export default ModalDeleteAll;
