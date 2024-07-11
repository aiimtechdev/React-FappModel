/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Row, Col, FloatingLabel } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { apiRequest } from "utils/request";

const PlanAddEdit = ({ tableInstance, saveItem }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal, defaults } = tableInstance;
  const initialValues = {
    cost:'',
    planName:''
  };
  
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(async() => {
    if (isOpenAddEditModal && selectedFlatRows.length === 1) {
        Object.entries(selectedFlatRows[0].original).map(([key, value]) => {
            value = (value === null) ? '' : value;
            setFieldValue(key, value);
          })
      setSelectedItem(selectedFlatRows[0].original);
    } else setSelectedItem(initialValues);
    return () => {};
  }, [isOpenAddEditModal, selectedFlatRows]);


  const validationSchema = Yup.object().shape({
    planName: Yup.string().required('Plan Name is required').matches(/^[A-Za-z\s]+$/, "Invalid name format."),
    cost: Yup.number().required("Plan Cost Is Required"),
  });

  const closeModal = () => {
    setIsOpenAddEditModal(false);
    resetForm();
  }

  const onSubmit = async() => {
    if (selectedFlatRows.length === 1) {
      let body = values
      body = {
        ...body,
        "planId": selectedItem.planId,
      }
      saveItem({item: body}, closeModal);
    } else saveItem({item: values, isAdd: true}, closeModal);
  //  closeModal();
  };
  
  const formik = useFormik({validationSchema, initialValues: initialValues, onSubmit, enableReinitialize: true, });
  const { handleSubmit, handleChange, values, touched, errors, setFieldValue, resetForm } = formik;

  return (
    <Modal show={isOpenAddEditModal} onHide={closeModal} animation={true}  backdrop="static" size='lg'>
      <Modal.Header closeButton>
        <Modal.Title className='text-primary'>{selectedFlatRows.length === 1 ? 'Edit' : 'Add'} Plan </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xl='12'>
              <FloatingLabel className="mb-3" label='Plan Name'>
                <Form.Control type="text" id="plan_name" name='planName' value={values.planName} placeholder='Plan Name' onChange={handleChange}/>
                {errors.planName && touched.planName && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.planName}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Frequency'>
                <Form.Control type="text" id="frequency" name='frequency' value={values.frequency} placeholder='Frequency' onChange={handleChange} disabled />
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Cost'>
                  <Form.Control type="text" id="cost" name='cost' value={values.cost} placeholder='Cost' onChange={handleChange} />
                  {errors.cost && touched.cost && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.cost}</div>}
              </FloatingLabel>
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

export default PlanAddEdit;
