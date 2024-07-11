/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Row, Col, FloatingLabel } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const CompanyAddEdit = ({ tableInstance, saveItem }) => {
  const { element, selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const initialValues = {
    customerName: '', phoneNo: '', email: '', addr_1: '',
    addr_2: '', city: '', state: '', country: '', isActive: true, adminUsrFirstName:'', adminUsrLastName:'', adminUsrEmail:'',
  };
  
  const [selectedItem, setSelectedItem] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleActivate = (e) => {
    values.isActive = e.target.checked;
    setIsActive(!isActive);
  }

  const closeModal = () => {
    setIsOpenAddEditModal(false);
    resetForm();
    setIsActive(true);
  }

  useEffect(() => {
    if (isOpenAddEditModal && selectedFlatRows.length === 1) {
      setSelectedItem(selectedFlatRows[0].original);
      Object.entries(selectedFlatRows[0].original).map(([key,value]) => {
        if (key == 'isActive') setIsActive(value)
        value = value === null ? '' : value;
        setFieldValue(key, value);
      })
    } else setSelectedItem(initialValues);
    return () => {};
  }, [isOpenAddEditModal, selectedFlatRows]);

  const validationSchema = Yup.object().shape({
    customerName: Yup.string().required('Company Name is required').matches(/^[A-Za-z\s]+$/, "Invalid Customer name format."),
    phoneNo: Yup.string().matches(/^[0-9]+$/, "Must be only digits").min(10, 'Must be exactly 10 digits').max(10, 'Must be exactly 10 digits'),
    email: Yup.string().required("Email is required").matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, "Invalid email format."),
    addr_1: Yup.string().required('Address Line 1 is required'),
    addr_2: Yup.string(),
    isActive: Yup.bool(),
    city: Yup.string().required('City is required').matches(/^[A-Za-z\s]+$/, "Invalid name format."),
    state: Yup.string().required('State is required').matches(/^[A-Za-z\s]+$/, "Invalid name format."),
    country: Yup.string().required('Country is required').matches(/^[A-Za-z\s]+$/, "Invalid name format."),
    adminUsrFirstName:  (selectedFlatRows.length != 1) && Yup.string().required('First Name is required').matches(/^[A-Za-z\s]+$/, "Invalid name format."),
    adminUsrLastName: (selectedFlatRows.length != 1) && Yup.string().matches(/^[A-Za-z\s]+$/, "Invalid name format."),
    adminUsrEmail: (selectedFlatRows.length != 1) && Yup.string().required("Email Address is required").matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, "Invalid email format."),
  });

  const onSubmit = async() => {
    let body = values
    if (selectedFlatRows.length === 1) {
      body = {
        ...body,
        "custId": selectedItem.custId,
      }
      saveItem({item:body}, closeModal);
    } else saveItem({item:body, isAdd: true}, closeModal);
    // closeModal();
  };
  
  const formik = useFormik({validationSchema, initialValues: initialValues, onSubmit, enableReinitialize: true, });
  const { handleSubmit, handleChange, values, touched, errors, setFieldValue, resetForm } = formik;
  return (
    <Modal show={isOpenAddEditModal} onHide={closeModal} animation={true}  backdrop="static" size='xl'>
      <Modal.Header closeButton>
        <Modal.Title className='text-primary'>{selectedFlatRows.length === 1 ? 'Edit' : 'Add'} {element} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Company name'>
                <Form.Control type="text" id="cust_name" placeholder="Company name" name='customerName' value={values.customerName} onChange={handleChange} />
                {errors.customerName && touched.customerName && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.customerName}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Email Address'>
                  <Form.Control type="email" id="cust_email" placeholder="Email Address" name='email' value={values.email} onChange={handleChange} />
                  {errors.email && touched.email && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.email}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Phone No'>
                <Form.Control type="number" id="cust_phone_no" placeholder="Phone No" name="phoneNo" value={values.phoneNo} onChange={handleChange} />
                {errors.phoneNo && touched.phoneNo && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.phoneNo}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Street'>
                <Form.Control type="text" id="addr_1" placeholder="Street" name="addr_1" value={values.addr_1} onChange={handleChange} />
                {errors.addr_1 && touched.addr_1 && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.addr_1}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Address Line 2'>
                <Form.Control type="text" id="addr_2" placeholder="Address Line 2" name='addr_2' value={values.addr_2} onChange={handleChange} />
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='City'>
                <Form.Control type="text" id="addr_city" placeholder="City" name="city" value={values.city} onChange={handleChange} />
                {errors.city && touched.city && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.city}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='State'>
                <Form.Control type="text" id='addr_state' placeholder="State" name='state' value={values.state} onChange={handleChange} />
                {errors.state && touched.state && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.state}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Country'>
                <Form.Control type="text" id='addr_country' placeholder="Country" name='country' value={values.country} onChange={handleChange} />
                {errors.country && touched.country && <div style={{fontSize: '0.72rem', color: 'red'}}>{errors.country}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <div className="mb-3 form-control" style={{ padding: '0.85rem 0.75rem'}} >
                <Form.Label htmlFor="is_active">Active Status</Form.Label>
                <Form.Check type="switch" className="m-0" id="is_active" name="isActive" checked={isActive} label="Inactive / Active" onChange={handleActivate} />
                {errors.isActive && touched.isActive && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.isActive}</div>}
              </div>
            </Col>
          </Row> 
          {(selectedFlatRows.length != 1) && (
          <Row>
          <div className='text-primary  mb-3 mt-1' style={{fontSize:'1rem'}}>Admin User Detail</div>
            <hr  className= 'mb-4'/>  
          <Col xl='6'>
              <FloatingLabel className="mb-3" label='First Name'>
                <Form.Control type="text" id="first_name" name='adminUsrFirstName' value={values.adminUsrFirstName} placeholder='First Name' onChange={handleChange} />
                {errors.adminUsrFirstName && touched.adminUsrFirstName && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.adminUsrFirstName}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Last Name'>
                  <Form.Control type="text" id="last_name" name='adminUsrLastName' value={values.adminUsrLastName} placeholder='Last Name' onChange={handleChange} />
                  {errors.adminUsrLastName && touched.adminUsrLastName && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.adminUsrLastName}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Email Address'>
                <Form.Control type="email" id="adminUsrEmail" name='adminUsrEmail' value={values.adminUsrEmail} placeholder='Email Address' onChange={handleChange} />
                {errors.adminUsrEmail && touched.adminUsrEmail && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.adminUsrEmail}</div>}
              </FloatingLabel>
            </Col>
          </Row> 
          ) }     
          <div style={{display:'flex', justifyContent:'end', gap:12}}>
            <Button variant="outline-primary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type='submit' onClick={handleSubmit}>
              {selectedFlatRows.length === 1 ? 'Done' : 'Add'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CompanyAddEdit;
