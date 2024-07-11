/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Row, Col, FloatingLabel } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { apiRequest } from "utils/request";

const DeviceAddEdit = ({ tableInstance, saveItem }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal, defaults } = tableInstance;
  const initialValues = {
    dvceReg: '', dvceName: '', deviceType: '',
    testDay: '', testTiming: '', isActive: true, custId: ''
  };
  
  const [selectedItem, setSelectedItem] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [cmpnyOptions, setCmpnyOptions] = useState([]);
  const [rstcmpnyOpt, setRstCmpnyOpt] = useState(false);
  const [testTiming, setTestTiming] = useState('');

  const handleActivate = (e) => {
    values.isActive = e.target.checked;
    setIsActive(!isActive);
  }

  useEffect(() => { values.testTiming = testTiming; }, [testTiming]);

  useEffect(async() => {
    if(isOpenAddEditModal) {
      if(typeof defaults.option !== 'undefined' && defaults.option.custId) {
        setRstCmpnyOpt(true)
        setFieldValue('custId', defaults.option.custId.value);
      } else {
        const resp = await apiRequest('/customer/list/dropDown', 'GET', undefined, localStorage.getItem("token"));
        if(resp.status === 'success' && resp.data.status === 'success') setCmpnyOptions(resp.data.data);
      }
    }
    if (isOpenAddEditModal && selectedFlatRows.length === 1) {
      setSelectedItem(selectedFlatRows[0].original);
      Object.entries(selectedFlatRows[0].original).map(([key, value]) => {
        if (key == 'isActive') setIsActive(value)
        if (key == 'testTiming') setTestTiming(value)
        value = (value === null) ? '' : value;
        setFieldValue(key, value);
      })
    } else setSelectedItem(initialValues);
    return () => {};
  }, [isOpenAddEditModal, selectedFlatRows]);


  const validationSchema = Yup.object().shape({
    dvceReg: Yup.string().required('Device Register is required'),
    dvceName: Yup.string().required("Device Name is required").matches(/^[A-Za-z\s0-9]+$/, "Invalid name format."),
    deviceType: Yup.string().required("Device Type is required"),
    testDay: Yup.string(),
    TestTiming: Yup.string(),
    isActive: Yup.bool(),
    custId: Yup.number()
  });

  const closeModal = () => {
   setIsOpenAddEditModal(false);
    resetForm();
   setIsActive(true)
    setTestTiming('')
  }

  const onSubmit = async() => {
    if(rstcmpnyOpt) setFieldValue('custId', defaults.option.custId.value);
    if (selectedFlatRows.length === 1) {
      let body = values
      body = {
        ...body,
        "dvceId": selectedItem.dvceId,
      }
      saveItem({item: body},closeModal);
    } else saveItem({item: values, isAdd: true}, closeModal);
    //closeModal();
  };
  
  const formik = useFormik({validationSchema, initialValues: initialValues, onSubmit, enableReinitialize: true, });
  const { handleSubmit, handleChange, values, touched, errors, setFieldValue, resetForm } = formik;
  return (
    <Modal show={isOpenAddEditModal} onHide={closeModal} animation={true}  backdrop="static" size='xl'>
      <Modal.Header closeButton>
        <Modal.Title className='text-primary'>{selectedFlatRows.length === 1 ? 'Edit' : 'Add'} Device </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Device Register'>
                <Form.Control type="text" id="device_reg" name='dvceReg' value={values.dvceReg} placeholder='Device Register' onChange={handleChange} />
                {errors.dvceReg && touched.dvceReg && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.dvceReg}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Device Name'>
                  <Form.Control type="text" id="device_name" name='dvceName' value={values.dvceName} placeholder='Device Name' onChange={handleChange} />
                  {errors.dvceName && touched.dvceName && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.dvceName}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Device Type'>
                <Form.Select id="device_type" name='deviceType' value={values.deviceType} onChange={handleChange}>
                  <option value="">Choose a Device Type</option>
                  <option value="L864">L864</option>
                  <option value="E864">E864</option>
                </Form.Select>
                {errors.deviceType && touched.deviceType && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.deviceType}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <FloatingLabel className="mb-3" label='Test Day'>
                <Form.Select id="test_day" name='testDay' value={values.testDay} onChange={handleChange}>
                  <option value="">Choose a Day</option>
                  <option value="sun">Sunday</option>
                  <option value="mon">Monday</option>
                  <option value="tue">Tuesday</option>
                  <option value="wed">Wednesday</option>
                  <option value="thu">Thursday</option>
                  <option value="fri">Friday</option>
                  <option value="sat">Saturday</option>
                </Form.Select>
                {errors.testDay && touched.testDay && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.testDay}</div>}
              </FloatingLabel>
            </Col>
            <Col xl='6'>
              <div className="mb-3 form-control" style={{ padding: '0.75rem'}} >
                <Form.Label htmlFor="test_timing" className='me-3'>Test Timing</Form.Label>
                <TimePicker id="test_timing" value={testTiming} onChange={setTestTiming} />
                {errors.testTiming && touched.testTiming && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.testTiming}</div>}
              </div>
            </Col>
            <Col xl='6'>
              {rstcmpnyOpt ? (
                <FloatingLabel className="mb-3" label='Customer Name'>
                  <Form.Control type="hidden" id="device_cust_id" name='custId' value={values.custId} onChange={handleChange} />
                  <Form.Control disabled={true} type="text" id="device_cust_id_text" name='custIdText' value={defaults.option.custId.label} placeholder='Customer Name' />
                  {errors.custId && touched.custId && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.custId}</div>}
                </FloatingLabel>
              ) : (
                <FloatingLabel className="mb-3" label='Customer Name'>
                  <Form.Select id="device_cust_id" name='custId' value={values.custId} onChange={handleChange}>
                    <option value="">Select A Customer</option>
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

export default DeviceAddEdit;
