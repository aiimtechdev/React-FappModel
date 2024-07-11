/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Row, Col, FloatingLabel } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { apiRequest } from "utils/request";

const UserAddEdit = ({ tableInstance, saveItem }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal, defaults } = tableInstance;
  const initialValues = {
    firstName: '', lastName: '', email: '', phoneNo: '',
    city: '', isActive: true, custId: ''
  };
  
  const [selectedItem, setSelectedItem] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [cmpnyOptions, setCmpnyOptions] = useState([]);
  const [rstcmpnyOpt, setRstCmpnyOpt] = useState(false);

  const handleActivate = (e) => {
    values.isActive = e.target.checked;
    setIsActive(!isActive);
  }


  useEffect(async() => {
    if(isOpenAddEditModal) {
      if(typeof defaults.option !== 'undefined' && defaults.option.custId) {
        setRstCmpnyOpt(true)
        setFieldValue('custId', defaults.option.custId.value);
      } else {
        const resp = await apiRequest('/customer/dropDown', 'GET', undefined, localStorage.getItem("token"));
        if(resp.status === 'success' && resp.data.status === 'success') setCmpnyOptions(resp.data.data);
      }
    }
    if (isOpenAddEditModal && selectedFlatRows.length === 1) {
      console.log(selectedFlatRows[0].original);
      setSelectedItem(selectedFlatRows[0].original);
      Object.entries(selectedFlatRows[0].original).map(([key, value]) => {
        if (key == 'isActive') setIsActive(value)
        value = (value === null) ? '' : value;
        if (key == 'city' && value === '-') { value = ''}
        setFieldValue(key, value);
      })
    } else setSelectedItem(initialValues);
    return () => {};
  }, [isOpenAddEditModal, selectedFlatRows]);

  const closeModal = () => {
    setIsOpenAddEditModal(false);
    resetForm();
    setIsActive(true);
  }

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required').matches(/^[A-Za-z\s]+$/, "Invalid name format."),
    lastName: Yup.string().matches(/^[A-Za-z\s]+$/, "Invalid name format."),
    email: Yup.string().required("Email Address is required").matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, "Invalid email format."),
    phoneNo: Yup.string().matches(/^[0-9]+$/, "Only digits allowed").min(10, 'Must be exactly 10 digits').max(10, 'Must be exactly 10 digits'),
    city: Yup.string().matches(/^[A-Za-z\s]+$/, "Invalid name format."),
    isActive: Yup.bool(),
    custId: Yup.number(),
  });

  const onSubmit = async() => {
    if(rstcmpnyOpt) setFieldValue('custId', defaults.option.custId.value);
    if (selectedFlatRows.length === 1) {
      let body = values
      body = {
        ...body,
        "dvceId": selectedItem.dvceId,
      }
      saveItem({item: body},closeModal );
    } else saveItem({item: values, isAdd: true}, closeModal);
   // closeModal();
  };
  
  const formik = useFormik({validationSchema, initialValues: initialValues, onSubmit, enableReinitialize: true, });
  const { handleSubmit, handleChange, values, touched, errors, setFieldValue, resetForm } = formik;
  return (
    <Modal show={isOpenAddEditModal} onHide={closeModal} animation={true}  backdrop="static" size='xl'>
      <Modal.Header closeButton>
        <Modal.Title className='text-primary'>{selectedFlatRows.length === 1 ? 'Edit' : 'Add'} User </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='First Name'>
                <Form.Control type="text" id="first_name" name='firstName' value={values.firstName} placeholder='First Name' onChange={handleChange} />
                {errors.firstName && touched.firstName && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.firstName}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Last Name'>
                  <Form.Control type="text" id="last_name" name='lastName' value={values.lastName} placeholder='Last Name' onChange={handleChange} />
                  {errors.lastName && touched.lastName && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.lastName}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Email Address'>
                <Form.Control type="email" id="email" name='email' value={values.email} placeholder='Email Address' onChange={handleChange} />
                {errors.email && touched.email && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.email}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Phone No.'>
                <Form.Control type="number" id="phone_no" name='phoneNo' value={values.phoneNo} placeholder='Phone No.' onChange={handleChange} />
                {errors.phoneNo && touched.phoneNo && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.phoneNo}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='City'>
                <Form.Control type="text" id="user_city" name='city' value={values.city} placeholder='City' onChange={handleChange} />
                {errors.city && touched.city && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.city}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              {rstcmpnyOpt ? (
                <FloatingLabel className="mb-3" label='Customer Name'>
                  <Form.Control type="hidden" id="user_cust_id" name='custId' value={values.custId} onChange={handleChange} />
                  <Form.Control disabled={true} type="text" id="user_cust_id_text" name='custIdText' value={defaults.option.custId.label} placeholder='Customer Name' />
                  {errors.custId && touched.custId && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.custId}</div>}
                </FloatingLabel>
              ) : (
                <FloatingLabel className="mb-3" label='Customer Name'>
                  <Form.Select id="user_cust_id" name='custId' value={values.custId} onChange={handleChange}>
                    <option>Select A Customer</option>
                    {cmpnyOptions.map((cmpny, ind) => (
                      <option key={ind} value={cmpny.value}>{cmpny.label}</option>
                    ))}
                  </Form.Select>
                  {errors.testDay && touched.testDay && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.testDay}</div>}
                </FloatingLabel>
              )}
            </Col>
            <Col xl='6'>
              <div className="mb-3 form-control" style={{ padding: '0.85rem 0.75rem'}} >
                <Form.Label htmlFor="is_active">Active Status</Form.Label>
                <Form.Check type="switch" className="m-0" id="is_active" name="isActive" checked={isActive} label="Inactive / Active" onChange={handleActivate} />
                {errors.isActive && touched.isActive && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.isActive}</div>}
              </div>
            </Col>
          </Row>      
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

export default UserAddEdit;
