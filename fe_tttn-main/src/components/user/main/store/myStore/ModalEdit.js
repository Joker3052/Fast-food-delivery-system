import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { PutProduct } from '../../../../../Services/ProductService';
import { toast } from 'react-toastify';
import { ShowCategory } from '../../../../../Services/CategoryServices';
function ModalEdit(props) {
  const { show, handleClose, dataStoreEdit } = props;
  const [name, set_name] = useState('');
  const [price, set_price] = useState('');
  // const [typename, set_typename] = useState(''); 
  const [image, set_image] = useState(null);
  const [listcategory, setlistcategory] = useState([]);
  const id666 = localStorage.getItem('id666');
  useEffect(() => {
    getCategories();
  }, []); // Gọi lại khi trang thay đổi

  const getCategories = async () => {
    try {
      let res = await ShowCategory();
      if (res && res.data) {
        setlistcategory(res.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    if (show) {
      set_image(dataStoreEdit.image)
      set_name(dataStoreEdit.name)
      set_price(dataStoreEdit.price)
      // set_typename(dataStoreEdit.category.id)

    }
  }, [dataStoreEdit])

  const handleEditUser = async () => {
    try {
      // if (typename !== 'men' && typename !== 'women') {
      //   toast.error('Typename must be "men" or "women"');
      //   return;
      // }

      const formData = new FormData();
      formData.append('image', image);
      formData.append('price', price);
      formData.append('name', name);
      // formData.append('category', typename);


      const res = await PutProduct(dataStoreEdit.id,formData);

      if (res && res.data) {
        handleClose();
        set_name('');
        set_image(null);
        set_price('');
        // set_typename('');
        toast.success('Edit success');
      } else {
        toast.error('Error!');
      }
    } catch (error) {
      toast.error('Error!');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                value={name}
                onChange={(event) => set_name(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Image</label>
              <input
                type="file"
                className="form-control"
                onChange={(event) => set_image(event.target.files[0])}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter price"
                value={price}
                onChange={(event) => set_price(event.target.value)}
              />
            </div>
            {/* <div className="form-group">
              <label>Type</label>
              <select
                className="form-control"
                value={typename}
                onChange={(event) => set_typename(event.target.value)}
              >
                <option value="" disabled>Select Type</option>
                {listcategory.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div> */}

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalEdit;